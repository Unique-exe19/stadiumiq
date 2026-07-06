# =============================================================================
# RAG Router – Retrieval-Augmented Generation endpoints
# =============================================================================

from typing import List, Optional
import structlog
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from src.config import get_settings, Settings
from src.rag.vector_store import VectorStoreClient, RagDocument
from src.embeddings.gemini_embeddings import GeminiEmbeddingService

logger = structlog.get_logger(__name__)
router = APIRouter()


class RetrieveRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    stadium_id: Optional[str] = Field(None)
    top_k: int = Field(default=5, ge=1, le=10)
    score_threshold: Optional[float] = Field(None, ge=0.0, le=1.0)


class DocumentResult(BaseModel):
    content: str
    source: str
    score: float
    metadata: dict


class RetrieveResponse(BaseModel):
    query: str
    documents: List[DocumentResult]
    total: int


class IngestRequest(BaseModel):
    documents: List[dict] = Field(..., max_length=100)


def get_vector_store(request: Request) -> VectorStoreClient:
    return request.app.state.vector_store


def get_settings_dep() -> Settings:
    return get_settings()


@router.post("/retrieve", response_model=RetrieveResponse)
async def retrieve_context(
    body: RetrieveRequest,
    vector_store: VectorStoreClient = Depends(get_vector_store),
    settings: Settings = Depends(get_settings_dep),
) -> RetrieveResponse:
    """Retrieve relevant documents from the knowledge base for RAG."""
    embedding_service = GeminiEmbeddingService(settings)

    try:
        query_embedding = await embedding_service.embed_text(body.query)
    except Exception as e:
        logger.error("Embedding generation failed", error=str(e))
        raise HTTPException(status_code=503, detail="Embedding service unavailable")

    documents: List[RagDocument] = await vector_store.search(
        query_vector=query_embedding,
        top_k=body.top_k,
        score_threshold=body.score_threshold or settings.RAG_SCORE_THRESHOLD,
        stadium_id=body.stadium_id,
    )

    return RetrieveResponse(
        query=body.query,
        documents=[
            DocumentResult(
                content=doc.content,
                source=doc.source,
                score=doc.score,
                metadata=doc.metadata,
            )
            for doc in documents
        ],
        total=len(documents),
    )


@router.post("/ingest", status_code=201)
async def ingest_documents(
    body: IngestRequest,
    vector_store: VectorStoreClient = Depends(get_vector_store),
    settings: Settings = Depends(get_settings_dep),
) -> dict:
    """Ingest documents into the knowledge base."""
    embedding_service = GeminiEmbeddingService(settings)

    document_ids = []
    embeddings = []
    payloads = []

    for doc in body.documents:
        content = str(doc.get("content", ""))
        if not content.strip():
            continue

        try:
            embedding = await embedding_service.embed_text(content)
        except Exception as e:
            logger.error("Failed to embed document", error=str(e))
            continue

        import uuid
        document_ids.append(str(doc.get("id", uuid.uuid4())))
        embeddings.append(embedding)
        payloads.append({
            "content": content[:5000],  # Payload size limit
            "source": str(doc.get("source", "")),
            "category": str(doc.get("category", "general")),
            "language": str(doc.get("language", "en")),
            "stadium_id": str(doc.get("stadium_id", "global")),
            "title": str(doc.get("title", "")),
        })

    if document_ids:
        await vector_store.upsert_documents(document_ids, embeddings, payloads)

    logger.info("Documents ingested", count=len(document_ids))
    return {"ingested": len(document_ids), "skipped": len(body.documents) - len(document_ids)}

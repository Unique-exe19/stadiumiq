# =============================================================================
# Vector Store Client – Qdrant RAG Pipeline
# =============================================================================

from typing import List, Optional
import structlog
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    ScoredPoint,
)

from src.config import Settings

logger = structlog.get_logger(__name__)


class RagDocument:
    def __init__(self, content: str, source: str, score: float, metadata: dict):
        self.content = content
        self.source = source
        self.score = score
        self.metadata = metadata


class VectorStoreClient:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client = AsyncQdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY,
            timeout=10,
        )

    async def initialize(self) -> None:
        """Create collection if it doesn't exist."""
        try:
            collections = await self._client.get_collections()
            existing = {c.name for c in collections.collections}

            if self._settings.QDRANT_COLLECTION not in existing:
                await self._client.create_collection(
                    collection_name=self._settings.QDRANT_COLLECTION,
                    vectors_config=VectorParams(
                        size=self._settings.QDRANT_VECTOR_SIZE,
                        distance=Distance.COSINE,
                    ),
                )
                logger.info("Qdrant collection created", collection=self._settings.QDRANT_COLLECTION)
            else:
                logger.info("Qdrant collection ready", collection=self._settings.QDRANT_COLLECTION)
        except Exception as e:
            logger.error("Failed to initialize Qdrant", error=str(e))
            raise

    async def upsert_documents(
        self,
        document_ids: List[str],
        embeddings: List[List[float]],
        payloads: List[dict],
    ) -> None:
        points = [
            PointStruct(id=doc_id, vector=embedding, payload=payload)
            for doc_id, embedding, payload in zip(document_ids, embeddings, payloads)
        ]
        await self._client.upsert(
            collection_name=self._settings.QDRANT_COLLECTION,
            points=points,
        )
        logger.info("Documents upserted", count=len(points))

    async def search(
        self,
        query_vector: List[float],
        top_k: int = 5,
        score_threshold: float = 0.65,
        stadium_id: Optional[str] = None,
    ) -> List[RagDocument]:
        filter_condition = None
        if stadium_id:
            filter_condition = Filter(
                should=[
                    FieldCondition(key="stadium_id", match=MatchValue(value=stadium_id)),
                    FieldCondition(key="stadium_id", match=MatchValue(value="global")),
                ]
            )

        results: List[ScoredPoint] = await self._client.search(
            collection_name=self._settings.QDRANT_COLLECTION,
            query_vector=query_vector,
            limit=top_k,
            score_threshold=score_threshold,
            query_filter=filter_condition,
            with_payload=True,
        )

        return [
            RagDocument(
                content=str(r.payload.get("content", "") if r.payload else ""),
                source=str(r.payload.get("source", "") if r.payload else ""),
                score=r.score,
                metadata=dict(r.payload) if r.payload else {},
            )
            for r in results
        ]

    async def close(self) -> None:
        await self._client.close()

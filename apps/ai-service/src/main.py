# =============================================================================
# StadiumIQ AI Service – FastAPI Application
# =============================================================================

from contextlib import asynccontextmanager
from typing import AsyncGenerator

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from src.config import get_settings
from src.routers import rag, embeddings, agents, health
from src.middleware.api_key import APIKeyMiddleware
from src.middleware.request_id import RequestIDMiddleware
from src.rag.vector_store import VectorStoreClient

logger = structlog.get_logger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Initialize resources on startup, clean up on shutdown."""
    logger.info("AI Service starting up", environment=settings.ENVIRONMENT)

    # Initialize Qdrant vector store
    vector_store = VectorStoreClient(settings)
    await vector_store.initialize()
    app.state.vector_store = vector_store

    logger.info("AI Service ready")
    yield

    logger.info("AI Service shutting down")
    await vector_store.close()


def create_app() -> FastAPI:
    app = FastAPI(
        title="StadiumIQ AI Service",
        description="FIFA World Cup 2026 – Generative AI & RAG Microservice",
        version="1.0.0",
        docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
        redoc_url=None,
        lifespan=lifespan,
    )

    # Security middleware
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type", "Authorization", "X-API-Key", "X-Request-ID"],
    )
    app.add_middleware(APIKeyMiddleware)
    app.add_middleware(RequestIDMiddleware)

    # Prometheus metrics
    Instrumentator(
        should_group_status_codes=True,
        should_ignore_untemplated=True,
        excluded_handlers=["/health", "/metrics"],
    ).instrument(app).expose(app)

    # Routers
    app.include_router(health.router, prefix="/health", tags=["Health"])
    app.include_router(rag.router, prefix="/api/rag", tags=["RAG"])
    app.include_router(embeddings.router, prefix="/api/embeddings", tags=["Embeddings"])
    app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])

    return app


app = create_app()

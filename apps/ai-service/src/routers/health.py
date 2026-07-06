# =============================================================================
# Health Router
# =============================================================================

from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/live")
async def liveness() -> dict:
    return {"status": "ok", "service": "stadiumiq-ai"}


@router.get("/ready")
async def readiness(request: Request) -> dict:
    try:
        vector_store = request.app.state.vector_store
        # Ping Qdrant
        await vector_store._client.get_collections()
        return {"status": "ok", "dependencies": {"qdrant": "healthy"}}
    except Exception as e:
        return {"status": "degraded", "dependencies": {"qdrant": str(e)}}

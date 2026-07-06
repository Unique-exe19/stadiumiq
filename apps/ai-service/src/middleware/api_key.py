# =============================================================================
# API Key Middleware – Internal service authentication
# =============================================================================

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from src.config import get_settings

EXCLUDED_PATHS = {"/health/live", "/health/ready", "/metrics"}


class APIKeyMiddleware(BaseHTTPMiddleware):
    def __init__(self, app) -> None:
        super().__init__(app)
        self._api_key = get_settings().AI_SERVICE_API_KEY

    async def dispatch(self, request: Request, call_next) -> Response:
        if request.url.path in EXCLUDED_PATHS:
            return await call_next(request)

        api_key = request.headers.get("X-API-Key")
        if not api_key or api_key != self._api_key:
            return JSONResponse(
                status_code=401,
                content={"success": False, "error": {"code": "UNAUTHORIZED", "message": "Invalid API key"}},
            )

        return await call_next(request)

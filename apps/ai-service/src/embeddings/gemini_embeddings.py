# =============================================================================
# Gemini Embedding Service with NVIDIA NIM fallback
# =============================================================================

import os
from typing import List
import structlog
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import google.generativeai as genai

from src.config import Settings

logger = structlog.get_logger(__name__)


class GeminiEmbeddingService:
    def __init__(self, settings: Settings) -> None:
        self.gemini_key = settings.GEMINI_API_KEY
        self.nvidia_key = os.getenv("NVIDIA_API_KEY", "")
        
        self.use_nvidia = (
            not self.gemini_key 
            or "placeholder" in self.gemini_key 
            or "CHANGE_ME" in self.gemini_key
        )
        
        if not self.use_nvidia:
            genai.configure(api_key=self.gemini_key)
        self._model = settings.GEMINI_EMBEDDING_MODEL

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10),
        retry=retry_if_exception_type(Exception),
    )
    async def embed_text(self, text: str) -> List[float]:
        """Generate text embedding with retry logic."""
        truncated = text[:8000]

        if self.use_nvidia and self.nvidia_key:
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        "https://integrate.api.nvidia.com/v1/embeddings",
                        headers={"Authorization": f"Bearer {self.nvidia_key}"},
                        json={
                            "input": [truncated],
                            "model": "nvidia/embeddings-nv-embed-qa-4",
                            "encoding_format": "float"
                        },
                        timeout=5.0
                    )
                    if response.status_code == 200:
                        return response.json()["data"][0]["embedding"]
                    else:
                        logger.warn("Nvidia embeddings returned error status", status=response.status_code)
            except Exception as e:
                logger.warn("Nvidia embedding HTTP request failed, using dummy fallback", error=str(e))
            # Return dummy 768-dimension vector
            return [0.0] * 768

        result = genai.embed_content(
            model=f"models/{self._model}",
            content=truncated,
            task_type="retrieval_document",
        )
        return result["embedding"]

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Embed multiple texts efficiently."""
        results = []
        for text in texts:
            embedding = await self.embed_text(text)
            results.append(embedding)
        return results

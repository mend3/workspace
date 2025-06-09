from typing import Literal, Optional, List, Union
from langchain_core.embeddings import Embeddings
from sentence_transformers import SentenceTransformer
from torch import Tensor

from ..config import CACHE_FOLDER


class FastEmbedLangchainWrapper(Embeddings):
    _embedder: SentenceTransformer

    def __init__(self, model_name: str, cache_dir=None, providers=None):
        from sentence_transformers import SentenceTransformer
        self._embedder = SentenceTransformer(
            model_name_or_path=model_name,
            cache_folder=cache_dir,
        )

    def embed_documents(self, texts: List[str]) -> list[Tensor]:
        return list(self._embedder.encode(texts, convert_to_numpy=True))

    def embed_query(self, text: str) -> List[float]:
        return next(self._embedder.encode([text], convert_to_numpy=True))

    def __deepcopy__(self, memo):
        # Retorna self sem fazer cópia profunda
        return self


class EmbeddingFactory:
    @staticmethod
    def create(
        provider: Union[Literal["fastembed", "huggingface"], str],
        model_name: str,
        cache_dir: Optional[str] = None,
        use_gpu: bool = False,
    ) -> Embeddings:
        if provider == "fastembed":
            return FastEmbedLangchainWrapper(
                model_name=model_name,
                cache_dir=cache_dir or CACHE_FOLDER,
                providers=["CUDAExecutionProvider"] if use_gpu else [
                    "CPUExecutionProvider"]
            )
        elif provider == "huggingface":
            from langchain_huggingface import HuggingFaceEmbeddings
            return HuggingFaceEmbeddings(
                model_name=model_name,
                cache_folder=cache_dir or CACHE_FOLDER,
                model_kwargs={"device": "cuda" if use_gpu else "cpu"}
            )
        raise ValueError(f"Unsupported embedding provider: {provider}")

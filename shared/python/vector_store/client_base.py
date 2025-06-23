from abc import ABC, abstractmethod
from typing import List
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings


class VectorStoreClient(ABC):
    def __init__(self, collection_name: str, embeddings: Embeddings):
        self.collection_name = collection_name
        self.embeddings = embeddings

    @abstractmethod
    def load(self, documents: List[Document], incremental: bool):
        pass

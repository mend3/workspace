from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from langchain_core.embeddings import Embeddings
from .client_base import VectorStoreClient


class QdrantStore(VectorStoreClient):
    def __init__(self, collection_name, embeddings: Embeddings, qdrant_url: str):
        super().__init__(collection_name, embeddings)
        self.qdrant_url = qdrant_url

    def load(self, documents, incremental: bool):
        client = QdrantClient(url=self.qdrant_url)

        # cria a collection se não existir
        if self.collection_name not in [
            c.name for c in client.get_collections().collections
        ]:
            client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=384,  # ou use: self.embeddings.embedding_dimensions
                    distance=Distance.COSINE,
                ),
            )
        store = QdrantVectorStore(
            client=client,
            collection_name=self.collection_name,
            embedding=self.embeddings,
            content_payload_key="content",
        )

        store.add_documents(documents)

        return store

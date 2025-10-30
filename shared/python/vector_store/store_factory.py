from .client_qdrant import QdrantStore
from .client_pinecone import PineconeVectorStore
from .client_pgvector import PgVectorVectorStore
from config import PGVECTOR_CONNECTION_STRING, QDRANT_URL, PINECONE_API_KEY
from typing import Literal


class VectorStoreFactory:
    def __init__(self, store: Literal["qdrant", "pinecone", "pgvector"], **kwargs):
        self.store = store
        self.kwargs = kwargs

    def create_client(self):
        collection_name = self.kwargs["collection_name"]
        embeddings = self.kwargs["embeddings"]

        common_data = {"collection_name": collection_name, "embeddings": embeddings}

        if self.store == "qdrant":
            return QdrantStore(
                **common_data, qdrant_url=self.kwargs.get("qdrant_url", QDRANT_URL)
            )
        elif self.store == "pinecone":
            return PineconeVectorStore(
                **common_data,
                api_key=self.kwargs.get("pinecone_api_key", PINECONE_API_KEY),
                environment=self.kwargs["pinecone_environment"],
                dimension=self.kwargs.get("dimension", 384),
            )
        elif self.store == "pgvector":
            return PgVectorVectorStore(
                **common_data,
                connection_string=self.kwargs.get(
                    "pgvector_connection_string", PGVECTOR_CONNECTION_STRING
                ),
                pre_delete_collection=self.kwargs.get("pre_delete_collection", False),
            )
        else:
            raise ValueError(f"Backend '{self.store}' not implemented.")

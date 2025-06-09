from langchain_community.vectorstores.pgvector import PGVector, DistanceStrategy
from .client_base import VectorStoreClient
from langchain_core.documents import Document


class PgVectorVectorStore(VectorStoreClient):
    def __init__(
        self,
        collection_name,
        embeddings,
        connection_string: str,
        pre_delete_collection: bool = False,
    ):
        super().__init__(collection_name, embeddings)
        self.connection_string = connection_string
        self.pre_delete_collection = pre_delete_collection

    def load(self, documents: list[Document], incremental: bool):

        texts = [doc.page_content for doc in documents]
        metadatas = [doc.metadata for doc in documents]

        # return PGVector.from_texts(
        #     texts,
        #     embedding=self.embeddings,
        #     metadatas=list(metadatas),
        #     collection_name=self.collection_name,
        #     connection_string=self.connection_string,
        #     use_jsonb=True,
        #     pre_delete_collection=self.pre_delete_collection or not incremental,
        #     distance_strategy=DistanceStrategy.COSINE,
        # )

        return PGVector.from_documents(
            documents,
            embedding=self.embeddings,
            collection_name=self.collection_name,
            connection_string=self.connection_string,
            use_jsonb=True,
            pre_delete_collection=self.pre_delete_collection or not incremental,
            distance_strategy=DistanceStrategy.COSINE,
        )

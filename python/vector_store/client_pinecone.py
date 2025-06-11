import pinecone
from langchain_community.vectorstores import Pinecone as LangchainPinecone
from .client_base import VectorStoreClient


class PineconeVectorStore(VectorStoreClient):
    def __init__(
        self,
        collection_name,
        embeddings,
        api_key,
        environment,
        dimension=384
    ):
        super().__init__(collection_name, embeddings)
        self.api_key = api_key
        self.environment = environment
        self.dimension = dimension

    def load(self, documents, incremental: bool):
        pinecone.init(api_key=self.api_key, environment=self.environment)

        if self.collection_name not in pinecone.list_indexes():
            pinecone.create_index(
                self.collection_name,
                dimension=self.dimension,
            )

        index = pinecone.Index(self.collection_name)
        store = LangchainPinecone(index, self.embeddings, text_key="text")

        if not incremental:
            index.delete(delete_all=True)

        store.add_documents(documents)
        return store

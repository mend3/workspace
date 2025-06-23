from typing import List, Literal
from langchain.indexes import SQLRecordManager, index
from langchain_core.documents import Document
from .store_factory import VectorStoreFactory
from .embedding_factory import EmbeddingFactory
from ..config import (
    PGVECTOR_CONNECTION_STRING,
    EMBEDDING_MODEL,
    EMBEDDING_PROVIDER,
    CACHE_FOLDER,
)


class VectorStoreHandler:
    def __init__(
        self,
        colletion_name: str,
        store: Literal["pgvector", "qdrant", "pinecone"] = "pgvector",
    ):
        self.collectionName = colletion_name
        self.store = store
        self.namespace = f"{store}/{colletion_name}"

        if self.store == "pgvector" and not PGVECTOR_CONNECTION_STRING:
            raise ValueError("PGVECTOR_CONNECTION_STRING is not set")

        db_url = (
            PGVECTOR_CONNECTION_STRING
            if self.store == "pgvector"
            else "sqlite:///./.cache/record_manager_cache.sql"
        )
        engine_kwargs = (
            None
            if self.store == "pgvector"
            else {
                "echo": True,
                "pool_pre_ping": True,
                "pool_recycle": 3600,
                "pool_size": 10,
                "max_overflow": 20,
                "pool_timeout": 30,
                "pool_use_lifo": True,
            }
        )

        self.record_manager = SQLRecordManager(
            self.namespace, db_url=db_url, engine_kwargs=engine_kwargs
        )

        self.record_manager.create_schema()

    def save(
        self,
        context: List[tuple[str, Document]],
        incremental: bool = False,
    ):
        """
        Split the content, embed, and upload to pgvector.
        """

        existing_keys = set()
        if incremental:
            existing_keys = set(self.record_manager.list_keys())

        documents = []

        for idx, document in context:
            if incremental and idx in existing_keys:
                continue
            documents.append(document)

        if not documents:
            return

        embeddings = EmbeddingFactory.create(
            provider=EMBEDDING_PROVIDER,
            model_name=EMBEDDING_MODEL,
            use_gpu=True,
            cache_dir=CACHE_FOLDER,
        )

        store = (
            VectorStoreFactory(
                store=self.store,
                collection_name=self.collectionName,
                embeddings=embeddings,
            )
            .create_client()
            .load(documents, incremental=incremental)
        )

        index(
            docs_source=documents,
            record_manager=self.record_manager,
            vector_store=store,
            cleanup="incremental" if incremental else "full",
            source_id_key="doc_id",
        )

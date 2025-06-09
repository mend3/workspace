from typing import List, Literal
from langchain.indexes import SQLRecordManager, index
from langchain_core.documents import Document
from .store_factory import VectorStoreFactory
from .embedding_factory import EmbeddingFactory
from ..config import PGVECTOR_CONNECTION_STRING, EMBEDDING_MODEL, EMBEDDING_PROVIDER


class VectorStoreHandler:
    def __init__(self, collectionName: str, store: Literal["pgvector", "qdrant", "pinecone"] = "pgvector"):
        self.collectionName = collectionName
        self.store = store
        self.namespace = f"{store}/{collectionName}"

        db_url = PGVECTOR_CONNECTION_STRING if self.store == "pgvector" else "sqlite:///./.cache/record_manager_cache.sql"
        engine_kwargs = None if self.store == "pgvector" else {
            "echo": True,
            "pool_pre_ping": True,
            "pool_recycle": 3600,
            "pool_size": 10,
            "max_overflow": 20,
            "pool_timeout": 30,
            "pool_use_lifo": True,
        }

        self.record_manager = SQLRecordManager(
            self.namespace, db_url=db_url, engine_kwargs=engine_kwargs
        )

        self.record_manager.create_schema()

    def save(
        self,
        context: List[tuple[str, Document]],
        incremental: bool = False,
    ) -> None:
        """
        Split the content, embed, and upload to pgvector.
        """

        existing_keys = set()
        if incremental:
            print("Loading existing chunk hashes for incremental indexing...")
            existing_keys = set(self.record_manager.list_keys())

        documents = []
        total_size = 0
        skipped = 0

        print(f"Indexing {len(context)} documents...")
        for idx, document in context:
            if incremental and idx in existing_keys:
                skipped += 1
                continue
            documents.append(document)
            total_size += document.metadata.get('chunk_length', 0)

        if not documents:
            print("No new or modified documents to index.")
            return

        print(
            f"✅ Documents created successfully with \n\t{len(documents)} files, \n\t{skipped} skipped, \n\t{total_size // 1024} KB.")

        print("Starting to create embeddings...")
        embeddings = EmbeddingFactory.create(
            provider=EMBEDDING_PROVIDER,
            model_name=EMBEDDING_MODEL,
            use_gpu=False
        )
        print("Embeddings created successfully!")

        print(
            f"Creating a {self.store} vector store via factory...")
        factory = VectorStoreFactory(
            store=self.store,
            collection_name=self.collectionName,
            embeddings=embeddings,
        )
        client = factory.create_client()
        print(f"Vector store client created successfully!")

        print(
            f"Creating store and loading documents into vector store...")
        store = client.create_or_load(documents, incremental=False)
        print(f"Documents loaded into vector store successfully!")

        print("Starting to index...")
        index(
            docs_source=documents,
            record_manager=self.record_manager,
            vector_store=store,
            cleanup="incremental" if incremental else "full",
            source_id_key="chunk_hash"
        )
        print("Indexing completed successfully!")

        print(
            f"Vector store '{self.collectionName}' created and saved successfully!")

import os
from datetime import date
from typing import Literal
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.indexes import SQLRecordManager, index
from langchain_core.documents import Document
from .store_factory import VectorStoreFactory
from .embedding_factory import EmbeddingFactory
from ..lib.utils import chunk_hash
from ..config import PGVECTOR_CONNECTION_STRING, EMBEDDING_MODEL, EMBEDDING_PROVIDER


class VectorStoreHandler:
    def __init__(self, collectionName: str, store: Literal["pgvector", "qdrant", "pinecone"] = "pgvector"):
        self.collectionName = collectionName
        self.store = store
        self.namespace = f"{store}/{collectionName}"
        self.record_manager = SQLRecordManager(
            self.namespace, db_url=PGVECTOR_CONNECTION_STRING, engine_kwargs={
                "echo": False,
                "pool_pre_ping": True,
                "pool_recycle": 3600,
                "pool_size": 10,
                "max_overflow": 20,
                "pool_timeout": 30,
                "pool_use_lifo": True,
            }
        ) if self.store == "pgvector" else SQLRecordManager(
            self.namespace, db_url="sqlite:///.cache/record_manager_cache.sql"
        )

        self.record_manager.create_schema()

    def save(
        self,
        content: str,
        incremental: bool = False,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ) -> None:
        """
        Split the content, embed, and upload to pgvector.
        """

        if not content.strip():
            print("No content to process for vector store.")
            return

        today = date.today()

        chunks = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap).split_text(content)
        print(f"Number of chunks: {len(chunks)}")

        existing_keys = set()
        if incremental:
            print("Loading existing chunk hashes for incremental indexing...")
            existing_keys = set(self.record_manager.list_keys())

        documents = []
        total_size = 0
        skipped = 0

        if chunks:
            print(f"Creating documents of {len(chunks)} chunks")
            for idx, chunk in enumerate(chunks):
                h = chunk_hash(chunk)
                if incremental and h in existing_keys:
                    skipped += 1
                    continue
                documents.append(
                    Document(
                        page_content=chunk,
                        metadata={
                            "updated_at": today.isoformat(),
                            "chunk_index": idx,
                            "chunk_hash": h,
                            "length": len(chunk)
                        }
                    )
                )
                total_size += len(chunk)

            if not documents:
                print("No new or modified documents to index.")
                return

            print(
                f"✅ Documents created successfully with \n\t{len(documents)} files, \n\t{skipped} skipped, \n\t{total_size // 1024} KB.")

            print("Starting to create embeddings...")
            embeddings = EmbeddingFactory.create(
                provider="huggingface",
                model_name=EMBEDDING_MODEL,
                use_gpu=False
            )
            print("Embeddings created successfully!")

            print(f"Creating a {self.store} vector store via factory...")
            factory = VectorStoreFactory(
                store=self.store,
                collection_name=self.collectionName,
                embeddings=embeddings,
            )
            client = factory.create_client()
            print(f"Vector store client created successfully!")

            print(f"Creating store and loading documents into vector store...")
            store = client.create_or_load(documents, incremental=False)
            print(f"Documents loaded into vector store successfully!")

            print("Starting to index...")
            index(
                docs_source=documents,
                record_manager=self.record_manager,
                vector_store=store,
                cleanup="incremental",
                source_id_key="chunk_hash"
            )
            print("Indexing completed successfully!")

            print(
                f"Vector store '{self.collectionName}' created and saved successfully!")
        else:
            print("No content extracted for vector store.")

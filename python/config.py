import os

EMBEDDING_MODEL = os.environ.get("EMBEDDING_MODEL")

EMBEDDING_PROVIDER = os.environ.get("EMBEDDING_PROVIDER")

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")

QDRANT_URL = os.environ.get("QDRANT_URL")

PGVECTOR_CONNECTION_STRING = os.environ.get("PGVECTOR_CONNECTION_STRING")

CACHE_FOLDER = os.environ.get(
    "HF_HOME", os.path.join(os.path.dirname(__file__), ".cache/hf")
)

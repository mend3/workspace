import os

EMBEDDING_MODEL = os.environ.get(
    "EMBEDDING_MODEL") or "sentence-transformers/all-MiniLM-L6-v2"

EMBEDDING_PROVIDER = os.environ.get("EMBEDDING_PROVIDER") or "fastembed"

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY") or "apilocal"

QDRANT_URL = os.environ.get("QDRANT_URL") or "http://localhost:6333"

PGVECTOR_CONNECTION_STRING = os.environ.get(
    "PGVECTOR_CONNECTION_STRING") or "postgresql+psycopg2://postgres:postgres@localhost:5433/vector_db"

CACHE_FOLDER = os.environ.get("HF_HOME", os.path.join(
    os.path.dirname(__file__), ".cache/hf"))

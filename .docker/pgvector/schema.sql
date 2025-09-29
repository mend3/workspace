-- 3. Enable pgvector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- 4. Create a sample table with a vector column
CREATE TABLE IF NOT EXISTS public.workspace_embedding (
    id SERIAL PRIMARY KEY,
    content TEXT,
    metadata JSONB,
    embedding VECTOR(1536)
);

CREATE TABLE IF NOT EXISTS public.docs_embedding (
    id SERIAL PRIMARY KEY,
    name TEXT,
    metadata JSONB,
    embedding VECTOR(384) -- sentence-transformers/all-MiniLM-L6-v2
);

CREATE TABLE IF NOT EXISTS public.supabase_vectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    item_data JSONB,
    embedding vector(1536) -- supabase vector data
);

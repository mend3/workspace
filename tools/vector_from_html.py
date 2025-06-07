from bs4 import BeautifulSoup
import os
import re
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_community.vectorstores.pgvector import PGVector
from .config import EMBEDDING_MODEL


def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    return text.strip()


def extract_content_from_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')
        return clean_text(soup.get_text(separator=' ', strip=True))


def create_vector_store():
    base_dir = "/docs/pages"
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=200)
    embeddings = FastEmbedEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cuda"}
    )

    all_chunks = []
    for file in os.listdir(base_dir):
        if file.endswith(".html"):
            path = os.path.join(base_dir, file)
            print(f"Processing: {path}")
            content = extract_content_from_file(path)
            if content:
                chunks = text_splitter.split_text(content)
                chunks_with_metadata = [
                    (chunk, {"source": file}) for chunk in chunks]
                all_chunks.extend(chunks_with_metadata)

    if all_chunks:
        texts, metadatas = zip(*all_chunks)
        CONNECTION_STRING = os.environ.get("PGVECTOR_CONNECTION_STRING")
        collection_name = os.environ.get("COLLECTION_NAME")
        PGVector.from_texts(
            texts,
            embeddings,
            metadatas=list(metadatas),
            collection_name=collection_name,
            connection_string=CONNECTION_STRING
        )
        print("Vector store created and saved successfully!")
    else:
        print("No content extracted.")


if __name__ == "__main__":
    create_vector_store()

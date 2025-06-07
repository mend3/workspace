import requests
from bs4 import BeautifulSoup
import time
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import re
from .config import EMBEDDING_MODEL


def clean_text(text):
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    return text.strip()


def extract_tutorial_content(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the first article element
        article = soup.find('article')
        if not article:
            return None

        # Find the content div
        content_div = article.find('div', class_='cPost_contentWrap')
        if not content_div:
            return None

        # Extract text content
        content = content_div.get_text(separator=' ', strip=True)
        return clean_text(content)

    except Exception as e:
        print(f"Error processing {url}: {str(e)}")
        return None


def create_vector_store():
    # Read URLs from LINKS.md
    with open('LINKS.md', 'r') as f:
        urls = [line.strip() for line in f if line.strip()
                and line.startswith('http')]

    # Initialize text splitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )

    # Initialize embeddings
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={'device': 'cpu'}
    )

    # Process each URL
    all_chunks = []
    for url in urls:
        print(f"Processing: {url}")
        content = extract_tutorial_content(url)
        if content:
            # Split content into chunks
            chunks = text_splitter.split_text(content)
            # Add URL as metadata to each chunk
            chunks_with_metadata = [
                (chunk, {"source": url}) for chunk in chunks]
            all_chunks.extend(chunks_with_metadata)
        time.sleep(1)  # Be nice to the server

    # Create vector store
    if all_chunks:
        texts, metadatas = zip(*all_chunks)
        vector_store = FAISS.from_texts(
            texts, embeddings, metadatas=list(metadatas))

        # Save vector store
        vector_store.save_local("url_embedding")
        print("Vector store created and saved successfully!")
    else:
        print("No content was extracted from the URLs.")


if __name__ == "__main__":
    create_vector_store()

import argparse
import requests
from bs4 import BeautifulSoup
import time
from typing import List
from datetime import date
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from ..lib.file import UTF8FileHandler
from ..lib.logger import logger
from ..lib.utils import sha256_hash, clean_text
from ..vector_store.store_handler import VectorStoreHandler


def extract_url_content(url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "identity",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        body = soup.find("body")
        if not body:
            return None

        content = body.get_text(separator=" ", strip=True)
        return clean_text(content)

    except Exception as e:
        print(f"Error processing {url}: {str(e)}")
        return None


def start(args):

    all_documents: List[tuple[str, Document]] = []
    today = date.today()
    file_handler = UTF8FileHandler()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

    def process_url(url: str, line_number: int):
        print(f"Line {line_number}, URL: {url}")
        try:
            content = extract_url_content(url)
            if content:
                chunks = text_splitter.split_text(content)
                for idx, chunk in enumerate(chunks):
                    chunk_hash = sha256_hash(chunk)
                    url_hash = sha256_hash(url)
                    all_documents.append(
                        (
                            chunk_hash,
                            Document(
                                page_content=chunk,
                                metadata={
                                    "source": url,
                                    "doc_id": url_hash,
                                    "updated_at": today.isoformat(),
                                    "chunk_hash": chunk_hash,
                                    "chunk_index": str(idx),
                                    "chunk_length": len(chunk),
                                },
                            ),
                        )
                    )
            time.sleep(1)
        except Exception as e:
            logger.error(f"Error processing {url}: {str(e)}")

    file_handler.read(args.file, callback=process_url)

    if args.store and len(all_documents) > 0:
        VectorStoreHandler(args.collection, store=args.store).save(
            context=all_documents, incremental=args.mode == "incremental"
        )


def main():
    parser = argparse.ArgumentParser(
        description="Generate project context and upload to vector store."
    )
    parser.add_argument(
        "--file",
        type=str,
        default=None,
        help="File to read the URLs from",
    )
    parser.add_argument(
        "--collection",
        type=str,
        default=None,
        help="Collection name to save the embeddings",
    )
    parser.add_argument(
        "--store",
        type=str,
        default="qdrant",
        choices=["pgvector", "qdrant", "pinecone"],
        help="Vector store to use (pgvector, qdrant, pinecone). Default is qdrant.",
    )
    parser.add_argument(
        "--mode",
        type=str,
        default="incremental",
        help="Mode to use (incremental, full). Default is incremental.",
    )
    args = parser.parse_args()

    if not args.file:
        logger.error("File is required")
        return
    if not args.collection:
        logger.error("Collection name is required")
        return

    start(args)


if __name__ == "__main__":
    main()

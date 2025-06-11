#!/usr/bin/env python3
import argparse
import os
import fnmatch
from typing import List
from datetime import date
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from ..lib.file import UTF8FileHandler, FileHandler
from ..lib.dir import OsScandirDirectoryScanner, DirectoryScanner
from ..lib.logger import logger
from ..lib.utils import sha256_hash, clean_text
from ..vector_store.store_handler import VectorStoreHandler

extensions = tuple([
    ".ts", ".tsx", ".js", ".jsx", ".java", ".xml", ".sql", ".py", ".md", ".txt", ".json",
    ".yaml", ".yml", ".toml", ".css", ".scss", ".sass", ".html", ".sh", ".xsd", ".cfg", ".conf",
    ".prisma", ".schema", ".mjs", ".prettierrc", ".eslintrc", ".eslintignore", ".mdc", ".tpl", ".tf"
])
today = date.today()


class ContextScanner:
    def __init__(self, file_handler: FileHandler, directory_scanner: DirectoryScanner,
                 text_splitter: RecursiveCharacterTextSplitter):
        self.file_handler = file_handler
        self.directory_scanner = directory_scanner
        self.text_splitter = text_splitter
        self.file_count = 0
        self.total_size = 0
        self.documents: List[tuple[str, Document]] = []

    def scan(
            self,
            root_dir: str,
            base: str = "",
            ignore_dirs: List[str] = None,
            ignore_files: List[str] = None,
            follow_symlinks: bool = False,
    ):
        """
        Recursively traverse the project directory starting at root_dir,
        reading the content of every file (non-hidden) along with its relative path.
        """
        if ignore_dirs is None:
            ignore_dirs = []
        if ignore_files is None:
            ignore_files = []

        # context_parts = []
        try:
            entries = self.directory_scanner.scan(root_dir)
            for entry in sorted(entries, key=lambda el: el.name):
                if entry.name.startswith('.'):
                    continue
                relative_path = os.path.join(
                    base, entry.name) if base else entry.name

                # Directory handling
                if entry.is_dir(follow_symlinks=follow_symlinks):
                    if any(fnmatch.fnmatch(entry.name, pattern) for pattern in ignore_dirs):
                        continue
                    # context_parts.append(f"=== Directory: {relative_path} ===\n")
                    self.scan(entry.path, relative_path,
                              ignore_dirs, ignore_files, follow_symlinks)
                # File handling
                elif entry.is_file(follow_symlinks=follow_symlinks) and entry.name.endswith(extensions):
                    if any(fnmatch.fnmatch(entry.name, pattern) for pattern in ignore_files):
                        continue
                    try:
                        content = self.file_handler.read(entry.path)
                    except Exception as e:
                        logger.error(f"{e}")
                        continue

                    if entry.name.endswith(('.html', '.htm')):
                        from bs4 import BeautifulSoup

                        def extract_content_from_file(path):
                            with open(path, 'r', encoding='utf-8') as f:
                                soup = BeautifulSoup(f, 'html.parser')
                                return clean_text(soup.get_text(separator=' ', strip=True))

                        content = extract_content_from_file(entry.path)

                    # context_parts.append(
                    #     f"=== File: {relative_path} ===\n"
                    #     f"{content}\n"
                    #     f"{'-'*40}\n"
                    # )
                    if not content:
                        logger.debug(f"Skipping empty file {relative_path}")
                        continue

                    chunks = self.text_splitter.split_text(content)
                    for idx, chunk in enumerate(chunks):
                        dir_hash = sha256_hash(os.path.dirname(entry.path))
                        chunk_hash = sha256_hash(chunk)
                        doc_id = sha256_hash(f"{dir_hash}-{chunk_hash}")
                        self.documents.append(
                            (chunk_hash, Document(
                                page_content=chunk,
                                metadata={
                                    "source": entry.path,
                                    "file_name": entry.name,
                                    "dir_hash": dir_hash,
                                    "doc_id": doc_id,
                                    "updated_at": today.isoformat(),
                                    "chunk_hash": chunk_hash,
                                    "chunk_index": str(idx),
                                    "chunk_length": len(chunk)
                                }
                            ))
                        )

                    self.file_count += 1
                    self.total_size += len(content)

        except Exception as e:
            logger.error(f"Error accessing {root_dir}: {e}")


def start(args, ignore_dir_patterns: List[str], ignore_file_patterns: List[str]):
    file_handler = UTF8FileHandler()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=200)
    directory_scanner = OsScandirDirectoryScanner()
    generator = ContextScanner(
        file_handler, directory_scanner, text_splitter)
    generator.scan(
        args.root,
        ignore_dirs=ignore_dir_patterns,
        ignore_files=ignore_file_patterns,
        follow_symlinks=True,
    )
    all_documents = generator.documents
    logger.info(f"({len(all_documents)}) documents mapped",
                extra={"context": "generator"})

    if args.store and len(all_documents) > 0:
        vector_store_handler = VectorStoreHandler(
            args.collection, store=args.store
        )
        vector_store_handler.save(
            context=all_documents, incremental=args.mode == "incremental")


def main():
    parser = argparse.ArgumentParser(
        description="Generate project context and upload to vector store."
    )
    parser.add_argument(
        "--root",
        type=str,
        default=".",
        help="Root directory of the project (default: current directory)",
    )
    parser.add_argument(
        "--collection",
        type=str,
        default=None,
        help="Collection name to save the embeddings",
    )
    parser.add_argument(
        "--ignore-dirs",
        type=str,
        default="dist,tmp,__pycache__,node_modules",
        help="Comma-separated folder name patterns to ignore (e.g., 'dist,tmp')",
    )
    parser.add_argument(
        "--ignore-files",
        type=str,
        default="package-lock.json,yarn.lock,pnpm-lock.yaml",
        help="Comma-separated file name patterns to ignore (e.g., 'package-lock.json,yarn.lock')",
    )
    parser.add_argument(
        "--mode",
        type=str,
        default="incremental",
        choices=["full", "incremental"],
        help="Ingestion mode: 'full' replaces the entire collection, 'incremental' only adds new/changed chunks."
    )
    parser.add_argument(
        "--store",
        type=str,
        default=None,
        choices=["pgvector", "qdrant", "pinecone"],
        help="Vector store to use (pgvector, qdrant, pinecone)"
    )

    args = parser.parse_args()
    ignore_dir_patterns = [pattern.strip()
                           for pattern in args.ignore_dirs.split(",") if pattern.strip()]
    ignore_file_patterns = [pattern.strip()
                            for pattern in args.ignore_files.split(",") if pattern.strip()]

    if not args.collection:
        logger.error("Collection name is required")
        return

    start(args, ignore_dir_patterns, ignore_file_patterns)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
import os
import re
import argparse
import fnmatch
from datetime import date
from typing import List
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from ..vector_store.store_handler import VectorStoreHandler
from ..lib.utils import chunk_hash
from ..lib.file import UTF8FileHandler, FileHandler
from ..lib.dir import OsScandirDirectoryScanner, DirectoryScanner


def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    return text.strip()


class ProjectContextScanner:
    def __init__(self, file_handler: FileHandler, directory_scanner: DirectoryScanner, text_splitter: RecursiveCharacterTextSplitter):
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
    ) -> None:
        """
        Recursively traverse the project directory starting at root_dir,
        reading the content of every file (non-hidden) along with its relative path.
        """
        if ignore_dirs is None:
            ignore_dirs = []
        if ignore_files is None:
            ignore_files = []

        # context_parts = []
        extensions = [
            ".ts", ".tsx", ".js", ".jsx", ".java", ".xml", ".sql", ".py", ".md", ".txt", ".json",
            ".yaml", ".yml", ".toml", ".css", ".scss", ".sass", ".html", ".sh", ".xsd", ".cfg", ".conf",
            ".prisma", ".schema", ".mjs", ".prettierrc", ".eslintrc", ".eslintignore", ".mdc", ".tpl", ".tf"
        ]
        exts = tuple(extensions)
        today = date.today()

        try:
            entries = self.directory_scanner.scan(root_dir)
            for entry in sorted(entries, key=lambda e: e.name):
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
                elif entry.is_file(follow_symlinks=follow_symlinks) and entry.name.endswith(exts):
                    if any(fnmatch.fnmatch(entry.name, pattern) for pattern in ignore_files):
                        continue
                    try:
                        content = self.file_handler.read(entry.path)
                    except Exception as e:
                        print(f"{e}", flush=True)
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
                        print(
                            f"Skipping empty file {relative_path}", flush=True)
                        continue

                    chunks = self.text_splitter.split_text(content)
                    for idx, chunk in enumerate(chunks):
                        dir_hash = chunk_hash(os.path.dirname(entry.path))
                        hash = chunk_hash(chunk)
                        chunk_id = "-".join([dir_hash, hash])
                        self.documents.append(
                            [hash, Document(
                                page_content=chunk,
                                metadata={
                                    "source": entry.name,
                                    "path": entry.path,
                                    "slug": clean_text(entry.name),
                                    "updated_at": today.isoformat(),
                                    "chunk_hash": hash,
                                    "chunk_index": str(idx),
                                    "chunk_length": len(chunk)
                                }
                            )]
                        )

                    self.file_count += 1
                    self.total_size += len(content)

        except Exception as e:
            print(f"Error accessing {root_dir}: {e}", flush=True)


def start(args, ignore_dir_patterns: List[str], ignore_file_patterns: List[str]):
    file_handler = UTF8FileHandler()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=200)
    directory_scanner = OsScandirDirectoryScanner()
    generator = ProjectContextScanner(
        file_handler, directory_scanner, text_splitter)
    print(f"Generating new context from {args.root}", flush=True)
    generator.scan(
        args.root,
        ignore_dirs=ignore_dir_patterns,
        ignore_files=ignore_file_patterns,
        follow_symlinks=True,
    )
    all_documents = generator.documents
    print(
        f"✅ Context generated with {generator.file_count} files and {len(all_documents)} documents.\n\tTotal size: {generator.total_size // 1024} KB.")

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
        print("Collection name is required", flush=True)
        return

    print(f"Base directory: {args.root}", flush=True)
    print(f"Collection name: {args.collection}", flush=True)
    print(f"Ignore patterns: {ignore_dir_patterns}", flush=True)
    print(f"Ingestion mode: {args.mode}", flush=True)
    print(f"Vector Store: {args.store}", flush=True)

    start(args, ignore_dir_patterns, ignore_file_patterns)


if __name__ == "__main__":
    main()

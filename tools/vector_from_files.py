#!/usr/bin/env python3
import os
import argparse
import fnmatch
from typing import List
from .vector_store.store_handler import VectorStoreHandler
from .lib.file import UTF8FileHandler, FileHandler
from .lib.dir import OsScandirDirectoryScanner, DirectoryScanner


class ProjectContextGenerator:
    def __init__(self, file_handler: FileHandler, directory_scanner: DirectoryScanner):
        self.file_handler = file_handler
        self.directory_scanner = directory_scanner
        self.file_count = 0
        self.total_size = 0

    def generate(
        self,
        root_dir: str,
        base: str = "",
        ignore_dirs: List[str] = None,
        ignore_files: List[str] = None,
        follow_symlinks: bool = False,
    ) -> str:
        """
        Recursively traverse the project directory starting at root_dir,
        reading the content of every file (non-hidden) along with its relative path.
        """
        if ignore_dirs is None:
            ignore_dirs = []
        if ignore_files is None:
            ignore_files = []

        context_parts = []
        extensions = [
            ".ts", ".tsx", ".js", ".jsx", ".java", ".xml", ".sql", ".py", ".md", ".txt", ".json",
            ".yaml", ".yml", ".toml", ".css", ".scss", ".sass", ".html", ".sh", ".xsd", ".cfg", ".conf",
            ".prisma", ".schema", ".mjs", ".prettierrc", ".eslintrc", ".eslintignore", ".mdc", ".tpl", ".tf"
        ]
        exts = tuple(extensions)

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
                    context_parts.append(
                        f"=== Directory: {relative_path} ===\n")
                    context_parts.append(
                        self.generate(entry.path, relative_path,
                                      ignore_dirs, ignore_files, follow_symlinks)
                    )

                # File handling
                elif entry.is_file(follow_symlinks=follow_symlinks) and entry.name.endswith(exts):
                    if any(fnmatch.fnmatch(entry.name, pattern) for pattern in ignore_files):
                        continue
                    try:
                        content = self.file_handler.read(entry.path)
                    except Exception as e:
                        print(f"Skipping file {relative_path}: {e}")
                        continue
                    context_parts.append(
                        f"=== File: {relative_path} ===\n"
                        f"{content}\n"
                        f"{'-'*40}\n"
                    )
                    self.file_count += 1
                    self.total_size += len(content)

        except Exception as e:
            print(f"Error accessing {root_dir}: {e}")

        return "\n".join(context_parts)


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
        "--output",
        type=str,
        default=".cache/ai-context.txt",
        help="Output file (absolute path of the file to save the context)",
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
        default="dist,.tmp,node_modules,.docker",
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
        print("Collection name is required")
        return

    print(f"Base directory: {args.root}")
    print(f"Output file: {args.output}")
    print(f"Collection name: {args.collection}")
    print(f"Ignore patterns: {ignore_dir_patterns}")
    print(f"Ingestion mode: {args.mode}")
    print(f"Vector Store: {args.store}")

    file_handler = UTF8FileHandler()

    relative_output = os.path.join(args.root, args.output)
    already_exists = os.path.exists(relative_output)

    if already_exists:
        print(f"Using existing context from {args.output}")
        context = file_handler.read(args.output)
    else:
        directory_scanner = OsScandirDirectoryScanner()
        generator = ProjectContextGenerator(
            file_handler, directory_scanner)
        print(f"Generating new context from {args.root}")
        context = generator.generate(
            args.root,
            ignore_dirs=ignore_dir_patterns,
            ignore_files=ignore_file_patterns,
            follow_symlinks=True,
        )
        print(
            f"✅ Context generated with {generator.file_count} files, total size: {generator.total_size // 1024} KB.")
        if args.output and context:
            file_handler.write(context, args.output)

    if args.store and context:
        vector_store_handler = VectorStoreHandler(
            args.collection, store=args.store
        )
        vector_store_handler.save(
            content=context, incremental=args.mode == "incremental")


if __name__ == "__main__":
    main()

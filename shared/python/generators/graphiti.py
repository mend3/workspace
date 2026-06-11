#!/usr/bin/env python3
"""
Ingest local files from the brain folder into a Graphiti knowledge graph.

This script recursively processes files from a specified directory and adds them
as episodes to Graphiti, which automatically extracts entities and relationships.
"""

import asyncio
import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

# Add vendors/graphiti to Python path for imports
import sys

# sys.path.insert(0, str(Path(__file__).parent.parent / "vendors" / "graphiti"))

try:
    from graphiti_core import Graphiti
    from graphiti_core.driver.neo4j_driver import Neo4jDriver
    from graphiti_core.nodes import EpisodeType
    from graphiti_core.llm_client.config import LLMConfig
    from graphiti_core.llm_client.openai_generic_client import OpenAIGenericClient
    from graphiti_core.embedder.openai import OpenAIEmbedder, OpenAIEmbedderConfig
    from graphiti_core.cross_encoder.openai_reranker_client import OpenAIRerankerClient
except ImportError:
    print("Error: graphiti_core not found. Please install it:")
    print("  pip install graphiti-core")
    print("  or")
    print("  cd vendors/graphiti && uv sync")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Supported file extensions for ingestion
SUPPORTED_EXTENSIONS = {
    ".txt",
    ".md",
    ".markdown",
    ".rst",
    ".json",
    ".jsonl",
    ".py",
    ".js",
    ".ts",
    ".html",
    ".css",
    ".yaml",
    ".yml",
    ".xml",
    ".csv",
    ".log",
    ".sql",
    ".sh",
    ".bash",
    ".zsh",
}

# Max file size to process (in bytes) - default 5MB
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 5 * 1024 * 1024))


def get_file_content(file_path: Path) -> Optional[tuple[str, EpisodeType]]:
    """
    Read file content and determine its episode type.

    Returns:
        Tuple of (content, episode_type) or None if file cannot be read
    """
    try:
        if file_path.stat().st_size > MAX_FILE_SIZE:
            logger.warning(
                f"Skipping {file_path}: file too large ({file_path.stat().st_size} bytes)"
            )
            return None

        content = file_path.read_text(encoding="utf-8", errors="ignore")

        # Determine episode type based on file extension
        if file_path.suffix == ".json":
            # Try to parse as JSON for structured data
            try:
                json_data = json.loads(content)
                return (json.dumps(json_data, ensure_ascii=False), EpisodeType.json)
            except json.JSONDecodeError:
                # If not valid JSON, treat as text
                return (content, EpisodeType.text)
        else:
            return (content, EpisodeType.text)

    except Exception as e:
        logger.error(f"Error reading file {file_path}: {e}")
        return None


def get_files_to_process(root_dir: Path, recursive: bool = True) -> list[Path]:
    """
    Get list of files to process from the root directory.

    Args:
        root_dir: Root directory to scan
        recursive: Whether to scan subdirectories recursively

    Returns:
        List of file paths to process
    """
    files = []

    if recursive:
        for ext in SUPPORTED_EXTENSIONS:
            files.extend(root_dir.glob(f"**/*{ext}"))
    else:
        for ext in SUPPORTED_EXTENSIONS:
            files.extend(root_dir.glob(f"*{ext}"))

    # Filter out hidden files and common exclusions
    files = [
        f
        for f in files
        if not any(part.startswith(".") for part in f.parts)
        and "__pycache__" not in f.parts
        and "node_modules" not in f.parts
        and ".git" not in f.parts
    ]

    return sorted(files)


async def ingest_file(
    graphiti: Graphiti, file_path: Path, root_dir: Path, group_id: Optional[str] = None
) -> bool:
    """
    Ingest a single file into Graphiti.

    Args:
        graphiti: Graphiti instance
        file_path: Path to file to ingest
        root_dir: Root directory (for relative naming)
        group_id: Optional group ID for organizing episodes

    Returns:
        True if successful, False otherwise
    """
    result = get_file_content(file_path)
    if result is None:
        return False

    content, episode_type = result

    # Create a descriptive name from the file path
    relative_path = file_path.relative_to(root_dir)
    name = f"File: {relative_path}"

    # Create source description
    source_description = f"Local file from brain folder: {relative_path}"

    try:
        logger.info(f"Processing: {relative_path} ({episode_type.value})")

        await graphiti.add_episode(
            name=name,
            episode_body=content,
            source=episode_type,
            source_description=source_description,
            reference_time=datetime.now(timezone.utc),
            group_id=group_id,
        )

        logger.info(f"✓ Successfully ingested: {relative_path}")
        return True

    except Exception as e:
        logger.error(f"✗ Error ingesting {relative_path}: {e}")
        return False


async def main():
    """Main function to ingest files from brain folder."""

    # Configuration
    brain_dir = Path(__file__).parent
    neo4j_uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_user = os.getenv("NEO4J_USER", "neo4j")
    neo4j_password = os.getenv("NEO4J_PASSWORD", "password")
    group_id = os.getenv("GRAPHITI_GROUP_ID", "knowledge")
    recursive = os.getenv("RECURSIVE", "true").lower() == "true"

    # Ollama configuration
    ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
    ollama_llm_model = os.getenv("OLLAMA_LLM_MODEL", "qwen2.5:14b")
    ollama_embedding_model = os.getenv("OLLAMA_EMBEDDING_MODEL", "nomic-embed-text")
    ollama_embedding_dim = int(os.getenv("OLLAMA_EMBEDDING_DIM", "768"))

    if not neo4j_uri or not neo4j_user or not neo4j_password:
        logger.error("Error: NEO4J_URI, NEO4J_USER, and NEO4J_PASSWORD must be set")
        logger.error("You can set them in a .env file or as environment variables")
        return

    logger.info("=" * 60)
    logger.info("Graphiti Brain Folder Ingest Script")
    logger.info("=" * 60)
    logger.info(f"Brain directory: {brain_dir}")
    logger.info(f"Neo4j URI: {neo4j_uri}")
    logger.info(f"Group ID: {group_id}")
    logger.info(f"Recursive: {recursive}")
    logger.info(f"Max file size: {MAX_FILE_SIZE / 1024 / 1024:.1f} MB")
    logger.info(f"Ollama Base URL: {ollama_base_url}")
    logger.info(f"Ollama LLM Model: {ollama_llm_model}")
    logger.info(f"Ollama Embedding Model: {ollama_embedding_model}")
    logger.info("=" * 60)

    # Initialize Graphiti with Ollama
    logger.info("Initializing Graphiti connection with Ollama...")
    try:
        driver = Neo4jDriver(
            uri=neo4j_uri,
            user=neo4j_user,
            password=neo4j_password,
        )

        # Configure Ollama LLM client (using OpenAI-compatible API endpoint)
        logger.info(f"Configuring Ollama LLM client: {ollama_llm_model}")
        logger.info(f"  LLM model: {ollama_llm_model}")
        logger.info(f"  Base URL: {ollama_base_url}")
        llm_config = LLMConfig(
            api_key="ollama",  # Placeholder - Ollama doesn't require a real API key
            model=ollama_llm_model,  # e.g., "qwen2.5:14b"
            small_model=ollama_llm_model,  # Use same model for small operations
            base_url=ollama_base_url,  # Ollama's OpenAI-compatible endpoint
        )
        # OpenAIGenericClient works with Ollama when base_url points to Ollama's endpoint
        llm_client = OpenAIGenericClient(config=llm_config)

        # Configure Ollama embedder (using OpenAI-compatible API endpoint)
        logger.info(f"Configuring Ollama embedder: {ollama_embedding_model}")
        logger.info(f"  Embedding model: {ollama_embedding_model}")
        logger.info(f"  Embedding dimensions: {ollama_embedding_dim}")
        logger.info(f"  Base URL: {ollama_base_url}")
        embedder_config = OpenAIEmbedderConfig(
            api_key="ollama",  # Placeholder - Ollama doesn't require a real API key
            embedding_model=ollama_embedding_model,  # e.g., "nomic-embed-text"
            embedding_dim=ollama_embedding_dim,  # Dimension of embedding vectors
            base_url=ollama_base_url,  # Ollama's OpenAI-compatible endpoint
        )
        # OpenAIEmbedder works with Ollama when base_url points to Ollama's endpoint
        embedder_client = OpenAIEmbedder(config=embedder_config)

        # Configure Ollama reranker (optional, uses same LLM client)
        logger.info("Configuring Ollama reranker (cross-encoder)")
        cross_encoder_client = OpenAIRerankerClient(
            client=llm_client,  # Reuses the Ollama LLM client
            config=llm_config,  # Uses same configuration
        )

        # Initialize Graphiti with Ollama clients
        graphiti = Graphiti(
            graph_driver=driver,
            llm_client=llm_client,
            embedder=embedder_client,
            cross_encoder=cross_encoder_client,
        )

        # Build indices (only needs to be done once, but safe to run multiple times)
        logger.info("Building Graphiti indices...")
        await graphiti.build_indices_and_constraints()
        logger.info("✓ Graphiti initialized successfully with Ollama")
        logger.info(
            "Note: You may see Neo4j warnings about 'entity_edges' property - "
            "this is harmless and occurs when retrieving episodes. The script will continue normally."
        )

    except Exception as e:
        logger.error(f"Failed to initialize Graphiti: {e}")
        logger.error("Make sure Neo4j is running and credentials are correct")
        logger.error("Make sure Ollama is running and models are available:")
        logger.error(f"  - LLM model: {ollama_llm_model}")
        logger.error(f"  - Embedding model: {ollama_embedding_model}")
        return

    # Get files to process
    logger.info(f"\nScanning directory: {brain_dir}")
    files = get_files_to_process(brain_dir, recursive=recursive)
    logger.info(f"Found {len(files)} files to process\n")

    if len(files) == 0:
        logger.warning(
            "No files found to process. Check your directory path and file extensions."
        )
        await graphiti.close()
        return

    # Process files sequentially (Graphiti handles episodes sequentially)
    logger.info("Starting file ingestion...\n")
    successful = 0
    failed = 0

    for i, file_path in enumerate(files, 1):
        logger.info(
            f"[{i}/{len(files)}] Processing: {file_path.relative_to(brain_dir)}"
        )
        if await ingest_file(graphiti, file_path, brain_dir, group_id):
            successful += 1
        else:
            failed += 1
        logger.info("")  # Blank line for readability

    # Summary
    logger.info("=" * 60)
    logger.info("Ingestion Summary")
    logger.info("=" * 60)
    logger.info(f"Total files: {len(files)}")
    logger.info(f"Successful: {successful}")
    logger.info(f"Failed: {failed}")
    logger.info("=" * 60)

    # Close connection
    await graphiti.close()
    logger.info("\n✓ Done! Connection closed.")


if __name__ == "__main__":
    asyncio.run(main())

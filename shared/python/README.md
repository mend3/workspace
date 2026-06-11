# Python Tools

A collection of useful tools written in python.

## Setup

```bash
sudo apt install -y python3.12 python3.12-venv python3.12-dev

python3 -m venv .venv

source .venv/bin/activate

uv venv --python 3.12
```

## Content

- **Vector Generators**
  - _vector_from_files.py_ - Generates a txt file with all the user workspace and send to a vector store.
    - `python3 -m python.generators.vector_from_files --root . --store qdrant --collection workspace_embedding`
      - `--store=pgvector` - set the variable `PGVECTOR_CONNECTION_STRING`
      - `--store=qdrant` - set the variable `QDRANT_URL`
    - Check if the collection was created:
      - `curl http://qdrant:6333/collections/workspace_embedding/points/scroll -X POST -H "Content-Type: application/json" -d '{"limit": 1}';`
  - vector_from_url.py_ - Generates vector data based on html extracted from internet.
    - `python3 -m python.generators.vector_from_url --input urls.txt --store qdrant --collection url_embedding`
    - Check if the collection was created:
      - `curl http://qdrant:6333/collections/url_embedding/points/scroll -X POST -H "Content-Type: application/json" -d '{"limit": 1}';`
  - graphiti.py_ - Generates vector data based on html extracted from internet.
    - `python3 -m python.generators.graphiti`
- **Youtube Search**
  - _youtube/main.py_ - Search for channels on youtube and save to Google Sheets
    - `python3 -m python.youtube.main`

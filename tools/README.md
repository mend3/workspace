# Python Tools

A collection of useful tools written in python.

## Content

- **Vector Generators**
  - _vector_from_files.py_ - Generates a txt file with all the user workspace and send to a vector store.
    - `python3 -m tools.generators.vector_from_files --root . --store qdrant --collection workspace_embedding`
    - Check if the collection was created:
      - `curl http://localhost:6333/collections/workspace_embedding/points/scroll -X POST -H "Content-Type: application/json" -d '{"limit": 1}';`
  - _vector_from_url.py_ - Generates vector data based on html extracted from internet.
    - `python3 -m tools.generators.vector_from_url --input urls.txt --store qdrant --collection url_embedding`
    - Check if the collection was created:
      - `curl http://localhost:6333/collections/url_embedding/points/scroll -X POST -H "Content-Type: application/json" -d '{"limit": 1}';`
- **Youtube Search**
  - _youtube/main.py_ - Search for channels on youtube and save to Google Sheets
    - `python3 -m tools.youtube.main`

FROM python:3.12-slim

ARG VECTOR_TOOL
ENV HF_HOME="/app/.cache/huggingface"

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY "./shared/python/requirements/${VECTOR_TOOL}.txt" ./requirements.txt

RUN pip config set global.cache-dir "/app/.cache/pip"

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

CMD ["python3", "-v"]

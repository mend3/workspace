FROM python:3.12-slim

ARG VECTOR_TOOL
ENV VECTOR_TOOL=${VECTOR_TOOL:-vector_from_files}
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY "./python/requirements/${VECTOR_TOOL}.txt" ./requirements.txt

RUN pip config set global.cache-dir "/app/.cache/pip"

RUN pip install -r requirements.txt
# RUN pip install onnxruntime-gpu --extra-index-url https://aiinfra.pkgs.visualstudio.com/PublicPackages/_packaging/onnxruntime-cuda-12/pypi/simple/

ENV HF_HOME="/app/.cache/huggingface"

CMD ["python3", "-v"]

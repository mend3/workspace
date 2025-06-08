FROM python:3.12-slim AS python
WORKDIR /app

FROM python AS base
# Prevent Python from writing .pyc files and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Install system dependencies
RUN apt-get update && apt-get install -y \
  wget \
  netcat-traditional \
  gnupg \
  curl \
  unzip \
  xvfb \
  libgconf-2-4 \
  libxss1 \
  libnss3 \
  libnspr4 \
  libasound2 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  xdg-utils \
  fonts-liberation \
  dbus \
  xauth \
  xvfb \
  x11vnc \
  tigervnc-tools \
  supervisor \
  net-tools \
  procps \
  git \
  python3-numpy \
  fontconfig \
  fonts-dejavu \
  fonts-dejavu-core \
  fonts-dejavu-extra \
  && rm -rf /var/lib/apt/lists/*
# Set platform for ARM64 compatibility
ARG TARGETPLATFORM=linux/amd64
RUN pip install playwright>=1.52.0 langchain-community langchain-ollama
# Install Playwright and browsers with system dependencies
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN playwright install --with-deps chromium
RUN playwright install-deps
# Set up working directory
WORKDIR /app


FROM base AS agent-ui
# Install noVNC
RUN git clone https://github.com/novnc/noVNC.git /opt/novnc \
  && git clone https://github.com/novnc/websockify /opt/novnc/utils/websockify \
  && ln -s /opt/novnc/vnc.html /opt/novnc/index.html

# copy browser-agent package
COPY ./browser/use/ /app/browser/agent/
COPY ./browser/ui/requirements.txt ./requirements.txt
# Copy requirements and install Python dependencies
RUN pip install --no-cache-dir -r ./requirements.txt
RUN pip install --upgrade pip maincontentextractor
# Copy the application code
COPY ./browser/ui .

# Set environment variables
ENV BROWSER_USE_LOGGING_LEVEL=info
ENV CHROME_PATH=/ms-playwright/chromium-*/chrome-linux/chrome
ENV ANONYMIZED_TELEMETRY=false
ENV DISPLAY=:99
ENV RESOLUTION=1920x1080x24
ENV VNC_PASSWORD=vncpassword
ENV CHROME_PERSISTENT_SESSION=false
ENV RESOLUTION_WIDTH=1920
ENV RESOLUTION_HEIGHT=1080
# Set up supervisor configuration
RUN mkdir -p /var/log/supervisor
COPY ./browser/ui/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
EXPOSE 7788 6080 5901
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]


# Use Python 3.12 slim as the base image
FROM base AS agent
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
# Install Poetry using the official installer script
RUN curl -sSL https://install.python-poetry.org | python3 -
# Add Poetry to PATH
ENV PATH="/root/.local/bin:${PATH}"
# Upgrade pip and install virtualenv globally
RUN pip install --upgrade pip virtualenv
RUN uv venv --python 3.12
COPY ./browser/use .
RUN uv pip install -e ".[dev]"

# (Optional) Create a virtual environment using virtualenv
# RUN virtualenv venv

# By default, run a shell so you can interact with the container
CMD ["bash"]

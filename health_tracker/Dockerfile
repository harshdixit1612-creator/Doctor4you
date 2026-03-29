# Use slim Python image
FROM python:3.11-slim

# Install Tesseract OCR + Poppler (for PDF support)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements from health_tracker (relative to repo root context)
COPY health_tracker/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all app source from health_tracker
COPY health_tracker/ .

# Expose port
EXPOSE 8000

# Start server — Render sets $PORT automatically
CMD ["sh", "-c", "uvicorn api:app --host 0.0.0.0 --port ${PORT:-8000}"]

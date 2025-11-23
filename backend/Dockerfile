FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install UV
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files
COPY pyproject.toml ./
COPY README.md ./

# Install dependencies
RUN uv sync

# Copy application code
COPY src/ ./src/
COPY uv.lock ./

# Expose port
EXPOSE 8004

# Run the application
CMD ["uv", "run", "uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8004"]


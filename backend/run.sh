#!/bin/bash
# Run script for the backend API

# Activate virtual environment and run the server
uv run uvicorn src.app.main:app --reload --host 0.0.0.0 --port 8000


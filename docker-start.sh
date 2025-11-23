#!/bin/bash

# Docker Compose Quick Start Script
# This script helps you start the Expense Settlement application with Docker

set -e

echo "🚀 Starting Expense Settlement Application with Docker Compose"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Use docker compose (v2) if available, otherwise use docker-compose (v1)
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo "📦 Building and starting services..."
$DOCKER_COMPOSE up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
if $DOCKER_COMPOSE ps | grep -q "Up"; then
    echo ""
    echo "✅ Services are starting up!"
    echo ""
    echo "📍 Service URLs:"
    echo "   - Frontend:    http://localhost:3000"
    echo "   - Backend API: http://localhost:8000"
    echo "   - API Docs:    http://localhost:8000/docs"
    echo "   - Database:    localhost:5432"
    echo ""
    echo "📋 Useful commands:"
    echo "   - View logs:    $DOCKER_COMPOSE logs -f"
    echo "   - Stop:         $DOCKER_COMPOSE down"
    echo "   - Restart:       $DOCKER_COMPOSE restart"
    echo ""
    echo "🔍 Checking service health..."
    
    # Wait a bit more for services to fully start
    sleep 10
    
    # Check backend health
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "   ✅ Backend is healthy"
    else
        echo "   ⚠️  Backend is starting (may take a moment)"
    fi
    
    # Check frontend
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "   ✅ Frontend is accessible"
    else
        echo "   ⚠️  Frontend is starting (may take a moment)"
    fi
    
    echo ""
    echo "🎉 Setup complete! Open http://localhost:3000 in your browser"
else
    echo "❌ Some services failed to start. Check logs with: $DOCKER_COMPOSE logs"
    exit 1
fi







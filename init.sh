#!/bin/bash

echo "=================================="
echo "🚀 Recruitment Platform Setup"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker found"

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it first."
    exit 1
fi

echo "✅ Docker Compose found"

echo ""
echo "📋 Starting services..."
echo "=================================="

# Start docker compose
docker-compose up -d

echo ""
echo "✅ Services started!"
echo ""
echo "📍 Access URLs:"
echo "   Frontend:       http://localhost:3000"
echo "   Backend API:    http://localhost:5000"
echo "   API Docs:       http://localhost:5000/swagger"
echo "   Database:       localhost:1433"
echo ""
echo "💡 Tips:"
echo "   - Check logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - See database: docker-compose exec db sqlcmd -S localhost -U sa"
echo ""
echo "📚 Documentation:"
echo "   - Setup: INSTALLATION.md"
echo "   - Development: DEVELOPMENT.md"
echo ""
echo "Happy coding! 🎉"

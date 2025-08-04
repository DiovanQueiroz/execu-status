#!/bin/bash

# Scripts para gerenciar containers Docker do Execu Status

case "$1" in
  "build")
    echo "🏗️  Building all containers..."
    docker-compose build --no-cache
    ;;
  
  "up")
    echo "🚀 Starting all services..."
    docker-compose up -d
    ;;
    
  "up-dev")
    echo "🚀 Starting all services (with logs)..."
    docker-compose up
    ;;
    
  "up-prod")
    echo "🚀 Starting production services with Nginx proxy..."
    docker-compose --profile production up -d
    ;;
  
  "down")
    echo "🛑 Stopping all services..."
    docker-compose down
    ;;
    
  "restart")
    echo "🔄 Restarting all services..."
    docker-compose down
    docker-compose up -d
    ;;
    
  "logs")
    if [ -n "$2" ]; then
      echo "📋 Showing logs for $2..."
      docker-compose logs -f "$2"
    else
      echo "📋 Showing all logs..."
      docker-compose logs -f
    fi
    ;;
    
  "clean")
    echo "🧹 Cleaning up containers and images..."
    docker-compose down -v
    docker system prune -f
    ;;
    
  "status")
    echo "📊 Container status:"
    docker-compose ps
    ;;
    
  "shell")
    if [ -n "$2" ]; then
      echo "🐚 Opening shell in $2..."
      docker-compose exec "$2" sh
    else
      echo "❌ Please specify a service: backend, frontend, mysql, nginx"
    fi
    ;;
    
  *)
    echo "🐳 Execu Status Docker Management"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build      - Build all containers"
    echo "  up         - Start all services (detached)"
    echo "  up-dev     - Start all services (with logs)"
    echo "  up-prod    - Start with Nginx proxy (production)"
    echo "  down       - Stop all services"
    echo "  restart    - Restart all services"
    echo "  logs [service] - Show logs (optionally for specific service)"
    echo "  clean      - Clean up containers and images"
    echo "  status     - Show container status"
    echo "  shell [service] - Open shell in service container"
    echo ""
    echo "Services: backend, frontend, mysql, nginx"
    ;;
esac
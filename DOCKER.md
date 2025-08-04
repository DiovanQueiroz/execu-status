# 🐳 Execu Status - Docker Setup

Este guia mostra como executar o projeto completo usando Docker containers.

## 📋 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

## 🚀 Início Rápido

### 1. Clone e Configure

```bash
# Clone o repositório (se ainda não fez)
git clone <repository-url>
cd execu-status

# Torne o script executável
chmod +x docker-scripts.sh
```

### 2. Build e Start

```bash
# Opção 1: Usando o script helper
./docker-scripts.sh build
./docker-scripts.sh up

# Opção 2: Usando docker-compose diretamente
docker-compose build
docker-compose up -d
```

### 3. Acesse a Aplicação

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Nginx Proxy** (produção): http://localhost:8080

## 🏗️ Arquitetura dos Containers

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     MySQL       │
│   (React/Vite)  │    │ (Node.js/Express)│   │   (Database)    │
│   Port: 80      │    │   Port: 3000    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────────────────────────────────────┐
         │              Docker Network                     │
         │             (execu-network)                     │
         └─────────────────────────────────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Nginx Proxy    │
                    │ (Opcional/Prod) │
                    │  Port: 8080     │
                    └─────────────────┘
```

## 📦 Serviços Disponíveis

### Frontend Container
- **Base**: nginx:alpine
- **Build**: Multi-stage (Node.js → Nginx)
- **Porto**: 80
- **Features**: SPA routing, asset caching, gzip

### Backend Container
- **Base**: node:18-alpine
- **Build**: Multi-stage (build → runtime)
- **Porto**: 3000
- **Features**: Non-root user, health checks

### MySQL Container
- **Base**: mysql:8
- **Porto**: 3306
- **Features**: Auto-init com schema, health checks
- **Volume**: Dados persistentes

### Nginx Proxy (Opcional)
- **Base**: nginx:alpine
- **Porto**: 8080
- **Features**: Load balancing, proxy reverso

## 🛠️ Comandos Úteis

### Script Helper

```bash
# Ver todos os comandos disponíveis
./docker-scripts.sh

# Build containers
./docker-scripts.sh build

# Start serviços (detached)
./docker-scripts.sh up

# Start com logs visíveis
./docker-scripts.sh up-dev

# Start produção (com Nginx)
./docker-scripts.sh up-prod

# Ver logs
./docker-scripts.sh logs
./docker-scripts.sh logs backend

# Status dos containers
./docker-scripts.sh status

# Abrir shell no container
./docker-scripts.sh shell backend

# Parar serviços
./docker-scripts.sh down

# Limpeza completa
./docker-scripts.sh clean
```

### Docker Compose Direto

```bash
# Build e start
docker-compose up --build -d

# Apenas start
docker-compose up -d

# Com produção (Nginx)
docker-compose --profile production up -d

# Ver logs
docker-compose logs -f

# Status
docker-compose ps

# Parar
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

## 🔧 Configuração

### Variáveis de Ambiente

O projeto usa as seguintes variáveis:

```env
# Backend
NODE_ENV=production
PORT=3000
DB_HOST=mysql
DB_USER=execu
DB_PASSWORD=execu
DB_NAME=execu_status

# Frontend
VITE_API_URL=http://localhost:3000
```

### Volumes Persistentes

- `mysql_data`: Dados do MySQL persistem entre restarts

### Redes

- `execu-network`: Rede bridge para comunicação entre containers

## 🚀 Cenários de Deploy

### Desenvolvimento
```bash
./docker-scripts.sh up-dev
```
- Logs visíveis
- Frontend: http://localhost
- Backend: http://localhost:3000

### Produção Simples
```bash
./docker-scripts.sh up
```
- Rodando em background
- Frontend: http://localhost
- Backend: http://localhost:3000

### Produção com Proxy
```bash
./docker-scripts.sh up-prod
```
- Nginx como proxy reverso
- Acesso único: http://localhost:8080
- Load balancing automático

## 🐛 Troubleshooting

### Container não inicia
```bash
# Ver logs detalhados
./docker-scripts.sh logs

# Verificar status
./docker-scripts.sh status

# Rebuild se necessário
./docker-scripts.sh clean
./docker-scripts.sh build
```

### Problemas de conectividade
```bash
# Verificar rede
docker network ls
docker network inspect execu-status_execu-network

# Testar conectividade
./docker-scripts.sh shell backend
# Dentro do container: ping mysql
```

### Reset completo
```bash
./docker-scripts.sh clean
docker system prune -a
./docker-scripts.sh build
./docker-scripts.sh up
```

## 📁 Arquivos Docker

- `Dockerfile.frontend` - Build do React/Vite
- `Dockerfile.backend` - Build do Node.js/Express  
- `docker-compose.yml` - Orquestração completa
- `nginx.conf` - Configuração do proxy
- `.dockerignore` - Exclusões do build
- `docker-scripts.sh` - Scripts helper

## 🔒 Segurança

- Containers rodam com usuários não-root
- Headers de segurança configurados
- Redes isoladas
- Health checks ativos
- Volumes com dados persistentes

## 📊 Monitoramento

### Health Checks

Todos os serviços têm health checks configurados:

- **MySQL**: `mysqladmin ping`
- **Backend**: `wget http://localhost:3000/health`
- **Frontend**: Nginx status

### Logs

```bash
# Todos os logs
docker-compose logs -f

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

---

🎉 **Projeto totalmente containerizado e pronto para deploy!**
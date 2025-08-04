# Comandos de Desenvolvimento

Este projeto utiliza múltiplos serviços que podem ser executados simultaneamente.

## Comandos Disponíveis

### 🚀 Executar Todos os Serviços
```bash
npm run dev:all
```
Executa simultaneamente:
- Docker MySQL (porta 3306)
- Servidor API (porta 3000)
- Frontend Vite (porta 8081)

### 🎯 Executar Apenas Frontend + API
```bash
npm run dev:frontend
```
Executa o servidor API e o frontend (assumindo que o Docker já está rodando).

### 🔧 Executar Apenas Backend
```bash
npm run dev:backend
```
Executa o Docker MySQL e o servidor API.

### 🛑 Parar Todos os Serviços
```bash
npm run dev:stop
```
Para todos os serviços em execução.

### 🔄 Reiniciar Todos os Serviços
```bash
npm run dev:restart
```
Para todos os serviços e reinicia.

## Comandos Individuais

### Banco de Dados
```bash
npm run db:start    # Inicia o MySQL no Docker
```

### Servidor API
```bash
npm run build:server # Compila o servidor TypeScript
npm run server       # Executa o servidor
```

### Frontend
```bash
npm run dev          # Executa o Vite
```

## URLs dos Serviços

- **Frontend**: http://localhost:8081
- **API**: http://localhost:3000
- **MySQL**: localhost:3306

## Verificação de Status

Para verificar se todos os serviços estão funcionando:

```bash
# Verificar Docker
docker ps

# Verificar API
curl http://localhost:3000/reports

# Verificar Frontend
curl http://localhost:8081
```

## Troubleshooting

### Docker não encontrado
Se o comando `docker` não for encontrado, certifique-se de que o Docker Desktop está instalado e rodando.

### Porta já em uso
Se alguma porta estiver em uso, o Vite tentará automaticamente a próxima porta disponível.

### Erro de compilação do servidor
Execute `npm run build:server` para recompilar o servidor TypeScript. 
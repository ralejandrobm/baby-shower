# ── Stage 1: build React ─────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Express server ───────────────────────────────────
FROM node:20-alpine

WORKDIR /app/server
COPY server/package.json ./
RUN npm install
COPY server/ ./

# Copiar el build de React como archivos estáticos
COPY --from=frontend-builder /app/server/public ./public

# Volumen para persistir el archivo de confirmados
VOLUME ["/app/server/data"]

EXPOSE 3000
CMD ["node", "index.js"]

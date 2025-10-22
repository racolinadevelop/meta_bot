# ========= Base de construcción (LTS recomendado)
FROM node:20-bookworm-slim AS builder
# (Si necesitas 21, cambia a node:21-bookworm-slim)

ENV NODE_ENV=development
WORKDIR /app

# Herramientas de compilación mínimas
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     python3 make g++ git ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Habilitar pnpm y aprovechar cache de dependencias
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1) Copiamos SOLO manifiestos para aprovechar la cache de capas
COPY package.json pnpm-lock.yaml ./

# 2) Pre-resolvemos dependencias en el store de pnpm (mejor cache)
RUN pnpm fetch

# 3) Instalamos deps con lockfile (rápido gracias al fetch previo)
RUN pnpm install --frozen-lockfile

# 4) Copiamos el resto del código y construimos
COPY . .
RUN pnpm run build


# ========= Imagen final (runtime)
FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Habilitar pnpm en runtime (si necesitas usar pnpm para instalar prod deps)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiamos artefactos necesarios
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/assets ./assets
COPY package.json pnpm-lock.yaml ./

# Instalamos SOLO dependencias de producción (con scripts habilitados)
# Nota: no uses --ignore-scripts aquí para que se instalen binarios nativos (tokenizers, etc.)
RUN pnpm install --prod --frozen-lockfile

# Usuario no root (la imagen ya trae 'node')
USER node

# (Opcional) Healthcheck simple si tu app abre un puerto/endpoint
# HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
#   CMD node -e "process.exit(0)" || exit 1

CMD ["node", "dist/app.js"]

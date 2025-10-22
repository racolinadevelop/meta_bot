# ---------- BUILDER ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ git ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiamos manifest primero para cachear deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch
RUN pnpm install --frozen-lockfile

# 🔴 IMPORTANTE: Copiar todo el código y los assets (incluye Prompts)
COPY . .

RUN pnpm run build


# ---------- RUNTIME ----------
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiamos artefactos de build y ASSETS COMPLETOS
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/assets ./assets
COPY package.json pnpm-lock.yaml ./

# No ignores scripts: tokenizers/ffmpeg necesitan scripts nativos
RUN pnpm install --prod --frozen-lockfile

USER node
CMD ["node", "dist/app.js"]
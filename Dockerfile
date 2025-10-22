# Image size ~ 400MB
FROM node:21-bullseye-slim AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

COPY package*.json *-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm run build


FROM node:21-bullseye-slim AS deploy

WORKDIR /app

ARG PORT
ENV PORT $PORT
EXPOSE $PORT

COPY --from=builder /app/assets ./assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/*-lock.yaml ./
COPY --from=builder /app/package*.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

RUN pnpm install --production --ignore-scripts

CMD ["npm", "start"]

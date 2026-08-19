# Dockerfile do Agency OS.
# Estratégia simples e confiável: build com todas as dependências,
# roda em produção com "next start" no mesmo conjunto de node_modules.
# (Evita as pegadinhas de output "standalone" + Prisma com driver adapters,
# que ainda muda bastante de versão para versão do Prisma.)

FROM node:22-bookworm-slim AS base
WORKDIR /app
# openssl é usado por algumas ferramentas do Prisma em tempo de build/migração
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Variáveis fake só para a build (o Next não precisa de banco real para compilar).
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
ENV AUTH_SECRET="build-time-placeholder-not-used-in-runtime-xxxxxxxxxxxxxxxxxxxx"
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]

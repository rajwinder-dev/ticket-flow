# ---------- BASE ----------
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# ---------- BUILD ----------
FROM base AS build
WORKDIR /app
COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm --filter backend exec prisma generate

RUN pnpm run -r build

# 4. Deploy: This creates a standalone folder in /prod/backend
RUN pnpm deploy --filter=backend --prod /prod/backend

RUN pnpm i -g prisma
# ---------- RUNTIME ----------
FROM base AS backend
WORKDIR /app

# Copy the pruned production folder
COPY --from=build /prod/backend ./

ENV NODE_ENV=production
EXPOSE 8000

CMD ["sh", "-c", "npm run db:deploy && npm run start"]

# ---------- BASE ----------
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN corepack prepare pnpm@10.30.3 --activate

RUN apt-get update -y && apt-get install -y openssl

# ---------- BUILD ---------
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# required for prisma generate
ENV DIRECT_URL=postgresql://postgres:postgres@postgres:5433/postgres

RUN pnpm run db:generate
RUN pnpm run build 

RUN pnpm deploy --filter=backend --prod /prod/backend
RUN pnpm deploy --filter=frontend --prod /prod/frontend
RUN pnpm deploy --filter=email-service --prod /prod/email-service

RUN mkdir -p /prod/backend/prisma \
  && cp -r packages/database/prisma/* /prod/backend/prisma/

# ---------- BACKEND RUNTIME ----------
FROM base AS backend
COPY --from=build /prod/backend /prod/backend
WORKDIR /prod/backend
EXPOSE 3000
CMD ["pnpm", "start"]

# ---------- EMAIL SERVICE RUNTIME ----------
FROM base AS email-service
COPY --from=build /prod/email-service /prod/email-service 
WORKDIR /prod/email-service
CMD ["pnpm", "start"]

# ---------- FRONTEND RUNTIME ----------
FROM nginx:stable-alpine AS frontend
COPY --from=build /usr/src/app/apps/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

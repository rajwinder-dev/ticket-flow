# ---------- BASE ----------
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ENV CI=true

ENV NX_NO_CLOUD=true
RUN corepack prepare pnpm@10.30.3 --activate

RUN apt-get update -y && apt-get install -y openssl

# ---------- BUILD ---------
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# dummy required for prisma generate
ENV DIRECT_URL=postgresql://postgres:postgres@postgres:5433/postgres


# Nx cache speeds up repeat builds across layers/CI
RUN pnpm --filter database run generate


RUN pnpm run build 

RUN pnpm deploy --filter=api --prod /prod/api
RUN pnpm deploy --filter=web --prod /prod/web
RUN pnpm deploy --filter=email-worker --prod /prod/email-worker

RUN mkdir -p /prod/api/prisma \
  && cp -r packages/database/prisma/* /prod/api/prisma/

# ---------- api RUNTIME ----------
FROM base AS api
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE 3000
CMD ["pnpm", "start"]

# ---------- EMAIL worker RUNTIME ----------
FROM base AS email-worker
COPY --from=build /prod/email-worker /prod/email-worker 
WORKDIR /prod/email-worker
CMD ["pnpm", "start"]

# ---------- web RUNTIME ----------
FROM nginx:stable-alpine AS web
COPY --from=build /usr/src/app/app/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

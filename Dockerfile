# ---------- BASE ----------
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN corepack prepare pnpm@10.30.3 --activate

RUN apt-get update -y && apt-get install -y openssl
# ---------- BUILD ----------
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# required for prisma generate
ENV DIRECT_URL=postgresql://postgres:postgres@postgres:5433/postgres
RUN pnpm run -r build

RUN pnpm deploy --filter=backend --prod /prod/backend

RUN pnpm deploy --filter=frontend --prod /prod/frontend
WORKDIR /prod/backend

FROM base AS backend
COPY --from=build /prod/backend /prod/backend
WORKDIR /prod/backend
EXPOSE 3000
CMD ["pnpm", "start"]

FROM nginx:stable-alpine AS frontend
COPY --from=build /usr/src/app/apps/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /prod/frontend
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

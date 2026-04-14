FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
# This uses the root lockfile but only installs for the workspace
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install 
RUN pnpm run -r build

# Deploy extracts only the app and its PROD dependencies
RUN pnpm deploy --filter=backend --prod /prod/backend

FROM base AS backend
WORKDIR /prod/backend
COPY --from=build /prod/backend /prod/backend
EXPOSE 8000
CMD [ "pnpm", "start" ]

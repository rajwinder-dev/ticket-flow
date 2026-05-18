#!/bin/bash

set -euo pipefail

ROOT_ENV_FILE=".env"
BACKEND_ENV_FILE="./apps/backend/.env"
ENV_TEMPLATE=".env.example"

create_env_file() {
  local target_file="$1"

  if [ ! -f "$target_file" ]; then
    cp "$ENV_TEMPLATE" "$target_file"
    echo "Created $target_file"
  fi
}

create_env_file "$ROOT_ENV_FILE"
create_env_file "$BACKEND_ENV_FILE"

# docker compose up --build

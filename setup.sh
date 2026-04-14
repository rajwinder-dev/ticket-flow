#!/bin/bash

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Generated .env file"
fi

docker compose up --build

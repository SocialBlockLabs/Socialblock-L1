#!/usr/bin/env bash
set -e
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$ROOT_DIR"
case "$1" in
  start)   cp -n .env.example .env || true; docker compose up --build -d ;;
  stop)    docker compose down ;;
  restart) docker compose down && docker compose up --build -d ;;
  reset)   docker compose down -v ;;
  status)  docker compose ps; echo "RPC: http://localhost:26657   Agent: http://localhost:8080   Explorer: http://localhost:8088" ;;
  logs)    shift || true; docker compose logs -f ${1:-node} ;;
  *)       echo "Usage: $0 {start|stop|restart|reset|status|logs}"; exit 1 ;;
esac

#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 [start|stop|reset|status|logs [svc]|fund <addr> <amountDenom>|keys]"
  exit 1
}

cmd="${1:-}"; shift || true

case "${cmd}" in
  start)
    docker compose up --build -d
    ;;
  stop)
    docker compose down
    ;;
  reset)
    docker compose down -v
    ;;
  status)
    curl -s http://localhost:26657/status | jq '.result.sync_info.latest_block_height'
    ;;
  logs)
    svc="${1:-node}"
    docker compose logs -f "$svc"
    ;;
  fund)
    addr="${1:-}"; amt="${2:-}"
    if [ -z "$addr" ] || [ -z "$amt" ]; then usage; fi
    docker compose exec -T node socialblockd tx bank send faucet "$addr" "$amt" --keyring-backend test --chain-id socialblock-devnet-1 --yes
    ;;
  keys)
    docker compose exec -T node socialblockd keys list --keyring-backend test
    ;;
  *)
    usage
    ;;
esac

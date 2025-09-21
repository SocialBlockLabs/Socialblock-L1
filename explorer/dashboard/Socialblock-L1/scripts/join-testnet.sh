#!/usr/bin/env bash
set -euo pipefail

# Join an external testnet by pulling a provided genesis.json and connecting to peers.
# Usage: ./scripts/join-testnet.sh <genesis-url> <persistent-peers>
# Example: ./scripts/join-testnet.sh https://example.com/genesis.json "abcd1234@seed-1:26656,efgh5678@seed-2:26656"

GENESIS_URL="${1:-}"
PERSISTENT_PEERS="${2:-}"

if [ -z "$GENESIS_URL" ] || [ -z "$PERSISTENT_PEERS" ]; then
  echo "Usage: $0 <genesis-url> <persistent-peers>"
  exit 1
fi

SERVICE="val-1"
if ! docker compose ps "$SERVICE" >/dev/null 2>&1; then
  SERVICE="node"
fi

echo "[join-testnet] Preparing node config inside $SERVICE ..."
docker compose exec -T "$SERVICE" bash -lc '
  set -euo pipefail
  APP_HOME="${DAEMON_HOME:-$HOME/.simapp}"
  CFG="$APP_HOME/config/config.toml"
  GEN="$APP_HOME/config/genesis.json"
  curl -fsSL "'"${GENESIS_URL}"'" -o "$GEN"
  sed -i "s/^persistent_peers = .*/persistent_peers = \"'"${PERSISTENT_PEERS}"'\"/" "$CFG" || true
'

echo "[join-testnet] Updated genesis and peers. Restart containers to take effect:"
echo "  docker compose restart $SERVICE"


#!/usr/bin/env bash
set -euo pipefail

# Send tokens from faucet account to a bech32 address on the testnet/devnet.
# Usage: ./scripts/faucet.sh <address> <amountDenom>

ADDR="${1:-}"
AMT="${2:-}"

if [ -z "$ADDR" ] || [ -z "$AMT" ]; then
  echo "Usage: $0 <bech32-address> <amountDenom>"
  exit 1
fi

# Prefer docker-compose service 'val-1' if present, else fallback to 'node'
SERVICE="val-1"
if ! docker compose ps "$SERVICE" >/dev/null 2>&1; then
  SERVICE="node"
fi

CHAIN_ID="${CHAIN_ID:-socialblock-testnet-1}"

docker compose exec -T "$SERVICE" socialblockd tx bank send faucet "$ADDR" "$AMT" \
  --keyring-backend test --chain-id "$CHAIN_ID" --yes


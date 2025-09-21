#!/usr/bin/env bash
set -euo pipefail

# Initialize a local multi-node testnet using the testnet compose file.
# - Resets any existing volumes
# - Boots seed-1 to generate node ID
# - Builds a shared genesis and persistent peers via scripts/testnet/build-genesis.sh
# - Writes .env.testnet with PERSISTENT_PEERS

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE_FILE="${COMPOSE:-${ROOT_DIR}/docker-compose.testnet.yaml}"
ENV_FILE="${ENV_OUT:-${ROOT_DIR}/.env.testnet}"

echo "[init-testnet] Using compose: ${COMPOSE_FILE}"

echo "[init-testnet] Resetting testnet volumes..."
docker compose -f "${COMPOSE_FILE}" down -v || true

echo "[init-testnet] Building genesis and peers via scripts/testnet/build-genesis.sh ..."
"${ROOT_DIR}/scripts/testnet/build-genesis.sh"

echo "[init-testnet] Done. Wrote peers to ${ENV_FILE}. Start full testnet with:"
echo "  docker compose -f ${COMPOSE_FILE} --env-file ${ENV_FILE} up -d"


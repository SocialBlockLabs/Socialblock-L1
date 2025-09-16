#!/usr/bin/env bash
set -euo pipefail

# Build a shared genesis for seed and validators, set PERSISTENT_PEERS, and write .env
# Prereqs: docker, docker compose; sblk image buildable via chains/sblk/Dockerfile

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.testnet.yaml"
ENV_FILE="${ROOT_DIR}/.env.testnet"

CHAIN_ID="socialblock-testnet-1"
DENOM="usblk"
MIN_GAS="0.025usblk"

echo "[testnet] Bringing up seed-1 only to generate node ID and base config..."
docker compose -f "${COMPOSE_FILE}" up --build -d seed-1

echo "[testnet] Waiting for seed-1 to initialize config..."
sleep 2

SEED_HOME="/root/.simapp"

echo "[testnet] Getting seed-1 node ID..."
SEED_ID=$(docker compose -f "${COMPOSE_FILE}" exec -T seed-1 socialblockd tendermint show-node-id || true)
SEED_ADDR="${SEED_ID}@seed-1:26656"
echo "[testnet] Seed peer: ${SEED_ADDR}"

echo "PERSISTENT_PEERS=${SEED_ADDR}" > "${ENV_FILE}"

echo "[testnet] Resetting seed genesis (fresh init) and patching denoms..."
docker compose -f "${COMPOSE_FILE}" exec -T seed-1 bash -lc "rm -rf ${SEED_HOME}/config/genesis.json && socialblockd init seed-1 --chain-id ${CHAIN_ID} --home ${SEED_HOME} --default-denom ${DENOM}"
docker compose -f "${COMPOSE_FILE}" exec -T seed-1 bash -lc "GENESIS=\"${SEED_HOME}/config/genesis.json\" DENOM=\"${DENOM}\" /usr/local/bin/genesis_patch.sh"

echo "[testnet] Creating validator keys on val-1 and val-2..."
docker compose -f "${COMPOSE_FILE}" up --build -d val-1 val-2
sleep 2

for v in val-1 val-2; do
  docker compose -f "${COMPOSE_FILE}" exec -T "$v" bash -lc "yes | socialblockd keys add validator --keyring-backend test --home ${SEED_HOME}"
done

echo "[testnet] Funding validators in seed genesis..."
for v in val-1 val-2; do
  ADDR=$(docker compose -f "${COMPOSE_FILE}" exec -T "$v" bash -lc "socialblockd keys show validator -a --keyring-backend test --home ${SEED_HOME}")
  docker compose -f "${COMPOSE_FILE}" exec -T seed-1 bash -lc "socialblockd add-genesis-account ${ADDR} 100000000000${DENOM} --home ${SEED_HOME}"
done

echo "[testnet] Creating gentxs for each validator..."
for v in val-1 val-2; do
  docker compose -f "${COMPOSE_FILE}" exec -T "$v" bash -lc "socialblockd gentx validator 100000000000${DENOM} --chain-id ${CHAIN_ID} --keyring-backend test --home ${SEED_HOME}"
  # copy gentx back into seed-1's gentx directory
  GENTX_FILE=$(docker compose -f "${COMPOSE_FILE}" exec -T "$v" bash -lc "ls ${SEED_HOME}/config/gentx | head -n1")
  docker compose -f "${COMPOSE_FILE}" cp "$v":"${SEED_HOME}/config/gentx/${GENTX_FILE}" seed-1:"${SEED_HOME}/config/gentx/${v}-${GENTX_FILE}"
done

echo "[testnet] Collecting gentxs on seed-1..."
docker compose -f "${COMPOSE_FILE}" exec -T seed-1 bash -lc "socialblockd collect-gentxs --home ${SEED_HOME}"

echo "[testnet] Distributing final genesis to validators..."
docker compose -f "${COMPOSE_FILE}" cp seed-1:"${SEED_HOME}/config/genesis.json" val-1:"${SEED_HOME}/config/genesis.json"
docker compose -f "${COMPOSE_FILE}" cp seed-1:"${SEED_HOME}/config/genesis.json" val-2:"${SEED_HOME}/config/genesis.json"

echo "[testnet] Wrote ${ENV_FILE} with PERSISTENT_PEERS. Start full testnet with:"
echo "  docker compose -f ${COMPOSE_FILE} --env-file ${ENV_FILE} up -d"


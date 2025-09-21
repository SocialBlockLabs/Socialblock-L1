#!/usr/bin/env bash
set -euo pipefail

APP_HOME="${DAEMON_HOME:-$HOME/.simapp}"      # /root/.simapp
CHAIN_ID="${CHAIN_ID:-socialblock-devnet-1}"
MONIKER="${MONIKER:-sblk-devnet}"
DENOM="${DENOM:-usblk}"
MIN_GAS_PRICE="${MIN_GAS_PRICE:-0.025usblk}"

if [ ! -d "$APP_HOME/config" ]; then
  echo "[init] initializing chain at $APP_HOME ..."
  socialblockd init "$MONIKER" --chain-id "$CHAIN_ID" --home "$APP_HOME" --default-denom "$DENOM"

  # Deterministic dev keys
  yes | socialblockd keys add validator --keyring-backend test --home "$APP_HOME"
  yes | socialblockd keys add faucet    --keyring-backend test --home "$APP_HOME"
  yes | socialblockd keys add alice     --keyring-backend test --home "$APP_HOME"
  yes | socialblockd keys add bob       --keyring-backend test --home "$APP_HOME"

  # Fund accounts
  socialblockd add-genesis-account "$(socialblockd keys show validator -a --keyring-backend test --home "$APP_HOME")" 100000000000$DENOM --home "$APP_HOME"
  socialblockd add-genesis-account "$(socialblockd keys show faucet    -a --keyring-backend test --home "$APP_HOME")" 100000000000$DENOM --home "$APP_HOME"
  socialblockd add-genesis-account "$(socialblockd keys show alice     -a --keyring-backend test --home "$APP_HOME")"   100000000$DENOM --home "$APP_HOME"
  socialblockd add-genesis-account "$(socialblockd keys show bob       -a --keyring-backend test --home "$APP_HOME")"   100000000$DENOM --home "$APP_HOME"

  # Create validator
  socialblockd gentx validator 70000000000$DENOM --chain-id "$CHAIN_ID" --keyring-backend test --home "$APP_HOME"
  socialblockd collect-gentxs --home "$APP_HOME"

  # Open RPC/API/GRPC and set min-gas
  CFG="$APP_HOME/config/config.toml"
  APP="$APP_HOME/config/app.toml"
  sed -i 's/^indexer = .*/indexer = "kv"/' "$CFG"
  sed -i 's#^laddr = "tcp://127.0.0.1:26657"#laddr = "tcp://0.0.0.0:26657"#' "$CFG"
  sed -i 's/^minimum-gas-prices = .*/minimum-gas-prices = "'"$MIN_GAS_PRICE"'"/' "$APP" || true
  sed -i 's/^enable = false/enable = true/' "$APP" || true
  sed -i 's#^address = "tcp://127.0.0.1:1317"#address = "tcp://0.0.0.0:1317"#' "$APP" || true
  sed -i 's/^grpc-enable = false/grpc-enable = true/' "$APP"  || true
fi

echo "[start] launching node with home=$APP_HOME ..."
exec socialblockd start --home "$APP_HOME" --rpc.laddr tcp://0.0.0.0:26657 --pruning=nothing

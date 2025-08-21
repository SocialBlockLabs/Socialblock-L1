#!/usr/bin/env bash
set -euo pipefail

HOME_DIR="${DAEMON_HOME:-$HOME/.socialblockd}"
CHAIN_ID="${CHAIN_ID:-socialblock-devnet-1}"
MONIKER="${MONIKER:-sblk-devnet}"
DENOM="usblk"
MIN_GAS_PRICES="${MIN_GAS_PRICE:-0.025usblk}"

if [ ! -d "$HOME_DIR/config" ]; then
  echo "[init] initializing chain..."
  socialblockd init "$MONIKER" --chain-id "$CHAIN_ID"

  # Deterministic dev keys
  yes | socialblockd keys add validator --keyring-backend test
  yes | socialblockd keys add faucet    --keyring-backend test
  yes | socialblockd keys add alice     --keyring-backend test
  yes | socialblockd keys add bob       --keyring-backend test

  # Fund and gentx
  socialblockd add-genesis-account "$(socialblockd keys show validator -a --keyring-backend test)" 100000000000$DENOM
  socialblockd add-genesis-account "$(socialblockd keys show faucet    -a --keyring-backend test)" 100000000000$DENOM
  socialblockd add-genesis-account "$(socialblockd keys show alice     -a --keyring-backend test)"   100000000$DENOM
  socialblockd add-genesis-account "$(socialblockd keys show bob       -a --keyring-backend test)"   100000000$DENOM

  socialblockd gentx validator 70000000000$DENOM --chain-id "$CHAIN_ID" --keyring-backend test
  socialblockd collect-gentxs

  CFG="$HOME_DIR/config/config.toml"
  APP="$HOME_DIR/config/app.toml"

  # RPC open + indexer
  sed -i 's/^indexer = .*/indexer = "kv"/' "$CFG"
  sed -i 's#^laddr = "tcp://127.0.0.1:26657"#laddr = "tcp://0.0.0.0:26657"#' "$CFG"

  # API/GRPC + gas price
  sed -i 's/^minimum-gas-prices = .*/minimum-gas-prices = "'"$MIN_GAS_PRICES"'"/' "$APP"
  sed -i 's/^enable = false/enable = true/' "$APP"                                                    # REST API
  sed -i 's#^address = "tcp://127.0.0.1:1317"#address = "tcp://0.0.0.0:1317"#' "$APP"                 # REST bind
  sed -i 's/^grpc-enable = false/grpc-enable = true/' "$APP" || true                                   # gRPC on (older SDKs)
  sed -i 's#^address = "0.0.0.0:9090"#address = "0.0.0.0:9090"#' "$APP" || true                        # newer SDKs
fi

echo "[start] launching node..."
exec socialblockd start --rpc.laddr tcp://0.0.0.0:26657 --pruning=nothing

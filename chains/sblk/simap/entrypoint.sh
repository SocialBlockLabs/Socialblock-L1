#!/usr/bin/env bash
set -euo pipefail


HOME_DIR="${DAEMON_HOME:-$HOME/.simapp}"
CHAIN_ID="${CHAIN_ID:-socialblock-devnet-1}"
MONIKER="${MONIKER:-sblk-devnet}"
DENOM="usblk"
MIN_GAS_PRICE="${MIN_GAS_PRICE:-0.025usblk}"


if [ ! -d "$HOME_DIR/config" ]; then
echo "[simd] init…"
simd init "$MONIKER" --chain-id "$CHAIN_ID"


echo "[simd] key add…"
echo -e "y\n" | simd keys add validator --keyring-backend test
simd add-genesis-account $(simd keys show validator -a --keyring-backend test) 100000000000$DENOM
simd gentx validator 70000000000$DENOM --chain-id "$CHAIN_ID" --keyring-backend test
simd collect-gentxs


CFG="$HOME_DIR/config/config.toml"
APP="$HOME_DIR/config/app.toml"


# Open RPC, enable indexer, REST & gRPC
sed -i 's/^indexer = .*/indexer = "kv"/' "$CFG"
sed -i 's/^laddr = "tcp:\/\/127.0.0.1:26657"/laddr = "tcp:\/\/0.0.0.0:26657"/' "$CFG"
sed -i 's/^minimum-gas-prices = .*/minimum-gas-prices = "'$MIN_GAS_PRICE'"/' "$APP"
sed -i 's/^enable = false/enable = true/' "$APP"
sed -i 's/^address = "tcp:\/\/127.0.0.1:1317"/address = "tcp:\/\/0.0.0.0:1317"/' "$APP"
sed -i 's/^grpc-enable = false/grpc-enable = true/' "$APP"
fi


echo "[simd] start…"
exec simd start --rpc.laddr tcp://0.0.0.0:26657 --pruning=nothing

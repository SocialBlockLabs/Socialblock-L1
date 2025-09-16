# chains/sblk/Dockerfile
# Build a real Cosmos SDK node (simd) and expose it as "socialblockd"

########## BUILDER ##########
FROM golang:1.22 AS builder
WORKDIR /src

# Tools required by the Cosmos SDK Makefile
RUN apt-get update && apt-get install -y --no-install-recommends \
    make git ca-certificates build-essential && \
    rm -rf /var/lib/apt/lists/*

# Pin to a stable 0.50.x release
RUN git clone https://github.com/cosmos/cosmos-sdk.git . && git checkout v0.50.13

# Build simd (outputs to /src/build/simd)
ENV CGO_ENABLED=0
RUN make build

########## RUNTIME ##########
FROM debian:bookworm-slim
# Basic runtime deps + jq for genesis patching if ever needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates jq bash curl diffutils && \
    rm -rf /var/lib/apt/lists/*

# Rename simd to socialblockd for consistency with our stack
COPY --from=builder /src/build/simd /usr/local/bin/socialblockd

# Runtime user & paths — run as root so mounted volume is writable on Windows
USER root
ENV HOME=/root
ENV DAEMON_HOME=/root/.simapp
COPY scripts/genesis_patch.sh /usr/local/bin/genesis_patch.sh
RUN chmod +x /usr/local/bin/genesis_patch.sh

# Bake the entrypoint script into the image (no CRLF issues)
RUN bash -lc 'cat > /entrypoint.sh << "EOS"\n\
#!/usr/bin/env bash\n\
set -euo pipefail\n\
\n\
APP_HOME="${DAEMON_HOME:-$HOME/.simapp}"\n\
CHAIN_ID="${CHAIN_ID:-socialblock-devnet-1}"\n\
MONIKER="${MONIKER:-sblk-devnet}"\n\
DENOM="${DENOM:-usblk}"\n\
MIN_GAS_PRICE="${MIN_GAS_PRICE:-0.025usblk}"\n\
INFLATION="${INFLATION:-0.10}"\n\
\n\
if [ ! -d "$APP_HOME/config" ]; then\n\
  echo "[init] initializing chain at $APP_HOME ..."\n\
  socialblockd init "$MONIKER" --chain-id "$CHAIN_ID" --home "$APP_HOME" --default-denom "$DENOM"\n\
\n\
  # Patch genesis denominations via helper script\n\
  GENESIS="$APP_HOME/config/genesis.json" DENOM="$DENOM" INFLATION="$INFLATION" /usr/local/bin/genesis_patch.sh\n\
\n\
  # Deterministic dev keys\n\
  yes | socialblockd keys add validator --keyring-backend test --home "$APP_HOME"\n\
  yes | socialblockd keys add faucet    --keyring-backend test --home "$APP_HOME"\n\
  yes | socialblockd keys add alice     --keyring-backend test --home "$APP_HOME"\n\
  yes | socialblockd keys add bob       --keyring-backend test --home "$APP_HOME"\n\
\n\
  # Fund accounts\n\
  socialblockd add-genesis-account "$(socialblockd keys show validator -a --keyring-backend test --home "$APP_HOME")" 100000000000$DENOM --home "$APP_HOME"\n\
  socialblockd add-genesis-account "$(socialblockd keys show faucet    -a --keyring-backend test --home "$APP_HOME")" 100000000000$DENOM --home "$APP_HOME"\n\
  socialblockd add-genesis-account "$(socialblockd keys show alice     -a --keyring-backend test --home "$APP_HOME")"   100000000$DENOM --home "$APP_HOME"\n\
  socialblockd add-genesis-account "$(socialblockd keys show bob       -a --keyring-backend test --home "$APP_HOME")"   100000000$DENOM --home "$APP_HOME"\n\
\n\
  # Create validator and include gentx\n\
  socialblockd gentx validator 100000000000usblk --chain-id "$CHAIN_ID" --keyring-backend test --home "$APP_HOME"\n\
  socialblockd collect-gentxs --home "$APP_HOME"\n\
\n\
  # Open RPC/API/GRPC and set min-gas\n\
  CFG="$APP_HOME/config/config.toml"\n\
  APP="$APP_HOME/config/app.toml"\n\
  sed -i "s/^indexer = .*/indexer = \"kv\"/" "$CFG"\n\
  sed -i "s#^laddr = \"tcp://127.0.0.1:26657\"#laddr = \"tcp://0.0.0.0:26657\"#" "$CFG"\n\
  sed -i "s/^minimum-gas-prices = .*/minimum-gas-prices = \"$MIN_GAS_PRICE\"/" "$APP" || true\n\
  sed -i "s/^enable = false/enable = true/" "$APP" || true\n\
  sed -i "s#^address = \"tcp://127.0.0.1:1317\"#address = \"tcp://0.0.0.0:1317\"#" "$APP" || true\n\
  sed -i "s/^grpc-enable = false/grpc-enable = true/" "$APP" || true\n\
  # Extra: enable CORS/swagger and public gRPC for explorer/faucet\n\
  sed -i "s/^cors_allowed_origins = .*/cors_allowed_origins = [\"*\"]/" "$CFG" || true\n\
  sed -i "s/^swagger = false/swagger = true/" "$APP" || true\n\
  sed -i "s/^enabled-unsafe-cors = false/enabled-unsafe-cors = true/" "$APP" || true\n\
  sed -i "s#^address = \"127.0.0.1:9090\"#address = \"0.0.0.0:9090\"#" "$APP" || true\n\
  if [ -n "$PERSISTENT_PEERS" ]; then\n\
    sed -i "s/^persistent_peers = .*/persistent_peers = \"$PERSISTENT_PEERS\"/" "$CFG" || true\n\
  fi\n\
fi\n\
\n\
echo "[start] launching node with home=$APP_HOME ..."\n\
exec socialblockd start --home "$APP_HOME" --rpc.laddr tcp://0.0.0.0:26657 --pruning=nothing\n\
EOS\n\
chmod +x /entrypoint.sh'

EXPOSE 26657 26656 1317 9090
ENTRYPOINT ["/entrypoint.sh"]

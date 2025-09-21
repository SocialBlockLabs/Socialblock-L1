#!/usr/bin/env bash
set -euo pipefail
if [ ! -d "/root/.cometbft/config" ]; then
  cometbft init
  sed -i 's/^laddr = "tcp:\/\/127.0.0.1:26657"/laddr = "tcp:\/\/0.0.0.0:26657"/' /root/.cometbft/config/config.toml
fi
abci-cli kvstore &
exec cometbft start

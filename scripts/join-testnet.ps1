param(
  [Parameter(Mandatory=$true, Position=0)][string]$GenesisUrl,
  [Parameter(Mandatory=$true, Position=1)][string]$PersistentPeers
)

$service = "val-1"
try { docker compose ps $service | Out-Null } catch { $service = "node" }

Write-Host "[join-testnet] Downloading genesis and updating peers inside $service ..."
wsl bash -lc "set -euo pipefail; APP_HOME=\"\${DAEMON_HOME:-\$HOME/.simapp}\"; CFG=\"\$APP_HOME/config/config.toml\"; GEN=\"\$APP_HOME/config/genesis.json\"; curl -fsSL \"$GenesisUrl\" -o \"\$GEN\"; sed -i 's/^persistent_peers = .*/persistent_peers = \"$PersistentPeers\"/' \"\$CFG\" || true"

Write-Host "[join-testnet] Updated. Restart containers to take effect: docker compose restart $service"


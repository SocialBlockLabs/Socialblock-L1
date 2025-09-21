param(
  [string]$Compose = "",
  [string]$EnvOut = ""
)

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
if (-not $Compose) { $Compose = Join-Path $root "docker-compose.testnet.yaml" }
if (-not $EnvOut) { $EnvOut = Join-Path $root ".env.testnet" }

Write-Host "[init-testnet] Using compose: $Compose"

Write-Host "[init-testnet] Resetting testnet volumes..."
docker compose -f $Compose down -v

Write-Host "[init-testnet] Building genesis and peers via scripts/testnet/build-genesis.sh ..."
wsl bash -lc "'$(wslpath -a $root)/scripts/testnet/build-genesis.sh'"

Write-Host "[init-testnet] Done. Wrote peers to $EnvOut. Start full testnet with:"
Write-Host "  docker compose -f $Compose --env-file $EnvOut up -d"


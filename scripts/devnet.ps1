param(
  [Parameter(Position=0)]
  [string]$cmd = "help",
  [Parameter(Position=1)]
  [string]$arg1,
  [Parameter(Position=2)]
  [string]$arg2
)

switch ($cmd) {
  "start" { docker compose up --build -d }
  "stop"  { docker compose down }
  "reset" { docker compose down -v }
  "status" {
    try {
      (Invoke-WebRequest -UseBasicParsing http://localhost:26657/status).Content |
        ConvertFrom-Json | ForEach-Object { $_.result.sync_info.latest_block_height }
    } catch {
      Write-Host "Node not responding on 26657"; exit 1
    }
  }
  "logs"  {
    $svc = $arg1; if (-not $svc) { $svc = "node" }
    docker compose logs -f $svc
  }
  "fund" {
    if (-not $arg1 -or -not $arg2) { Write-Host "Usage: ./scripts/devnet.ps1 fund <bech32-address> <amountDenom>"; exit 1 }
    docker compose exec -T node socialblockd tx bank send faucet $arg1 $arg2 --keyring-backend test --chain-id socialblock-devnet-1 --yes
  }
  "keys" { docker compose exec -T node socialblockd keys list --keyring-backend test }
  default { Write-Host "Usage: ./scripts/devnet.ps1 [start|stop|reset|status|logs [svc]|fund <addr> <amountDenom>|keys]" }
}

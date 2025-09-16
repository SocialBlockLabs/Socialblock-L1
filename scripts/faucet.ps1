param(
  [Parameter(Mandatory=$true, Position=0)][string]$Address,
  [Parameter(Mandatory=$true, Position=1)][string]$Amount,
  [string]$ChainId = "socialblock-testnet-1"
)

$service = "val-1"
try { docker compose ps $service | Out-Null } catch { $service = "node" }

docker compose exec -T $service socialblockd tx bank send faucet $Address $Amount `
  --keyring-backend test --chain-id $ChainId --yes


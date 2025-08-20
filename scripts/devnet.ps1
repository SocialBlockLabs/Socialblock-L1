param(
  [Parameter(Position=0,Mandatory=$true)]
  [ValidateSet("start","stop","restart","reset","status","logs")]
  [string]$cmd,
  [string]$svc = "node"
)
Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path) | Out-Null
Set-Location ..
switch ($cmd) {
  "start"   { if (-Not (Test-Path ".env")) { Copy-Item ".env.example" ".env" -Force }; docker compose up --build -d }
  "stop"    { docker compose down }
  "restart" { docker compose down; docker compose up --build -d }
  "reset"   { docker compose down -v }
  "status"  { docker compose ps; Write-Host "RPC: http://localhost:26657   Agent: http://localhost:8080   Explorer: http://localhost:8088" }
  "logs"    { docker compose logs -f $svc }
}

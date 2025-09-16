SocialBlock L1 — Testnet/Mainnet Monorepo

SocialBlock is a Web3-native Layer-1 focused on decentralized reputation, governance, and social engagement. This monorepo contains the L1 app scaffold, an off-chain AI Reputation Proof (ARP) agent, an event indexer, explorer config, and a Dockerized local devnet so you can run end-to-end quickly.

⚠️ Compliance notice: Nothing here is an offer of securities or solicitation. Do not distribute or market any token in the U.S. without proper exemptions and disclosures.

Features
- Devnet that produces blocks instantly (CometBFT kvstore) for fast E2E testing
- Cosmos app skeleton to evolve into the full SocialBlock chain (socialblockd)
- AI ARP Agent (FastAPI) issuing reputation attestations
- Event Indexer (Node.js + Postgres) storing blocks/txs for analytics
- Explorer static placeholder for quick UI wiring
- CI (GitHub Actions) for chain build checks
- Network specs for sblktest-1 (testnet) and sblk-1 (mainnet)

.
├─ ai/arp-agent/           # FastAPI microservice for ARP attestations
├─ chains/sblk/            # Cosmos app skeleton (binary: socialblockd)
├─ devnet/kvstore/         # CometBFT kvstore app + entrypoint (produces blocks)
├─ explorer/pingpub/       # Static explorer placeholder
├─ indexer/event-indexer/  # Node.js WS indexer + Postgres
├─ networks/               # chain.json templates (testnet/mainnet)
├─ .github/workflows/      # CI for chain build
├─ docker-compose.yaml     # One-command local stack
└─ .env.example            # Environment template

Quickstart
Prereqs
- Docker + Docker Compose
- Windows: use Docker Desktop with WSL2 backend enabled; run commands from a WSL2 shell
- Optional for development: Go 1.22+, Node 20+, Python 3.11+

1) Configure env
   cp .env.example .env

2) Launch the stack
   docker compose up --build -d

Services:
- Node RPC: http://localhost:26657
- ARP Agent (FastAPI): http://localhost:8080
- Postgres: localhost:5432
- Explorer: http://localhost:8088

3) Verify block production
- Run:
  
  ```bash
  watch -n2 'curl -s http://localhost:26657/status | jq -r .result.sync_info.latest_block_height'
  ```

  Height should continuously increase (create_empty_blocks=true).

4) Send a transaction and query it
- Get Alice address:

  ```bash
  ALICE=$(docker compose exec -T node socialblockd keys show alice -a --keyring-backend test)
  echo "$ALICE"
  ```

- Send funds from faucet to Alice:

  ```bash
  docker compose exec -T node socialblockd tx bank send faucet "$ALICE" 100000usblk \
    --chain-id socialblock-devnet-1 --keyring-backend test --gas auto --fees 2000usblk --yes
  ```

- Query balance:

  ```bash
  docker compose exec -T node socialblockd q bank balances "$ALICE"
  ```

- Query latest block height and a recent tx via RPC:

  ```bash
  curl -s http://localhost:26657/status | jq -r .result.sync_info.latest_block_height
  ```

Troubleshooting
- "validator set is empty after genesis" or blocks not produced:
  - Ensure the genesis staking/mint/gov/crisis denoms are patched to `usblk`.
  - Our image runs `scripts/genesis_patch.sh` during init; rebuild if you changed it:

    ```bash
    docker compose build node && docker compose up -d node
    ```

  - Check `config/app.toml` has `minimum-gas-prices = "0.025usblk"` and RPC/API/GRPC are enabled.
  - Ensure `create_empty_blocks = true` (default) in `config.toml`.

Run Explorer
- The explorer is served by Nginx and proxies to the validator:
  - RPC: `http://localhost:8088/rpc` → `val-1:26657`
  - REST API: `http://localhost:8088/api` → `val-1:1317`
  - gRPC: `grpc://localhost:8088/grpc` → `val-1:9090` (note: browsers need gRPC-Web; use server-side tools)

Start just the explorer (after the validator is up):

```bash
docker compose up -d val-1 explorer
```

Health checks:

```bash
curl -s http://localhost:8088/rpc/status | jq .
curl -s http://localhost:8088/api/cosmos/base/tendermint/v1beta1/blocks/latest | jq .
```

Testnet
- See TESTNET.md for a multi-node layout (`seed-1`, `val-1`, `val-2`, `faucet`, `indexer`, `ai-arp-agent`) and how to join.

Components
AI ARP Agent
- Purpose: generate reputation attestations (address, score, factors) to be validated/on-chained later.
- Auth: API key via ARP_AGENT_API_KEY (from .env).

Minimal workflow:
1) Start the stack (as above)
2) POST an attestation to the agent (use your key set in .env)

Event Indexer
- Subscribes to tm.event='NewBlock' over WebSocket and writes to Postgres.
- Connection strings are controlled by .env.

Evolving the Cosmos App
This repo includes a compiling skeleton under chains/sblk/ (binary: socialblockd). It’s a placeholder for full module wiring.

Build the binary:
make -C chains/sblk tidy
make -C chains/sblk build

Next milestones for the chain:
- Implement Cosmos SDK wiring (app/, module registration, cmd/socialblockd)
- Add modules under x/:
  - x/identity — SBID/zkID hooks
  - x/reputation — verify ARP attestations, store/decay scores
  - x/rewards — SocialFi emissions, anti-sybil throttles
  - x/governance — params for ARP caps/limits, proposals

Swap devnet from kvstore → socialblockd (when ready):
- Replace the node service in docker-compose.yaml to build/run the chain’s Docker image instead of devnet/kvstore.
- Expose the same ports (26656/26657/1317/9090) and keep the indexer/agent pointing to those endpoints.

Networks
- networks/sblktest-1/chain.json — testnet template
- networks/sblk-1/chain.json — mainnet template

Before launching testnet/mainnet:
- Finalize genesis (allocations, params)
- Publish seed/persistent peers
- Lock gas params, min gas prices, staking denom (usblk)
- Run audits and write ceremony docs

Configuration
Environment variables (.env):
- POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
- ARP_AGENT_API_KEY — API key for ARP agent
- RPC_WS, RPC_HTTP — Node endpoints for indexer/agent (default to the node service)
- INDEXER_DB_URL — Postgres DSN for indexer

Development Notes
- Use the kvstore devnet for instant blocks and rapid end-to-end validation.
- The Cosmos app evolves in parallel; once ready, swap the node service to the real chain.
- Recommended tooling:
  - Go 1.21+ (chain)
  - Node 20+ (indexer)
  - Python 3.11+ (agent)

Security & Legal
- Report vulnerabilities privately to: security@socialblock.io
- Keep PII off-chain; use zk attestations for selective disclosure where possible.
- Ensure U.S. securities/AML/fintech obligations are met before any token distribution.
- Maintain full disclosures and audit trails for ARP scoring to mitigate bias/liability.

Contributing
1) Fork → create a feature branch
2) Add tests/docs where appropriate
3) Open a PR with a clear scope and checklist

License
Apache-2.0 © SocialBlock, Inc.

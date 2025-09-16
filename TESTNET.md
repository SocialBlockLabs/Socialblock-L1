SocialBlock Testnet

Overview
This repository includes a Docker Compose-based multi-node testnet topology:
- seed-1: seed/boot node (no validator keys)
- val-1: validator node 1
- val-2: validator node 2
- faucet: non-validating node for sending funds
- indexer: WS-based event indexer (Postgres)
- ai-arp-agent: FastAPI service issuing ARP attestations

Files
- docker-compose.testnet.yaml: Compose file defining the services, shared network, and volumes
- scripts/testnet/build-genesis.sh: Creates a shared genesis, configures peers, and distributes genesis
- Makefile targets: testnet-up, testnet-down, testnet-clean

Bring up the testnet
1) Generate a shared genesis and bring up:

```bash
make testnet-up
```

This will:
- Start seed-1, read its node ID, and write `.env.testnet` with `PERSISTENT_PEERS`.
- Initialize and patch genesis denom to `usblk` on the seed.
- Create validator keys on val-1 and val-2 and fund them in genesis.
- Generate gentxs, collect on the seed, and distribute the final genesis to both validators.
- Launch the full topology.

Verify
- Check RPC status (height should grow):

```bash
curl -s http://localhost:26657/status | jq -r .result.sync_info.latest_block_height
```

Join the testnet (external node)
If you want to join with a node outside Docker Compose:
1) Set your node’s `persistent_peers` to the seed peer from `.env.testnet` (e.g., `NODEID@<seed-host>:26656`).
2) Ensure your `app.toml` has `minimum-gas-prices = "0.025usblk"` and RPC/API/GRPC enabled.
3) Use the published `genesis.json` (copy from running seed or from your distribution channel):

```bash
docker compose -f docker-compose.testnet.yaml cp seed-1:/root/.simapp/config/genesis.json ./genesis.json
```

Lifecycle
- Stop: `make testnet-down`
- Reset: `make testnet-clean`

Troubleshooting
- If validators don’t start or blocks don’t advance:
  - Confirm `genesis.json` staking/mint/gov/crisis denoms are `usblk`.
  - Verify `persistent_peers` includes the seed’s `node_id@host:26656`.
  - Ensure `create_empty_blocks = true` in `config.toml`.
  - Check container logs:

```bash
docker compose -f docker-compose.testnet.yaml logs -f seed-1 val-1 val-2
```


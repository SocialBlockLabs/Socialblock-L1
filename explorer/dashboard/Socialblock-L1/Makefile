COMPOSE_TESTNET=docker-compose.testnet.yaml
ENV_TESTNET=.env.testnet

.PHONY: testnet-up testnet-down testnet-clean testnet-genesis

testnet-genesis:
	bash scripts/testnet/build-genesis.sh

testnet-up: testnet-genesis
	docker compose -f $(COMPOSE_TESTNET) --env-file $(ENV_TESTNET) up -d

testnet-down:
	docker compose -f $(COMPOSE_TESTNET) --env-file $(ENV_TESTNET) down

testnet-clean:
	docker compose -f $(COMPOSE_TESTNET) --env-file $(ENV_TESTNET) down -v || true
	rm -f $(ENV_TESTNET)


FROM golang:1.21 as build
WORKDIR /src
RUN git clone https://github.com/cometbft/cometbft.git . && git checkout v0.38.7
RUN --mount=type=cache,target=/go/pkg/mod --mount=type=cache,target=/root/.cache/go-build make build
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=build /src/build/cometbft /usr/local/bin/cometbft
COPY --from=build /src/build/abci-cli /usr/local/bin/abci-cli
EXPOSE 26656 26657
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

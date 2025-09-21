# Build both binaries explicitly to avoid missing abci-cli
FROM golang:1.21 as build
WORKDIR /src
RUN git clone https://github.com/cometbft/cometbft.git . && git checkout v0.38.7

# Build cometbft and abci-cli explicitly
RUN --mount=type=cache,target=/go/pkg/mod --mount=type=cache,target=/root/.cache/go-build     CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/cometbft ./cmd/cometbft
RUN --mount=type=cache,target=/go/pkg/mod --mount=type=cache,target=/root/.cache/go-build     CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/abci-cli ./abci/cmd/abci-cli

# Runtime image
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=build /out/cometbft /usr/local/bin/cometbft
COPY --from=build /out/abci-cli /usr/local/bin/abci-cli
EXPOSE 26656 26657
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

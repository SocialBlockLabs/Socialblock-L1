# Build a real Cosmos SDK node (simd) and expose it as "socialblockd"

FROM golang:1.22 AS builder
WORKDIR /src
# Get Cosmos SDK v0.50.x (stable for app v2)
RUN git clone https://github.com/cosmos/cosmos-sdk.git . && git checkout v0.50.7
# Build the node
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/simd ./simapp/simd

FROM debian:bookworm-slim
RUN useradd -m -u 10001 appuser && apt-get update && apt-get install -y ca-certificates jq && rm -rf /var/lib/apt/lists/*
# Rename simd to socialblockd for consistency with our stack
COPY --from=builder /out/simd /usr/local/bin/socialblockd
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
USER appuser
ENV HOME=/home/appuser
ENV DAEMON_HOME=/home/appuser/.socialblockd
EXPOSE 26657 26656 1317 9090
ENTRYPOINT ["/entrypoint.sh"]

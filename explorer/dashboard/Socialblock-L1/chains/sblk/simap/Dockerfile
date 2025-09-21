# Build stage: clone Cosmos SDK and build simd (v0.50.x)
FROM golang:1.21 AS builder
WORKDIR /src
RUN git clone https://github.com/cosmos/cosmos-sdk.git . \
&& git checkout v0.50.7
RUN --mount=type=cache,target=/go/pkg/mod \
--mount=type=cache,target=/root/.cache/go-build \
make build \
&& cp build/simd /out/simd


# Runtime stage
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates jq && rm -rf /var/lib/apt/lists/* \
&& useradd -m -u 10001 appuser
COPY --from=builder /out/simd /usr/local/bin/simd
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
USER appuser
ENV HOME=/home/appuser
ENV DAEMON_HOME=/home/appuser/.simapp
EXPOSE 26657 26656 1317 9090
ENTRYPOINT ["/entrypoint.sh"]

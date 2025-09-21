# SocialBlock Explorer Dashboard - Backend Integration Guide

This document provides comprehensive instructions for integrating the SocialBlock Explorer Dashboard with the official SocialBlock L1 backend services.

## Overview

The SocialBlock Explorer Dashboard is a React-based frontend that integrates with the SocialBlock L1 blockchain infrastructure as defined in the [official repository](https://github.com/SocialBlockLabs/Socialblock-L1).

## Architecture Integration

### Backend Services Integration

The explorer integrates with the following backend services from the official repo:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SocialBlock Explorer Dashboard               │
│                         (This Frontend)                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Official Repo Services                      │
├─────────────────────────────────────────────────────────────────┤
│ 1. Node (CometBFT + Cosmos SDK)                               │
│    - RPC: http://localhost:26657                               │
│    - REST: http://localhost:1317                               │
│    - gRPC: http://localhost:9090                               │
│                                                                 │
│ 2. ARP Agent (FastAPI)                                         │
│    - API: http://localhost:8080                                │
│    - AI Reputation Proof attestations                          │
│                                                                 │
│ 3. Event Indexer (Node.js + Postgres)                         │
│    - API: http://localhost:3001                                │
│    - Block/transaction indexing                                │
│                                                                 │
│ 4. Explorer Backend (Nginx + Proxies)                         │
│    - API: http://localhost:8088                                │
│    - Static assets and API proxying                            │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Integration Setup

### 1. Prerequisites

Ensure you have the official SocialBlock L1 repository running:

```bash
# Clone the official repository
git clone https://github.com/SocialBlockLabs/Socialblock-L1.git
cd Socialblock-L1

# Set up environment
cp .env.example .env

# Start the full stack
docker compose up --build -d
```

### 2. Configure Explorer Environment

Copy the environment configuration:

```bash
# In the explorer dashboard directory
cp env.example .env
```

Edit `.env` to match your backend setup:

```env
VITE_NETWORK=development
VITE_RPC_HTTP=http://localhost:26657
VITE_RPC_WS=ws://localhost:26657/websocket
VITE_REST_API=http://localhost:1317
VITE_GRPC=http://localhost:9090
VITE_ARP_AGENT=http://localhost:8080
VITE_ARP_AGENT_API_KEY=your-arp-agent-api-key-here
VITE_INDEXER_API=http://localhost:3001
VITE_EXPLORER_API=http://localhost:8088
```

### 3. Install and Run Explorer

```bash
npm install
npm run dev
```

The explorer will be available at `http://localhost:3000`.

## Detailed Integration Points

### 1. Node Integration (CometBFT + Cosmos SDK)

The explorer connects to the SocialBlock node for:

- **RPC Endpoints**: Block data, transaction queries, validator info
- **REST API**: Cosmos SDK module queries (bank, staking, governance)
- **WebSocket**: Real-time block and transaction updates

**Key Integration Files:**
- `config/api.config.ts`: Endpoint configuration
- `src/services/api.service.ts`: API service implementation
- `src/hooks/useApi.ts`: React hooks for data fetching

### 2. ARP Agent Integration

The AI Reputation Proof (ARP) agent provides:

- Reputation scores and attestations
- AI agent activity monitoring
- Explainable AI decision logs

**Authentication:**
The ARP agent requires an API key set in `VITE_ARP_AGENT_API_KEY`.

### 3. Event Indexer Integration

The indexer provides:

- Paginated block and transaction data
- Search functionality
- Network analytics and statistics

### 4. Real-time Data Updates

The explorer uses WebSocket connections for real-time updates:

```typescript
// Example usage in components
import { useLatestBlocks, useWebSocket } from '../hooks/useApi';

function BlocksTab() {
  const { blocks, loading, error } = useLatestBlocks(20);
  const { connected, messages } = useWebSocket(['tm.event=\'NewBlock\'']);
  
  // Component implementation
}
```

## Network Configuration

### Development (Local)

```typescript
development: {
  NODE_RPC: 'http://localhost:26657',
  NODE_REST: 'http://localhost:1317',
  ARP_AGENT: 'http://localhost:8080',
  INDEXER_API: 'http://localhost:3001',
}
```

### Testnet (sblktest-1)

```typescript
testnet: {
  NODE_RPC: 'https://rpc.testnet.socialblock.io',
  NODE_REST: 'https://api.testnet.socialblock.io',
  ARP_AGENT: 'https://arp.testnet.socialblock.io',
  INDEXER_API: 'https://indexer.testnet.socialblock.io',
}
```

### Mainnet (sblk-1)

```typescript
mainnet: {
  NODE_RPC: 'https://rpc.socialblock.io',
  NODE_REST: 'https://api.socialblock.io',
  ARP_AGENT: 'https://arp.socialblock.io',
  INDEXER_API: 'https://indexer.socialblock.io',
}
```

## API Integration Examples

### Fetching Latest Blocks

```typescript
import { useLatestBlocks } from '../hooks/useApi';

function BlocksComponent() {
  const { blocks, loading, error } = useLatestBlocks(10);
  
  if (loading) return <div>Loading blocks...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {blocks.map(block => (
        <div key={block.header.height}>
          Block #{block.header.height}
        </div>
      ))}
    </div>
  );
}
```

### Fetching Validator Data

```typescript
import { useValidators } from '../hooks/useApi';

function ValidatorsComponent() {
  const { data: validators, loading, error } = useValidators();
  
  return (
    <div>
      {validators?.validators.map(validator => (
        <div key={validator.operator_address}>
          {validator.description.moniker}
        </div>
      ))}
    </div>
  );
}
```

### ARP Integration

```typescript
import { useArpData } from '../hooks/useApi';

function ReputationComponent({ address }: { address: string }) {
  const { arpData, loading, error } = useArpData(address);
  
  if (arpData?.score) {
    return (
      <div>
        Reputation Score: {arpData.score.value}
        <div>Factors: {arpData.score.factors.join(', ')}</div>
      </div>
    );
  }
  
  return <div>No reputation data available</div>;
}
```

## Deployment Integration

### Docker Integration

To integrate with the official repo's Docker setup, add the explorer to the `docker-compose.yaml`:

```yaml
services:
  # ... existing services ...
  
  explorer-ui:
    build: ./explorer-dashboard
    ports:
      - "3000:3000"
    environment:
      - VITE_NETWORK=development
      - VITE_RPC_HTTP=http://node:26657
      - VITE_REST_API=http://node:1317
      - VITE_ARP_AGENT=http://arp-agent:8080
      - VITE_INDEXER_API=http://indexer:3001
    depends_on:
      - node
      - arp-agent
      - indexer
    networks:
      - socialblock-network
```

### Production Deployment

For production deployment:

1. Build the explorer:
```bash
npm run build
```

2. Serve the built files using the existing Nginx setup in the official repo
3. Update the explorer service configuration to proxy to the built assets
4. Ensure all environment variables are properly configured for the target network

## Troubleshooting

### Common Issues

1. **CORS Issues**: Ensure the backend services have proper CORS configuration for the explorer domain
2. **WebSocket Connection Failed**: Check that WebSocket endpoints are accessible and not blocked by firewalls
3. **API Key Authentication**: Ensure the ARP agent API key is correctly configured
4. **Network Mismatch**: Verify that the explorer is configured for the correct network (development/testnet/mainnet)

### Health Checks

The explorer includes health checks for all integrated services:

```typescript
import { apiService } from '../services/api.service';

// Check node status
const nodeStatus = await apiService.getNodeStatus();

// Check ARP agent health
const arpHealth = await apiService.getArpHealth();

// Check indexer connectivity
const stats = await apiService.getNetworkStats();
```

## Future Integration Points

As the SocialBlock L1 evolves, the explorer is prepared for:

1. **Custom Cosmos Modules**: Ready to integrate with future `x/identity`, `x/reputation`, and `x/rewards` modules
2. **Enhanced ARP Features**: Expandable ARP integration for new AI capabilities
3. **Governance Features**: Advanced DAO governance visualization and participation
4. **Cross-chain Integration**: Future multi-chain support

## Support

For integration issues:

1. Check the [official repository](https://github.com/SocialBlockLabs/Socialblock-L1) documentation
2. Verify all services are running: `docker compose ps`
3. Check service logs: `docker compose logs [service-name]`
4. Ensure network connectivity between services

## Contributing

When contributing to the integration:

1. Follow the API patterns established in `src/services/api.service.ts`
2. Add appropriate React hooks in `src/hooks/useApi.ts`
3. Update configuration in `config/api.config.ts`
4. Test with all three environments (development, testnet, mainnet)
5. Update this documentation with any new integration points

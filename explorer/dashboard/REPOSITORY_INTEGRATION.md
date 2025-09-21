# SocialBlock Explorer Dashboard - Repository Integration Instructions

This document provides step-by-step instructions for integrating the SocialBlock Explorer Dashboard into the official [SocialBlock L1 repository](https://github.com/SocialBlockLabs/Socialblock-L1).

## Integration Overview

The SocialBlock Explorer Dashboard will be integrated as a new service in the official repository's Docker Compose stack, providing a modern web interface for the SocialBlock L1 blockchain.

## Step-by-Step Integration

### Step 1: Prepare the Official Repository

1. **Clone the official repository** (if not already done):
```bash
git clone https://github.com/SocialBlockLabs/Socialblock-L1.git
cd Socialblock-L1
```

2. **Create a new branch for the integration**:
```bash
git checkout -b feature/explorer-dashboard-integration
```

### Step 2: Add Explorer Directory Structure

1. **Create the explorer directory**:
```bash
mkdir -p explorer/dashboard
```

2. **Copy all explorer files** to the new directory:
```bash
# Copy all files from this dashboard project to explorer/dashboard/
# This includes:
# - src/ (React components and application code)
# - public/ (static assets)
# - config/ (API configuration)
# - package.json, vite.config.ts, etc.
```

The directory structure should look like:
```
Socialblock-L1/
├── explorer/
│   └── dashboard/
│       ├── src/
│       ├── public/
│       ├── config/
│       ├── package.json
│       ├── vite.config.ts
│       ├── Dockerfile
│       ├── nginx.conf
│       └── ... (all other dashboard files)
├── ai/arp-agent/
├── chains/sblk/
├── devnet/kvstore/
├── indexer/event-indexer/
└── ... (existing official repo structure)
```

### Step 3: Update Docker Compose Configuration

1. **Edit the main `docker-compose.yaml`** to add the explorer service:

```yaml
# Add this service to the existing docker-compose.yaml
services:
  # ... existing services (node, arp-agent, indexer, etc.) ...

  explorer-ui:
    build: 
      context: ./explorer/dashboard
      dockerfile: Dockerfile
    container_name: socialblock-explorer-ui
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
      - VITE_NETWORK=development
      - VITE_RPC_HTTP=http://localhost:3000/rpc
      - VITE_RPC_WS=ws://localhost:3000/ws/websocket
      - VITE_REST_API=http://localhost:3000/api
      - VITE_GRPC=http://localhost:3000/grpc
      - VITE_ARP_AGENT=http://localhost:3000/arp
      - VITE_INDEXER_API=http://localhost:3000/indexer
      - VITE_ARP_AGENT_API_KEY=${ARP_AGENT_API_KEY}
    depends_on:
      - node
      - arp-agent
      - indexer
    networks:
      - socialblock-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Step 4: Update Environment Configuration

1. **Update `.env.example`** to include explorer-specific variables:

```env
# Add these lines to the existing .env.example

# SocialBlock Explorer Configuration
EXPLORER_ENABLED=true
EXPLORER_PORT=3000
EXPLORER_NETWORK=development

# Optional: Analytics and debugging
EXPLORER_ENABLE_DEBUG=false
EXPLORER_ENABLE_ANALYTICS=true
```

### Step 5: Update Documentation

1. **Update the main `README.md`** to include explorer information:

```markdown
# Add this section to the existing README.md

## SocialBlock Explorer Dashboard

The repository now includes a modern web-based explorer dashboard for visualizing blockchain data, validator information, governance proposals, and AI reputation proofs.

### Features

- **Real-time Block Explorer**: Live block and transaction monitoring
- **Validator Dashboard**: Comprehensive validator performance tracking
- **AI Reputation System**: ARP (AI Reputation Proof) visualization
- **Governance Interface**: DAO proposal tracking and voting visualization
- **Mobile-Responsive Design**: Optimized for all device sizes

### Quick Start

1. Start the full stack including the explorer:
```bash
docker compose up --build -d
```

2. Access the explorer at: http://localhost:3000

### Services Integration

The explorer integrates with all backend services:
- **Node RPC/REST**: Block and transaction data
- **ARP Agent**: AI reputation scoring and attestations
- **Event Indexer**: Historical data and analytics
- **WebSocket**: Real-time updates
```

### Step 6: Add Makefile Targets

1. **Update the `Makefile`** to include explorer-specific commands:

```makefile
# Add these targets to the existing Makefile

.PHONY: explorer-build explorer-dev explorer-logs

explorer-build:
	@echo "Building SocialBlock Explorer..."
	docker compose build explorer-ui

explorer-dev:
	@echo "Starting SocialBlock Explorer in development mode..."
	cd explorer/dashboard && npm run dev

explorer-logs:
	@echo "Showing SocialBlock Explorer logs..."
	docker compose logs -f explorer-ui

explorer-health:
	@echo "Checking SocialBlock Explorer health..."
	curl -f http://localhost:3000/health || echo "Explorer not healthy"
```

### Step 7: Update CI/CD Pipeline

1. **Update `.github/workflows/`** to include explorer testing:

Create `.github/workflows/explorer-ci.yml`:

```yaml
name: Explorer CI

on:
  push:
    branches: [ main, develop ]
    paths: 
      - 'explorer/dashboard/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'explorer/dashboard/**'

jobs:
  test-explorer:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: 'explorer/dashboard/package-lock.json'
    
    - name: Install dependencies
      run: |
        cd explorer/dashboard
        npm ci
    
    - name: Build explorer
      run: |
        cd explorer/dashboard
        npm run build
    
    - name: Test Docker build
      run: |
        cd explorer/dashboard
        docker build -t socialblock-explorer:test .
```

### Step 8: Create Integration Tests

1. **Create integration test file** `scripts/test-explorer-integration.sh`:

```bash
#!/bin/bash
set -e

echo "Testing SocialBlock Explorer Integration..."

# Start services
docker compose up -d --build

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Test explorer health
echo "Testing explorer health..."
curl -f http://localhost:3000/health || exit 1

# Test API proxies
echo "Testing API endpoints..."
curl -f http://localhost:3000/api/cosmos/base/tendermint/v1beta1/node_info || exit 1
curl -f http://localhost:3000/rpc/status || exit 1

# Test ARP agent proxy (if API key is configured)
if [ ! -z "$ARP_AGENT_API_KEY" ]; then
    echo "Testing ARP agent proxy..."
    curl -f -H "Authorization: Bearer $ARP_AGENT_API_KEY" http://localhost:3000/arp/health || exit 1
fi

echo "All integration tests passed!"
```

### Step 9: Update Network Configurations

1. **Update network configurations** in `networks/` to include explorer endpoints:

For `networks/sblktest-1/chain.json`:
```json
{
  "chain_id": "sblktest-1",
  "chain_name": "SocialBlock Testnet",
  "explorer": {
    "url": "https://explorer.testnet.socialblock.io",
    "api": "https://explorer.testnet.socialblock.io/api",
    "rpc": "https://explorer.testnet.socialblock.io/rpc"
  }
}
```

### Step 10: Create Pull Request

1. **Commit all changes**:
```bash
git add .
git commit -m "feat: integrate SocialBlock Explorer Dashboard

- Add modern React-based blockchain explorer
- Integrate with existing backend services (node, ARP agent, indexer)
- Add Docker configuration and nginx proxy setup
- Include comprehensive API integration layer
- Add real-time WebSocket support for live updates
- Mobile-responsive design with modern UI/UX
- Complete documentation and deployment guides
"
```

2. **Push the branch**:
```bash
git push origin feature/explorer-dashboard-integration
```

3. **Create Pull Request** with the following information:

**Title**: `feat: Add SocialBlock Explorer Dashboard Integration`

**Description**:
```markdown
## Overview
This PR integrates a modern, React-based blockchain explorer dashboard into the SocialBlock L1 repository.

## Features Added
- 🌐 **Modern Web Interface**: React + TypeScript + Tailwind CSS
- ⚡ **Real-time Updates**: WebSocket integration for live block/transaction data
- 🤖 **AI Integration**: ARP (AI Reputation Proof) visualization and monitoring
- 🏛️ **Governance Dashboard**: DAO proposal tracking and voting visualization  
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🔒 **Security Focused**: Proper CORS, CSP, and rate limiting
- 📊 **Analytics Ready**: Built-in metrics and monitoring

## Integration Points
- ✅ CometBFT RPC endpoints
- ✅ Cosmos SDK REST API
- ✅ ARP Agent FastAPI service
- ✅ Event Indexer Node.js service
- ✅ WebSocket real-time updates
- ✅ Docker Compose integration

## Testing
- [x] Local development environment
- [x] Docker build and deployment
- [x] API integration tests
- [x] WebSocket connectivity
- [x] Mobile responsiveness
- [x] Security headers and CORS

## Documentation
- [x] Integration guide (INTEGRATION.md)
- [x] Deployment guide (DEPLOYMENT.md)
- [x] API documentation
- [x] Docker configuration
- [x] Environment setup

## Breaking Changes
None - this is purely additive.

## Deployment
The explorer will be available at `http://localhost:3000` when running the full stack with `docker compose up -d`.
```

## Post-Integration Steps

### 1. Update Official Documentation

Once the PR is merged, update the official documentation to include:

1. **Explorer usage instructions** in the main README
2. **API endpoints documentation** for frontend developers
3. **Deployment guides** for different environments
4. **Troubleshooting section** for common issues

### 2. Set Up Production Deployments

1. **Testnet deployment**: Configure explorer for sblktest-1
2. **Mainnet deployment**: Configure explorer for sblk-1
3. **Domain setup**: Configure DNS for explorer subdomains
4. **SSL certificates**: Set up HTTPS for production deployments

### 3. Monitor and Maintain

1. **Set up monitoring** for the explorer service
2. **Configure logging** for debugging and analytics
3. **Regular updates** for dependencies and security patches
4. **Performance optimization** based on usage patterns

## Benefits of This Integration

1. **Enhanced User Experience**: Modern, intuitive interface for blockchain exploration
2. **Developer Friendly**: Comprehensive API integration examples
3. **Community Engagement**: Transparent governance and reputation visualization
4. **Professional Presentation**: Production-ready deployment with proper security
5. **Future-Proof**: Extensible architecture for new features and modules

## Support and Maintenance

The explorer is designed to be:
- **Self-contained**: Minimal dependencies on external services
- **Configurable**: Environment-based configuration for different networks
- **Scalable**: Ready for high-traffic deployments
- **Maintainable**: Clear code structure and comprehensive documentation

For ongoing support and feature requests, the explorer codebase follows the same contribution guidelines as the main SocialBlock L1 repository.

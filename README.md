
# SocialBlock L1 - Explorer Dashboard Integration

This repository now includes the complete SocialBlock Explorer Dashboard UI/UX, integrated with the SocialBlock L1 blockchain infrastructure.

## Overview

The SocialBlock Explorer Dashboard is a modern, responsive React-based interface that provides comprehensive blockchain analytics, reputation tracking, governance insights, and AI-powered features for the SocialBlock L1 network.

## Quick Start

### Running the Dashboard

```bash
# Navigate to the dashboard directory
cd explorer/dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### Full Stack Setup

For the complete SocialBlock L1 experience with backend integration:

```bash
# Configure environment
cp .env.example .env

# Launch the full stack
docker compose up --build -d
```

This will start:
- **Node RPC**: `http://localhost:26657`
- **ARP Agent (FastAPI)**: `http://localhost:8080`
- **Postgres**: `localhost:5432`
- **Explorer Dashboard**: `http://localhost:8088`

## Dashboard Features

### Core Explorer Features
- **Block Explorer**: Real-time block and transaction monitoring
- **Validator Tracking**: Comprehensive validator performance metrics
- **Network Analytics**: Live network statistics and health monitoring
- **Transaction Analysis**: Detailed transaction inspection and tracing

### SocialBlock-Specific Features
- **Reputation System**: AI-powered reputation scoring and tracking
- **SBID Integration**: SocialBlock Identity verification and management
- **Governance Dashboard**: DAO proposals, voting patterns, and participation metrics
- **AI Agent Monitoring**: Real-time AI agent activity and decision tracking
- **ARP (AI Reputation Proof)**: Transparent reputation attestation system

### Advanced Features
- **Plugin System**: Extensible architecture for custom functionality
- **Real-time Updates**: WebSocket-based live data streaming
- **Mobile Responsive**: Optimized for all device sizes
- **Dark/Light Themes**: Adaptive UI with cyberpunk aesthetics
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation

## Project Structure

```
├── explorer/
│   ├── dashboard/           # React-based explorer dashboard
│   │   ├── src/            # Dashboard source code
│   │   ├── package.json    # Dashboard dependencies
│   │   └── README.md       # Dashboard documentation
│   └── pingpub/            # Static explorer placeholder
├── ai/arp-agent/           # FastAPI microservice for ARP attestations
├── chains/sblk/            # Cosmos app skeleton (binary: socialblockd)
├── devnet/kvstore/         # CometBFT kvstore app + entrypoint
├── indexer/event-indexer/  # Node.js WS indexer + Postgres
├── networks/               # chain.json templates (testnet/mainnet)
└── docker-compose.yaml     # One-command local stack
```

## Technology Stack

### Dashboard
- **Frontend**: React 18 + TypeScript
- **UI Framework**: Radix UI + Tailwind CSS
- **Build Tool**: Vite
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Blockchain**: Cosmos SDK + CometBFT
- **AI Agent**: FastAPI (Python)
- **Indexer**: Node.js + PostgreSQL
- **Containerization**: Docker + Docker Compose

## Network Support

- **Testnet**: `sblktest-1` - Development and testing environment
- **Mainnet**: `sblk-1` - Production environment

## Development

### Dashboard Development
```bash
cd explorer/dashboard
npm run dev
```

### Backend Development
```bash
# Build the chain
make -C chains/sblk build

# Run the full stack
docker compose up --build -d
```

## Integration

The dashboard seamlessly integrates with the SocialBlock L1 backend services:
- **RPC Endpoints**: Cosmos SDK RPC for blockchain data
- **Event Indexer**: Real-time blockchain event processing
- **ARP Agent**: AI-powered reputation attestations
- **PostgreSQL**: Indexed blockchain data storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## License

Apache-2.0 © SocialBlock, Inc.
  
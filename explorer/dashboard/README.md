# SocialBlock Explorer Dashboard

A modern, responsive React-based dashboard for the SocialBlock L1 blockchain explorer. This dashboard provides comprehensive blockchain analytics, reputation tracking, governance insights, and AI-powered features.

## Features

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

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Radix UI + Tailwind CSS
- **Build Tool**: Vite
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks + Context
- **Styling**: Tailwind CSS with custom cyberpunk theme

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to the dashboard directory
cd explorer/dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# The built files will be in the `dist` directory
```

## Project Structure

```
explorer/dashboard/
├── src/
│   ├── components/           # React components
│   │   ├── tabs/            # Tab-specific components
│   │   ├── ui/              # Reusable UI components
│   │   ├── plugins/         # Plugin system components
│   │   └── validators/      # Validator-specific components
│   ├── assets/              # Static assets
│   ├── styles/              # Global styles
│   └── guidelines/          # Development guidelines
├── index.html               # Main HTML template
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
└── README.md               # This file
```

## Integration with SocialBlock L1

This dashboard is designed to integrate seamlessly with the SocialBlock L1 backend:

### Backend Integration Points
- **RPC Endpoints**: Connects to Cosmos SDK RPC for blockchain data
- **Event Indexer**: Integrates with the Node.js event indexer for real-time updates
- **ARP Agent**: Communicates with the FastAPI ARP agent for reputation data
- **PostgreSQL**: Queries indexed blockchain data from the event indexer database

### Environment Configuration
The dashboard expects the following backend services:
- **Node RPC**: `http://localhost:26657` (default)
- **ARP Agent API**: `http://localhost:8080` (default)
- **PostgreSQL**: `localhost:5432` (default)

### Network Support
- **Testnet**: `sblktest-1` - Development and testing environment
- **Mainnet**: `sblk-1` - Production environment

## Development

### Component Architecture
The dashboard follows a modular component architecture:

- **Tab Components**: Main feature areas (Blocks, Transactions, Validators, etc.)
- **UI Components**: Reusable design system components
- **Plugin System**: Extensible architecture for custom features
- **Hooks**: Custom React hooks for data fetching and state management

### Styling Guidelines
- Uses Tailwind CSS with custom cyberpunk theme
- Responsive design with mobile-first approach
- Consistent color scheme with neon accents
- Accessibility-focused design patterns

### Adding New Features
1. Create components in appropriate directories
2. Follow the established naming conventions
3. Use TypeScript for type safety
4. Include proper error handling and loading states
5. Test on multiple screen sizes

## Deployment

### Docker Integration
The dashboard can be integrated into the main SocialBlock L1 Docker setup:

```yaml
# Add to docker-compose.yaml
dashboard:
  build: ./explorer/dashboard
  ports:
    - "8088:80"
  environment:
    - VITE_RPC_URL=http://node:26657
    - VITE_ARP_AGENT_URL=http://ai-arp-agent:8080
  depends_on:
    - node
    - ai-arp-agent
```

### Static Hosting
The built dashboard can be served as static files from any web server or CDN.

## Contributing

1. Follow the established code style and patterns
2. Add TypeScript types for all new components
3. Include proper error handling
4. Test on multiple devices and browsers
5. Update documentation for new features

## License

Apache-2.0 © SocialBlock, Inc.

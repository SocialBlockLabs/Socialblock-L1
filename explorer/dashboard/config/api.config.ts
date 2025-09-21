/**
 * SocialBlock Explorer API Configuration
 * 
 * This file contains all API endpoints and configuration for integrating
 * with the SocialBlock L1 backend services as defined in the official repo:
 * https://github.com/SocialBlockLabs/Socialblock-L1
 */

// Environment-based configuration
export const API_CONFIG = {
  // Development/Local (matches docker-compose.yaml from official repo)
  development: {
    NODE_RPC: process.env.VITE_RPC_HTTP || 'http://localhost:26657',
    NODE_RPC_WS: process.env.VITE_RPC_WS || 'ws://localhost:26657/websocket',
    NODE_REST: process.env.VITE_REST_API || 'http://localhost:1317',
    NODE_GRPC: process.env.VITE_GRPC || 'http://localhost:9090',
    ARP_AGENT: process.env.VITE_ARP_AGENT || 'http://localhost:8080',
    INDEXER_API: process.env.VITE_INDEXER_API || 'http://localhost:3001',
    EXPLORER_API: process.env.VITE_EXPLORER_API || 'http://localhost:8088',
  },
  
  // Testnet (sblktest-1)
  testnet: {
    NODE_RPC: process.env.VITE_RPC_HTTP || 'https://rpc.testnet.socialblock.io',
    NODE_RPC_WS: process.env.VITE_RPC_WS || 'wss://rpc.testnet.socialblock.io/websocket',
    NODE_REST: process.env.VITE_REST_API || 'https://api.testnet.socialblock.io',
    NODE_GRPC: process.env.VITE_GRPC || 'https://grpc.testnet.socialblock.io',
    ARP_AGENT: process.env.VITE_ARP_AGENT || 'https://arp.testnet.socialblock.io',
    INDEXER_API: process.env.VITE_INDEXER_API || 'https://indexer.testnet.socialblock.io',
    EXPLORER_API: process.env.VITE_EXPLORER_API || 'https://explorer.testnet.socialblock.io',
  },
  
  // Mainnet (sblk-1)
  mainnet: {
    NODE_RPC: process.env.VITE_RPC_HTTP || 'https://rpc.socialblock.io',
    NODE_RPC_WS: process.env.VITE_RPC_WS || 'wss://rpc.socialblock.io/websocket',
    NODE_REST: process.env.VITE_REST_API || 'https://api.socialblock.io',
    NODE_GRPC: process.env.VITE_GRPC || 'https://grpc.socialblock.io',
    ARP_AGENT: process.env.VITE_ARP_AGENT || 'https://arp.socialblock.io',
    INDEXER_API: process.env.VITE_INDEXER_API || 'https://indexer.socialblock.io',
    EXPLORER_API: process.env.VITE_EXPLORER_API || 'https://explorer.socialblock.io',
  }
};

// Current environment detection
export const getCurrentEnvironment = (): keyof typeof API_CONFIG => {
  const env = process.env.NODE_ENV || 'development';
  const network = process.env.VITE_NETWORK || 'development';
  
  if (network === 'mainnet') return 'mainnet';
  if (network === 'testnet') return 'testnet';
  return 'development';
};

// Get current API configuration
export const getApiConfig = () => {
  const env = getCurrentEnvironment();
  return API_CONFIG[env];
};

// API Endpoints mapping to official repo services
export const ENDPOINTS = {
  // Node RPC endpoints (from CometBFT)
  NODE: {
    STATUS: '/status',
    BLOCK: '/block',
    BLOCK_BY_HEIGHT: (height: number) => `/block?height=${height}`,
    BLOCKCHAIN: '/blockchain',
    TX: '/tx',
    TX_SEARCH: '/tx_search',
    VALIDATORS: '/validators',
    CONSENSUS_STATE: '/consensus_state',
    NET_INFO: '/net_info',
  },
  
  // REST API endpoints (from Cosmos SDK)
  REST: {
    // Base endpoints
    NODE_INFO: '/cosmos/base/tendermint/v1beta1/node_info',
    BLOCKS_LATEST: '/cosmos/base/tendermint/v1beta1/blocks/latest',
    BLOCKS_BY_HEIGHT: (height: number) => `/cosmos/base/tendermint/v1beta1/blocks/${height}`,
    VALIDATORSETS_LATEST: '/cosmos/base/tendermint/v1beta1/validatorsets/latest',
    VALIDATORSETS_BY_HEIGHT: (height: number) => `/cosmos/base/tendermint/v1beta1/validatorsets/${height}`,
    
    // Bank module
    BANK_BALANCES: (address: string) => `/cosmos/bank/v1beta1/balances/${address}`,
    BANK_SUPPLY: '/cosmos/bank/v1beta1/supply',
    
    // Staking module
    STAKING_VALIDATORS: '/cosmos/staking/v1beta1/validators',
    STAKING_VALIDATOR: (validatorAddr: string) => `/cosmos/staking/v1beta1/validators/${validatorAddr}`,
    STAKING_DELEGATIONS: (address: string) => `/cosmos/staking/v1beta1/delegations/${address}`,
    
    // Governance module
    GOV_PROPOSALS: '/cosmos/gov/v1beta1/proposals',
    GOV_PROPOSAL: (proposalId: string) => `/cosmos/gov/v1beta1/proposals/${proposalId}`,
    GOV_VOTES: (proposalId: string) => `/cosmos/gov/v1beta1/proposals/${proposalId}/votes`,
    
    // Distribution module
    DISTRIBUTION_REWARDS: (address: string) => `/cosmos/distribution/v1beta1/delegators/${address}/rewards`,
    
    // Future SocialBlock custom modules (to be implemented)
    IDENTITY_PROFILE: (sbid: string) => `/socialblock/identity/v1beta1/profile/${sbid}`,
    REPUTATION_SCORE: (address: string) => `/socialblock/reputation/v1beta1/score/${address}`,
    ARP_ATTESTATIONS: (address: string) => `/socialblock/reputation/v1beta1/attestations/${address}`,
  },
  
  // ARP Agent endpoints (from ai/arp-agent FastAPI service)
  ARP: {
    HEALTH: '/health',
    ATTESTATION: '/attestation',
    SCORE: '/score',
    VERIFY: '/verify',
    AGENTS: '/agents',
    AGENT_ACTIVITY: '/agents/activity',
  },
  
  // Event Indexer endpoints (from indexer/event-indexer Node.js service)
  INDEXER: {
    BLOCKS: '/blocks',
    TRANSACTIONS: '/transactions',
    EVENTS: '/events',
    SEARCH: '/search',
    STATS: '/stats',
    ANALYTICS: '/analytics',
  }
};

// WebSocket subscriptions for real-time data
export const WS_SUBSCRIPTIONS = {
  NEW_BLOCK: 'tm.event=\'NewBlock\'',
  NEW_TX: 'tm.event=\'Tx\'',
  VALIDATOR_SET_UPDATES: 'tm.event=\'ValidatorSetUpdates\'',
  ARP_UPDATES: 'arp.event=\'ScoreUpdate\'',
};

// Request headers and authentication
export const getRequestHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Add ARP Agent API key if available
  const arpApiKey = process.env.VITE_ARP_AGENT_API_KEY;
  if (arpApiKey) {
    headers['Authorization'] = `Bearer ${arpApiKey}`;
  }
  
  return headers;
};

// Network configurations matching official repo
export const NETWORK_CONFIGS = {
  'socialblock-devnet-1': {
    chainId: 'socialblock-devnet-1',
    chainName: 'SocialBlock Devnet',
    denom: 'usblk',
    decimals: 6,
    environment: 'development',
  },
  'sblktest-1': {
    chainId: 'sblktest-1',
    chainName: 'SocialBlock Testnet',
    denom: 'usblk',
    decimals: 6,
    environment: 'testnet',
  },
  'sblk-1': {
    chainId: 'sblk-1',
    chainName: 'SocialBlock',
    denom: 'usblk',
    decimals: 6,
    environment: 'mainnet',
  }
};

export default {
  API_CONFIG,
  getCurrentEnvironment,
  getApiConfig,
  ENDPOINTS,
  WS_SUBSCRIPTIONS,
  getRequestHeaders,
  NETWORK_CONFIGS,
};

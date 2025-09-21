/**
 * API Service for SocialBlock Explorer
 * 
 * This service handles all API communications with the SocialBlock L1 backend
 * services as defined in the official repository structure.
 */

import { getApiConfig, ENDPOINTS, getRequestHeaders, WS_SUBSCRIPTIONS } from '../config/api.config';

export class ApiService {
  private config = getApiConfig();
  private headers = getRequestHeaders();

  // Generic request method
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.NODE_REST}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // RPC request method
  private async rpcRequest<T>(method: string, params?: any): Promise<T> {
    const url = this.config.NODE_RPC;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method,
          params: params || {},
        }),
      });
      
      if (!response.ok) {
        throw new Error(`RPC request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`RPC error: ${data.error.message}`);
      }
      
      return data.result;
    } catch (error) {
      console.error('RPC request error:', error);
      throw error;
    }
  }

  // ARP Agent requests
  private async arpRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.ARP_AGENT}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`ARP request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('ARP request error:', error);
      throw error;
    }
  }

  // Indexer requests
  private async indexerRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.INDEXER_API}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`Indexer request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Indexer request error:', error);
      throw error;
    }
  }

  // Node status and info
  async getNodeStatus() {
    return this.rpcRequest('status');
  }

  async getNodeInfo() {
    return this.request(ENDPOINTS.REST.NODE_INFO);
  }

  // Block data
  async getLatestBlock() {
    return this.request(ENDPOINTS.REST.BLOCKS_LATEST);
  }

  async getBlockByHeight(height: number) {
    return this.request(ENDPOINTS.REST.BLOCKS_BY_HEIGHT(height));
  }

  async getBlocks(limit = 20, offset = 0) {
    return this.indexerRequest(`${ENDPOINTS.INDEXER.BLOCKS}?limit=${limit}&offset=${offset}`);
  }

  // Transaction data
  async getTransactions(limit = 20, offset = 0) {
    return this.indexerRequest(`${ENDPOINTS.INDEXER.TRANSACTIONS}?limit=${limit}&offset=${offset}`);
  }

  async searchTransactions(query: string) {
    return this.indexerRequest(`${ENDPOINTS.INDEXER.SEARCH}?q=${encodeURIComponent(query)}`);
  }

  // Validator data
  async getValidators() {
    return this.request(ENDPOINTS.REST.STAKING_VALIDATORS);
  }

  async getValidator(validatorAddr: string) {
    return this.request(ENDPOINTS.REST.STAKING_VALIDATOR(validatorAddr));
  }

  async getLatestValidatorSet() {
    return this.request(ENDPOINTS.REST.VALIDATORSETS_LATEST);
  }

  // Governance data
  async getProposals() {
    return this.request(ENDPOINTS.REST.GOV_PROPOSALS);
  }

  async getProposal(proposalId: string) {
    return this.request(ENDPOINTS.REST.GOV_PROPOSAL(proposalId));
  }

  async getProposalVotes(proposalId: string) {
    return this.request(ENDPOINTS.REST.GOV_VOTES(proposalId));
  }

  // Account data
  async getAccountBalance(address: string) {
    return this.request(ENDPOINTS.REST.BANK_BALANCES(address));
  }

  async getAccountDelegations(address: string) {
    return this.request(ENDPOINTS.REST.STAKING_DELEGATIONS(address));
  }

  async getAccountRewards(address: string) {
    return this.request(ENDPOINTS.REST.DISTRIBUTION_REWARDS(address));
  }

  // ARP (AI Reputation Proof) data
  async getArpHealth() {
    return this.arpRequest(ENDPOINTS.ARP.HEALTH);
  }

  async getReputationScore(address: string) {
    return this.arpRequest(`${ENDPOINTS.ARP.SCORE}/${address}`);
  }

  async getArpAttestations(address: string) {
    return this.arpRequest(`${ENDPOINTS.ARP.ATTESTATION}/${address}`);
  }

  async getAiAgents() {
    return this.arpRequest(ENDPOINTS.ARP.AGENTS);
  }

  async getAiAgentActivity() {
    return this.arpRequest(ENDPOINTS.ARP.AGENT_ACTIVITY);
  }

  // Analytics and statistics
  async getNetworkStats() {
    return this.indexerRequest(ENDPOINTS.INDEXER.STATS);
  }

  async getAnalytics(type: string, period: string) {
    return this.indexerRequest(`${ENDPOINTS.INDEXER.ANALYTICS}?type=${type}&period=${period}`);
  }

  // WebSocket connection for real-time data
  createWebSocketConnection(subscriptions: string[] = [WS_SUBSCRIPTIONS.NEW_BLOCK]) {
    const wsUrl = this.config.NODE_RPC_WS;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      
      // Subscribe to events
      subscriptions.forEach((subscription, index) => {
        ws.send(JSON.stringify({
          jsonrpc: '2.0',
          method: 'subscribe',
          id: index,
          params: {
            query: subscription
          }
        }));
      });
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    return ws;
  }

  // Future SocialBlock custom module endpoints (to be implemented)
  async getIdentityProfile(sbid: string) {
    // This will be available once the x/identity module is implemented
    return this.request(ENDPOINTS.REST.IDENTITY_PROFILE(sbid));
  }

  async getReputationScoreOnChain(address: string) {
    // This will be available once the x/reputation module is implemented
    return this.request(ENDPOINTS.REST.REPUTATION_SCORE(address));
  }

  async getArpAttestationsOnChain(address: string) {
    // This will be available once the x/reputation module is implemented
    return this.request(ENDPOINTS.REST.ARP_ATTESTATIONS(address));
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

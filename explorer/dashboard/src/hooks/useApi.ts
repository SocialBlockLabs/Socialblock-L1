/**
 * React hooks for SocialBlock API integration
 * 
 * Custom hooks that integrate the API service with React components
 * and provide real-time data updates via WebSocket connections.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/api.service';
import { WS_SUBSCRIPTIONS } from '../config/api.config';

// Generic API hook with loading and error states
export function useApiData<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    refetchInterval?: number;
    enabled?: boolean;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refetchInterval, enabled = true } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('API call failed:', err);
    } finally {
      setLoading(false);
    }
  }, [apiCall, enabled]);

  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  useEffect(() => {
    if (refetchInterval && enabled) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refetchInterval, enabled]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for node status with real-time updates
export function useNodeStatus(refetchInterval = 5000) {
  return useApiData(
    () => apiService.getNodeStatus(),
    [],
    { refetchInterval }
  );
}

// Hook for latest blocks with real-time WebSocket updates
export function useLatestBlocks(limit = 20) {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const fetchInitialBlocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getBlocks(limit);
      setBlocks(result.blocks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blocks');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchInitialBlocks();

    // Set up WebSocket for real-time block updates
    const ws = apiService.createWebSocketConnection([WS_SUBSCRIPTIONS.NEW_BLOCK]);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.result && data.result.data && data.result.data.type === 'tendermint/event/NewBlock') {
          // Add new block to the beginning of the list
          setBlocks(prevBlocks => {
            const newBlocks = [data.result.data.value.block, ...prevBlocks];
            return newBlocks.slice(0, limit); // Keep only the latest blocks
          });
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [fetchInitialBlocks, limit]);

  return { blocks, loading, error, refetch: fetchInitialBlocks };
}

// Hook for transactions with pagination
export function useTransactions(limit = 20, offset = 0) {
  return useApiData(
    () => apiService.getTransactions(limit, offset),
    [limit, offset]
  );
}

// Hook for validators data
export function useValidators() {
  return useApiData(
    () => apiService.getValidators(),
    [],
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );
}

// Hook for governance proposals
export function useProposals() {
  return useApiData(
    () => apiService.getProposals(),
    [],
    { refetchInterval: 60000 } // Refetch every minute
  );
}

// Hook for account data
export function useAccount(address: string | null) {
  const [accountData, setAccountData] = useState<{
    balance: any;
    delegations: any;
    rewards: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountData = useCallback(async () => {
    if (!address) return;

    try {
      setLoading(true);
      setError(null);
      
      const [balance, delegations, rewards] = await Promise.all([
        apiService.getAccountBalance(address),
        apiService.getAccountDelegations(address),
        apiService.getAccountRewards(address)
      ]);

      setAccountData({ balance, delegations, rewards });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch account data');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  return { accountData, loading, error, refetch: fetchAccountData };
}

// Hook for ARP (AI Reputation Proof) data
export function useArpData(address: string | null) {
  const [arpData, setArpData] = useState<{
    score: any;
    attestations: any;
    health: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArpData = useCallback(async () => {
    if (!address) {
      // Still fetch health status even without address
      try {
        setLoading(true);
        setError(null);
        const health = await apiService.getArpHealth();
        setArpData({ score: null, attestations: null, health });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ARP health');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [score, attestations, health] = await Promise.all([
        apiService.getReputationScore(address),
        apiService.getArpAttestations(address),
        apiService.getArpHealth()
      ]);

      setArpData({ score, attestations, health });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ARP data');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchArpData();
  }, [fetchArpData]);

  return { arpData, loading, error, refetch: fetchArpData };
}

// Hook for AI agents data
export function useAiAgents() {
  return useApiData(
    () => apiService.getAiAgents(),
    [],
    { refetchInterval: 15000 } // Refetch every 15 seconds
  );
}

// Hook for network statistics
export function useNetworkStats() {
  return useApiData(
    () => apiService.getNetworkStats(),
    [],
    { refetchInterval: 10000 } // Refetch every 10 seconds
  );
}

// Hook for search functionality
export function useSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchResults = await apiService.searchTransactions(query);
      setResults(searchResults.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clearResults };
}

// Hook for real-time WebSocket connection
export function useWebSocket(subscriptions: string[] = [WS_SUBSCRIPTIONS.NEW_BLOCK]) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = apiService.createWebSocketConnection(subscriptions);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onerror = () => {
      setConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages(prev => [...prev.slice(-99), data]); // Keep last 100 messages
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [subscriptions]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, [connected]);

  return { connected, messages, sendMessage };
}

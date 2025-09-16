import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { 
  Bot, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  Filter,
  Download,
  Refresh,
  Eye,
  Brain,
  Zap,
  Target,
  ArrowRight
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  action: string;
  decision: string;
  confidence: number;
  reasoning: string;
  impact: 'low' | 'medium' | 'high';
  status: 'success' | 'warning' | 'error';
  executionTime: number;
  gasUsed?: number;
}

const mockLogs: LogEntry[] = [
  {
    id: 'log_001',
    timestamp: '2024-07-20T10:30:15Z',
    agentId: 'agent_classifier_01',
    agentName: 'Transaction Classifier',
    action: 'classify_transaction',
    decision: 'DeFi Swap',
    confidence: 95.7,
    reasoning: 'Pattern matches UniswapV3 router with high token swap probability',
    impact: 'medium',
    status: 'success',
    executionTime: 45,
    gasUsed: 180000
  },
  {
    id: 'log_002',
    timestamp: '2024-07-20T10:29:42Z',
    agentId: 'agent_reputation_01',
    agentName: 'Reputation Analyzer',
    action: 'update_arp_score',
    decision: 'Increase Score +15',
    confidence: 88.3,
    reasoning: 'Consistent governance participation and positive community endorsements',
    impact: 'low',
    status: 'success',
    executionTime: 32
  },
  {
    id: 'log_003',
    timestamp: '2024-07-20T10:28:17Z',
    agentId: 'agent_anomaly_01',
    agentName: 'Anomaly Detector',
    action: 'detect_unusual_pattern',
    decision: 'Flag for Review',
    confidence: 76.1,
    reasoning: 'Unusual gas price pattern detected, possibly MEV activity',
    impact: 'high',
    status: 'warning',
    executionTime: 78
  },
  {
    id: 'log_004',
    timestamp: '2024-07-20T10:27:55Z',
    agentId: 'agent_governance_01',
    agentName: 'Governance Tracker',
    action: 'analyze_proposal_sentiment',
    decision: 'Positive Trend',
    confidence: 92.4,
    reasoning: 'Community feedback shows 78% positive sentiment with strong validator support',
    impact: 'medium',
    status: 'success',
    executionTime: 156
  },
  {
    id: 'log_005',
    timestamp: '2024-07-20T10:26:33Z',
    agentId: 'agent_security_01',
    agentName: 'Security Monitor',
    action: 'scan_smart_contract',
    decision: 'Security Alert',
    confidence: 91.8,
    reasoning: 'Potential reentrancy vulnerability detected in contract function',
    impact: 'high',
    status: 'error',
    executionTime: 203
  }
];

export function AIWatchLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [filter, setFilter] = useState<'all' | 'success' | 'warning' | 'error'>('all');
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      // Simulate new log entries
      const newLog: LogEntry = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        agentId: `agent_${Math.random().toString(36).substr(2, 9)}`,
        agentName: ['Transaction Classifier', 'Reputation Analyzer', 'Anomaly Detector', 'Governance Tracker'][Math.floor(Math.random() * 4)],
        action: ['classify_transaction', 'update_score', 'detect_pattern', 'analyze_sentiment'][Math.floor(Math.random() * 4)],
        decision: ['Approved', 'Flagged', 'Updated', 'Analyzed'][Math.floor(Math.random() * 4)],
        confidence: Math.random() * 100,
        reasoning: 'Automated AI decision based on current network patterns and historical data',
        impact: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        status: ['success', 'warning', 'error'][Math.floor(Math.random() * 3)] as 'success' | 'warning' | 'error',
        executionTime: Math.floor(Math.random() * 200) + 20
      };

      setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.status === filter);

  const getStatusIcon = (status: LogEntry['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-neon-green" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-chart-4" />;
      case 'error':
        return <AlertTriangle className="w-3 h-3 text-chart-3" />;
    }
  };

  const getImpactColor = (impact: LogEntry['impact']) => {
    switch (impact) {
      case 'low':
        return 'text-muted-foreground bg-muted/10';
      case 'medium':
        return 'text-chart-4 bg-chart-4/10';
      case 'high':
        return 'text-chart-3 bg-chart-3/10';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col bg-card/95 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/30">
              <Bot className="w-4 h-4 text-neon-blue" />
            </div>
            <div>
              <h3 className="text-sm font-medium">AI Watch Logs</h3>
              <p className="text-xs text-muted-foreground">Real-time AI agent activity</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={isLiveMode ? "default" : "outline"}
              size="sm"
              className={`text-xs ${isLiveMode ? 'bg-neon-green/20 text-neon-green border-neon-green/30' : ''}`}
              onClick={() => setIsLiveMode(!isLiveMode)}
            >
              <Activity className="w-3 h-3 mr-1" />
              {isLiveMode ? 'Live' : 'Paused'}
            </Button>

            <Button variant="outline" size="sm" className="text-xs">
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          {(['all', 'success', 'warning', 'error'] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "ghost"}
              size="sm"
              className={`text-xs ${
                filter === filterType 
                  ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/30' 
                  : 'hover:bg-muted/20'
              }`}
              onClick={() => setFilter(filterType)}
            >
              {filterType === 'all' && <Filter className="w-3 h-3 mr-1" />}
              {filterType === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
              {filterType === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {filterType === 'error' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Log List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {filteredLogs.map((log, index) => (
            <Card 
              key={log.id}
              className={`
                group cursor-pointer transition-all duration-200 
                ${selectedLog?.id === log.id ? 'border-neon-blue/50 bg-neon-blue/5' : 'hover:border-border/70'}
                ${index === 0 && isLiveMode ? 'animate-in slide-in-from-top-2' : ''}
              `}
              onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex flex-col items-center space-y-1">
                      {getStatusIcon(log.status)}
                      <div className="w-px h-8 bg-border/30" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium truncate">{log.agentName}</span>
                          <Badge variant="outline" className={`text-xs ${getImpactColor(log.impact)}`}>
                            {log.impact}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatTimestamp(log.timestamp)}</span>
                      </div>

                      <div className="text-xs text-muted-foreground mb-2">
                        <span className="font-mono">{log.action}</span> → 
                        <span className="font-medium ml-1">{log.decision}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs">
                          <div className="flex items-center space-x-1">
                            <Brain className="w-3 h-3 text-neon-blue" />
                            <span>{log.confidence.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span>{log.executionTime}ms</span>
                          </div>
                          {log.gasUsed && (
                            <div className="flex items-center space-x-1">
                              <Zap className="w-3 h-3 text-chart-4" />
                              <span>{log.gasUsed.toLocaleString()}</span>
                            </div>
                          )}
                        </div>

                        <Button variant="ghost" size="sm" className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedLog?.id === log.id && (
                  <div className="mt-3 pt-3 border-t border-border/30 animate-in slide-in-from-top-1">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-medium mb-1">Reasoning</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{log.reasoning}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Agent ID:</span>
                          <div className="font-mono text-neon-blue">{log.agentId}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Confidence:</span>
                          <div className="font-mono">{log.confidence.toFixed(2)}%</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Button variant="outline" size="sm" className="text-xs border-neon-green/30 text-neon-green hover:bg-neon-green/10">
                          <Target className="w-3 h-3 mr-1" />
                          View Agent
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Full Details
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No AI activity logs</p>
            <p className="text-xs text-muted-foreground mt-1">
              {filter !== 'all' ? `No ${filter} events found` : 'Waiting for AI agent activity...'}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
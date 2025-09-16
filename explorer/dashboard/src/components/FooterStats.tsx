import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { 
  Blocks, 
  Clock, 
  Shield, 
  Coins, 
  Users, 
  Activity, 
  Zap, 
  ChevronRight,
  Cpu,
  Network,
  TrendingUp,
  Eye,
  ChevronDown,
  BarChart3,
  Server,
  Info
} from "lucide-react";

// Mock live data that updates periodically
const useLiveData = () => {
  const [data, setData] = useState({
    currentBlock: 18952847,
    averageTime: 12.1,
    activeValidators: 1247,
    delegatedSBLK: 892400,
    totalARPIds: 2847,
    lastUpdate: Date.now(),
    networkHealth: 99.7,
    gasPrice: 15,
    tps: 67
  });

  const [civicLogs, setCivicLogs] = useState([
    "Reputation score updated for @whale92",
    "New validator onboarded: prysm-001",
    "AI agent detected anomalous transaction pattern",
    "DAO proposal #847 voting started",
    "Cross-chain bridge validation completed",
    "Slashing event detected and processed",
    "Token delegation event recorded",
    "Identity verification completed for zkid:crypto_builder"
  ]);

  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        currentBlock: prev.currentBlock + (Math.random() < 0.3 ? 1 : 0),
        averageTime: Math.max(10, Math.min(15, prev.averageTime + (Math.random() - 0.5) * 0.5)),
        activeValidators: prev.activeValidators + (Math.random() < 0.1 ? (Math.random() < 0.5 ? 1 : -1) : 0),
        delegatedSBLK: prev.delegatedSBLK + Math.floor((Math.random() - 0.5) * 1000),
        totalARPIds: prev.totalARPIds + (Math.random() < 0.2 ? 1 : 0),
        lastUpdate: Date.now(),
        networkHealth: Math.max(95, Math.min(100, prev.networkHealth + (Math.random() - 0.5) * 0.2)),
        gasPrice: Math.max(8, Math.min(25, prev.gasPrice + (Math.random() - 0.5) * 2)),
        tps: Math.max(40, Math.min(120, prev.tps + (Math.random() - 0.5) * 10))
      }));
    }, 2000);

    const logInterval = setInterval(() => {
      setCurrentLogIndex(prev => (prev + 1) % civicLogs.length);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, [civicLogs.length]);

  return { ...data, currentLog: civicLogs[currentLogIndex] };
};

// Animated Counter Component
const AnimatedCounter = ({ 
  value, 
  format = "number",
  suffix = "",
  precision = 0 
}: { 
  value: number; 
  format?: "number" | "currency" | "decimal";
  suffix?: string;
  precision?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const diff = value - displayValue;
    if (Math.abs(diff) > 0.01) {
      const increment = diff / 10;
      const timer = setInterval(() => {
        setDisplayValue(prev => {
          const newValue = prev + increment;
          if (Math.abs(value - newValue) < Math.abs(increment)) {
            clearInterval(timer);
            return value;
          }
          return newValue;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [value, displayValue]);

  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
        return val.toFixed(precision);
      case "decimal":
        return val.toFixed(precision);
      default:
        return Math.floor(val).toLocaleString();
    }
  };

  return (
    <span className="tabular-nums">
      {formatValue(displayValue)}{suffix}
    </span>
  );
};

// Pulsing Dot Component
const PulsingDot = ({ color = "neon-green", size = "sm" }: { color?: string, size?: "sm" | "md" }) => (
  <div 
    className={`${size === "sm" ? "w-2 h-2" : "w-3 h-3"} rounded-full bg-${color} animate-pulse`} 
  />
);

// Scrolling Ticker Component
const ScrollingTicker = ({ text }: { text: string }) => (
  <div className="overflow-hidden whitespace-nowrap">
    <div className="animate-pulse text-xs text-muted-foreground">
      {text}
    </div>
  </div>
);

// Status Metric Component
const StatusMetric = ({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  color = "text-foreground",
  animated = false,
  format = "number",
  suffix = "",
  precision = 0,
  compact = false
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  trend?: "up" | "down" | "stable";
  color?: string;
  animated?: boolean;
  format?: "number" | "currency" | "decimal";
  suffix?: string;
  precision?: number;
  compact?: boolean;
}) => {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-neon-green" />;
    if (trend === "down") return <TrendingUp className="w-3 h-3 text-chart-3 rotate-180" />;
    return null;
  };

  return (
    <div className={`flex items-center group hover:bg-muted/20 rounded-lg transition-all duration-300 ${
      compact ? "space-x-1 px-1 py-1" : "space-x-2 px-2 py-1"
    }`}>
      <div className={`rounded ${animated ? 'animate-pulse' : ''} ${compact ? "p-0.5" : "p-1"}`}>
        <Icon className={`${compact ? "w-3 h-3" : "w-4 h-4"} ${color} group-hover:scale-110 transition-transform duration-200`} />
      </div>
      <div className="flex items-center space-x-1 min-w-0">
        <span className={`${compact ? "text-xs" : "text-xs"} text-muted-foreground whitespace-nowrap`}>
          {compact ? label.split(' ')[0] : label}:
        </span>
        <span className={`${compact ? "text-xs" : "text-xs"} font-medium ${color} whitespace-nowrap`}>
          <AnimatedCounter 
            value={value} 
            format={format} 
            suffix={suffix} 
            precision={precision}
          />
        </span>
        {getTrendIcon()}
      </div>
    </div>
  );
};

export function FooterStats() {
  const liveData = useLiveData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const coreMetrics = [
    {
      icon: Blocks,
      label: "Block",
      value: liveData.currentBlock,
      color: "text-neon-blue",
      animated: true,
      showDot: true,
      tooltip: "Current blockchain height - the number of blocks that have been mined and added to the chain."
    },
    {
      icon: Clock,
      label: "Avg Time",
      value: liveData.averageTime,
      format: "decimal" as const,
      suffix: "s",
      precision: 1,
      color: "text-neon-green",
      animated: true,
      tooltip: "Average block time - how long it takes on average to mine a new block. Lower times indicate faster transaction processing."
    },
    {
      icon: Shield,
      label: "Validators",
      value: liveData.activeValidators,
      color: "text-chart-3",
      trend: "up" as const,
      tooltip: "Active validators securing the network through proof-of-stake consensus. More validators increase network decentralization and security."
    },
    {
      icon: Coins,
      label: "Delegated",
      value: liveData.delegatedSBLK,
      format: "currency" as const,
      suffix: " SBLK",
      color: "text-chart-4",
      trend: "up" as const,
      tooltip: "Total SBLK tokens delegated to validators for staking. Higher delegation indicates greater network security and community participation."
    },
    {
      icon: Users,
      label: "SBIDs",
      value: liveData.totalARPIds,
      color: "text-chart-5",
      trend: "up" as const,
      tooltip: "Registered SocialBlock Identity profiles - verified digital identities for reputation and governance participation."
    }
  ];

  return (
    <TooltipProvider>
      <footer className="relative bg-card/90 backdrop-blur-cyber border-t border-border/50">
        {/* Subtle background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-green/5 opacity-50"></div>
        
        <div className="relative px-4 md:px-6 py-2 md:py-3">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="space-y-3">
            {/* Top row - Essential metrics with Tooltips */}
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 cursor-help">
                    <Blocks className="w-4 h-4 text-neon-blue animate-pulse" />
                    <PulsingDot color="neon-blue" size="sm" />
                    <span className="text-xs text-muted-foreground">Block:</span>
                    <span className="text-sm font-medium text-neon-blue">
                      <AnimatedCounter value={liveData.currentBlock} />
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  <p className="text-sm">
                    <span className="font-semibold text-neon-blue">Current Block Height</span><br />
                    The latest block number added to the blockchain. Updates automatically as new blocks are mined.
                  </p>
                </TooltipContent>
              </Tooltip>
              
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs border-neon-green/30 text-neon-green bg-neon-green/5 px-2 py-0.5 cursor-help">
                      <Network className="w-3 h-3 mr-1" />
                      <span>
                        <AnimatedCounter value={liveData.networkHealth} format="decimal" suffix="%" precision={1} />
                      </span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <p className="text-sm">
                      <span className="font-semibold text-neon-green">Network Health Score</span><br />
                      Overall network performance based on uptime, block production, and validator participation. 
                      Values above 95% indicate excellent network health.
                    </p>
                  </TooltipContent>
                </Tooltip>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 h-auto hover:bg-muted/20"
                >
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Civic Agent Log - Mobile with Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 p-2 bg-muted/10 rounded-lg border border-border/30 cursor-help">
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Cpu className="w-3 h-3 text-neon-green animate-pulse" />
                    <PulsingDot size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <ScrollingTicker text={liveData.currentLog} />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm">
                <p className="text-sm">
                  <span className="font-semibold text-neon-green">Civic Agent Activity Feed</span><br />
                  Real-time updates from the AI governance system monitoring network activity, 
                  reputation changes, and community interactions.
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Expanded mobile metrics */}
            {isExpanded && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/30">
                {coreMetrics.slice(1).map((metric, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div>
                        <StatusMetric
                          icon={metric.icon}
                          label={metric.label}
                          value={metric.value}
                          format={metric.format}
                          suffix={metric.suffix}
                          precision={metric.precision}
                          color={metric.color}
                          animated={metric.animated}
                          trend={metric.trend}
                          compact
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm">
                      <p className="text-sm">
                        <span className={`font-semibold ${metric.color.replace('text-', 'text-')}`}>{metric.label}</span><br />
                        {metric.tooltip}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                
                {/* Additional mobile metrics with Tooltips */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <StatusMetric
                        icon={Zap}
                        label="Gas"
                        value={liveData.gasPrice}
                        format="decimal"
                        suffix=" gwei"
                        precision={0}
                        color="text-chart-1"
                        compact
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <p className="text-sm">
                      <span className="font-semibold text-chart-1">Gas Price</span><br />
                      Current network fee for transaction processing in gwei. Higher during congestion, lower when network is less busy.
                    </p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <StatusMetric
                        icon={BarChart3}
                        label="TPS"
                        value={liveData.tps}
                        format="decimal"
                        precision={0}
                        color="text-chart-2"
                        compact
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <p className="text-sm">
                      <span className="font-semibold text-chart-2">Transactions Per Second</span><br />
                      Network throughput - how many transactions are processed every second. Higher TPS means better scalability.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        ) : (
          /* Desktop Layout */
          <>
            <div className="flex items-center justify-between">
              {/* Left Section - Core Metrics */}
              <div className="flex items-center space-x-4 lg:space-x-6">
                {/* Current Block with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-help">
                      <div className="flex items-center space-x-1">
                        <Blocks className="w-4 h-4 text-neon-blue animate-pulse" />
                        <PulsingDot color="neon-blue" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-muted-foreground">Block:</span>
                        <span className="text-sm font-mono font-medium text-neon-blue">
                          <AnimatedCounter value={liveData.currentBlock} />
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <p className="text-sm">
                      <span className="font-semibold text-neon-blue">Latest Block Number</span><br />
                      Current height of the blockchain. Each block contains transactions and is linked to the previous block, 
                      forming an immutable chain of records.
                    </p>
                  </TooltipContent>
                </Tooltip>

                <div className="h-4 w-px bg-border/50"></div>

                {/* Other metrics */}
                {coreMetrics.slice(1).map((metric, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <StatusMetric
                            icon={metric.icon}
                            label={metric.label}
                            value={metric.value}
                            format={metric.format}
                            suffix={metric.suffix}
                            precision={metric.precision}
                            color={metric.color}
                            animated={metric.animated}
                            trend={metric.trend}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-sm">
                        <p className="text-sm">
                          <span className={`font-semibold ${metric.color.replace('text-', 'text-')}`}>{metric.label}</span><br />
                          {metric.tooltip}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    {index < coreMetrics.length - 2 && <div className="h-4 w-px bg-border/50"></div>}
                  </div>
                ))}
              </div>

              {/* Center Section - Civic Agent Log with Tooltip */}
              <div className="flex-1 mx-4 lg:mx-8 max-w-md">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 p-2 bg-muted/10 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors cursor-help">
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Cpu className="w-4 h-4 text-neon-green animate-pulse" />
                        <span className="text-xs text-muted-foreground">Civic Agent:</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <ScrollingTicker text={liveData.currentLog} />
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <PulsingDot />
                        <span className="text-xs text-muted-foreground">Live</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <p className="text-sm">
                      <span className="font-semibold text-neon-green">AI Governance Monitor</span><br />
                      Autonomous system tracking network events, reputation updates, validator changes, 
                      and community governance activities in real-time.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Right Section - System Status & Controls */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                {/* Network Health with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-help">
                      <Activity className="w-4 h-4 text-neon-green animate-pulse" />
                      <span className="text-xs text-muted-foreground">Health:</span>
                      <span className="text-sm font-mono font-medium text-neon-green">
                        <AnimatedCounter value={liveData.networkHealth} format="decimal" suffix="%" precision={1} />
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <p className="text-sm">
                      <span className="font-semibold text-neon-green">Network Health Status</span><br />
                      Composite score measuring network stability, validator uptime, transaction throughput, 
                      and overall blockchain performance metrics.
                    </p>
                  </TooltipContent>
                </Tooltip>

                <div className="h-4 w-px bg-border/50"></div>

                {/* System Status Badge with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs border-neon-green/30 text-neon-green bg-neon-green/5 hover:bg-neon-green/10 transition-colors cursor-pointer">
                      <Network className="w-3 h-3 mr-1 animate-pulse" />
                      Online
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <p className="text-sm">
                      <span className="font-semibold text-neon-green">System Status</span><br />
                      Real-time network connectivity status. "Online" indicates all core systems 
                      are operational and synchronized with the blockchain network.
                    </p>
                  </TooltipContent>
                </Tooltip>

                {/* Expand Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <ChevronRight className={`w-3 h-3 ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Expanded Desktop Section */}
            {isExpanded && (
              <div className="mt-4 pt-3 border-t border-border/30">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {/* Additional Desktop Metrics with Tooltips */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <StatusMetric
                          icon={Zap}
                          label="Gas Price"
                          value={liveData.gasPrice}
                          format="decimal"
                          suffix=" gwei"
                          precision={0}
                          color="text-chart-1"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm">
                      <p className="text-sm">
                        <span className="font-semibold text-chart-1">Current Gas Price</span><br />
                        The price users pay for transaction processing, measured in gwei (1 gwei = 0.000000001 ETH). 
                        Higher prices during network congestion ensure faster transaction confirmation.
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <StatusMetric
                          icon={TrendingUp}
                          label="TPS"
                          value={liveData.tps}
                          format="decimal"
                          precision={0}
                          color="text-chart-2"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm">
                      <p className="text-sm">
                        <span className="font-semibold text-chart-2">Transactions Per Second</span><br />
                        Network throughput showing how many transactions are processed every second. 
                        Higher TPS indicates better network scalability and performance.
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 hover:bg-muted/20 px-2 py-1 rounded-lg transition-colors cursor-help">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-muted-foreground">Updated:</span>
                          <span className="text-xs font-mono text-foreground">
                            {new Date(liveData.lastUpdate).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit', 
                              second: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm">
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">Last Data Update</span><br />
                        Timestamp when network statistics were last refreshed. 
                        Data automatically updates every 2 seconds to ensure real-time accuracy.
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 hover:bg-muted/20 px-2 py-1 rounded-lg transition-colors cursor-help">
                        <Server className="w-4 h-4 text-neon-blue animate-pulse" />
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-muted-foreground">Nodes:</span>
                          <span className="text-xs font-mono text-neon-blue">8,247</span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm">
                      <p className="text-sm">
                        <span className="font-semibold text-neon-blue">Active Network Nodes</span><br />
                        Total number of nodes participating in the network consensus. 
                        More nodes increase decentralization and network security.
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 hover:bg-muted/20 px-2 py-1 rounded-lg transition-colors cursor-help">
                        <Network className="w-4 h-4 text-chart-5" />
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-muted-foreground">Peers:</span>
                          <span className="text-xs font-mono text-chart-5">156</span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm">
                      <p className="text-sm">
                        <span className="font-semibold text-chart-5">Connected Peers</span><br />
                        Number of directly connected peer nodes for data synchronization and communication. 
                        Healthy peer connections ensure robust network connectivity.
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 hover:bg-muted/20 px-2 py-1 rounded-lg transition-colors cursor-help">
                        <Shield className="w-4 h-4 text-neon-green animate-pulse" />
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-muted-foreground">Uptime:</span>
                          <span className="text-xs font-mono text-neon-green">99.9%</span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm">
                      <p className="text-sm">
                        <span className="font-semibold text-neon-green">Network Uptime</span><br />
                        Percentage of time the network has been operational and producing blocks. 
                        High uptime indicates excellent network reliability and stability.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Animated Border Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-60 animate-pulse"></div>
      
        {/* Corner accent effects */}
        <div className="absolute bottom-0 left-0 w-20 h-px bg-gradient-to-r from-neon-green/50 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-20 h-px bg-gradient-to-l from-neon-magenta/50 to-transparent"></div>
      </footer>
    </TooltipProvider>
  );
}
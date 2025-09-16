import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DashboardWidget } from "../DashboardWidget";
import { 
  GitBranch, 
  ArrowRight, 
  Zap, 
  Clock, 
  Hash, 
  Eye, 
  ExternalLink, 
  Filter,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp
} from "lucide-react";

// Mock data for internal transactions
const mockInternalTransactions = [
  {
    id: "sblka1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    parentTxHash: "sblk1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    blockNumber: 18234567,
    timestamp: "2h ago",
    from: "sblkd8da6bf26964af9d7eed9e03e53415d37aa96045",
    to: "sblka0b86991c431e69f7d3c6e8e5c2a2a8f5e9b4e8b3",
    value: "15.482",
    gasUsed: 45623,
    gasLimit: 50000,
    success: true,
    type: "CALL",
    depth: 1,
    contractName: "SocialSwap V3 Router",
    methodName: "exactInputSingle",
    errorReason: null
  },
  {
    id: "sblkb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a",
    parentTxHash: "sblk2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef",
    blockNumber: 18234566,
    timestamp: "3h ago",
    from: "sblka0b86991c431e69f7d3c6e8e5c2a2a8f5e9b4e8b3",
    to: "sblk6b175474e89094c44da98b954eedeac495271d0f",
    value: "1,250.00",
    gasUsed: 28943,
    gasLimit: 35000,
    success: true,
    type: "DELEGATECALL",
    depth: 2,
    contractName: "USDC Token",
    methodName: "transfer",
    errorReason: null
  },
  {
    id: "sblkc3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2",
    parentTxHash: "sblk3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef",
    blockNumber: 18234565,
    timestamp: "4h ago",
    from: "sblk1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    to: "sblkc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    value: "0.0",
    gasUsed: 0,
    gasLimit: 21000,
    success: false,
    type: "STATICCALL",
    depth: 1,
    contractName: "WSBLK",
    methodName: "balanceOf",
    errorReason: "execution reverted"
  },
  {
    id: "sblkd4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2c3",
    parentTxHash: "sblk456789012abcdef456789012abcdef456789012abcdef456789012abcdef4567",
    blockNumber: 18234564,
    timestamp: "5h ago",
    from: "sblk7a250d5630b4cf539739df2c5dacb4c659f2488d",
    to: "sblka0b86991c431e69f7d3c6e8e5c2a2a8f5e9b4e8b3",
    value: "892.456",
    gasUsed: 67234,
    gasLimit: 70000,
    success: true,
    type: "CALL",
    depth: 3,
    contractName: "SocialSwap V2 Router",
    methodName: "swapExactTokensForTokens",
    errorReason: null
  },
  {
    id: "sblke5f6789012345678901234567890abcdef1234567890abcdef1234567ab2c3d4",
    parentTxHash: "sblk56789012abcdef56789012abcdef56789012abcdef56789012abcdef56789012",
    blockNumber: 18234563,
    timestamp: "6h ago",
    from: "sblkc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    to: "sblk0000000000000000000000000000000000000000",
    value: "25.789",
    gasUsed: 21000,
    gasLimit: 21000,
    success: true,
    type: "CREATE",
    depth: 1,
    contractName: "Factory Contract",
    methodName: "createPair",
    errorReason: null
  }
];

const InternalTransactionRow = ({ transaction }: { transaction: typeof mockInternalTransactions[0] }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "CALL": return "text-neon-blue bg-neon-blue/10 border-neon-blue/30";
      case "DELEGATECALL": return "text-neon-green bg-neon-green/10 border-neon-green/30";
      case "STATICCALL": return "text-chart-4 bg-chart-4/10 border-chart-4/30";
      case "CREATE": return "text-neon-magenta bg-neon-magenta/10 border-neon-magenta/30";
      default: return "text-muted-foreground bg-muted/10 border-border/30";
    }
  };

  const getStatusIcon = () => {
    if (transaction.success) {
      return <CheckCircle className="w-4 h-4 text-neon-green" />;
    } else {
      return <AlertTriangle className="w-4 h-4 text-chart-3" />;
    }
  };

  return (
    <Card className="group hover:border-neon-blue/30 transition-all duration-300 bg-card/60 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-x-4">
          {/* Transaction Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            {/* Status and Type */}
            <div className="flex flex-col items-center space-y-2">
              {getStatusIcon()}
              <Badge variant="outline" className={`text-xs ${getTypeColor(transaction.type)}`}>
                {transaction.type}
              </Badge>
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1 text-sm">
                  <span className="text-muted-foreground">Depth:</span>
                  <Badge variant="outline" className="text-xs">
                    {transaction.depth}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {transaction.timestamp}
                </div>
              </div>

              {/* Contract and Method */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">
                  {transaction.contractName}
                </div>
                <div className="text-xs text-neon-blue font-mono">
                  {transaction.methodName}()
                </div>
              </div>

              {/* From/To Flow */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="text-xs font-mono text-muted-foreground truncate">
                  {transaction.from.slice(0, 10)}...{transaction.from.slice(-6)}
                </div>
                <ArrowRight className="w-3 h-3 text-neon-blue flex-shrink-0" />
                <div className="text-xs font-mono text-muted-foreground truncate">
                  {transaction.to === "sblk0000000000000000000000000000000000000000" 
                    ? "Contract Creation"
                    : `${transaction.to.slice(0, 10)}...${transaction.to.slice(-6)}`
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Value and Gas */}
          <div className="text-right space-y-1 flex-shrink-0">
            <div className="text-sm font-medium text-foreground">
              {transaction.value} SBLK
            </div>
            <div className="text-xs text-muted-foreground">
              Gas: {transaction.gasUsed.toLocaleString()}/{transaction.gasLimit.toLocaleString()}
            </div>
            <div className="flex items-center justify-end space-x-1">
              <div className="w-16 h-1 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    transaction.gasUsed / transaction.gasLimit > 0.8 
                      ? 'bg-chart-3' 
                      : transaction.gasUsed / transaction.gasLimit > 0.6 
                        ? 'bg-chart-4' 
                        : 'bg-neon-green'
                  }`}
                  style={{ width: `${(transaction.gasUsed / transaction.gasLimit) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {!transaction.success && transaction.errorReason && (
          <div className="mt-3 p-2 bg-chart-3/10 border border-chart-3/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-chart-3 flex-shrink-0" />
              <span className="text-xs text-chart-3 font-mono">{transaction.errorReason}</span>
            </div>
          </div>
        )}

        {/* Parent Transaction Link */}
        <div className="mt-3 pt-3 border-t border-border/20">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-foreground">Parent TX:</span>
            <button className="text-neon-blue hover:text-neon-green transition-colors font-mono">
              {transaction.parentTxHash.slice(0, 14)}...{transaction.parentTxHash.slice(-8)}
            </button>
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function InternalTransactionsTab() {
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const filteredTransactions = mockInternalTransactions.filter(tx => {
    if (filterType === "all") return true;
    if (filterType === "failed") return !tx.success;
    if (filterType === "success") return tx.success;
    return tx.type.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardWidget
          title="Total Internal TXs"
          value="847,392"
          change={{ value: "+2.3%", type: "increase" }}
          icon={<GitBranch className="w-5 h-5 text-neon-blue" />}
        />
        
        <DashboardWidget
          title="Success Rate"
          value="94.7%"
          change={{ value: "+0.8%", type: "increase" }}
          icon={<CheckCircle className="w-5 h-5 text-neon-green" />}
        />
        
        <DashboardWidget
          title="Avg Gas Used"
          value="42.1K"
          change={{ value: "-1.2%", type: "decrease" }}
          icon={<Zap className="w-5 h-5 text-chart-4" />}
        />
        
        <DashboardWidget
          title="Contract Calls"
          value="1.2M"
          change={{ value: "+5.6%", type: "increase" }}
          icon={<Activity className="w-5 h-5 text-neon-blue" />}
        />
      </div>

      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-medium">Internal Transactions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor contract-to-contract interactions and internal calls
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Type Filter */}
          <div className="relative">
            <Button variant="outline" className="border-border/50 hover:border-neon-blue/30">
              <Filter className="w-4 h-4 mr-2" />
              {filterType === "all" ? "All Types" : filterType.toUpperCase()}
              <ChevronDown className="w-3 h-3 ml-2" />
            </Button>
          </div>
          
          {/* Sort */}
          <div className="relative">
            <Button variant="outline" className="border-border/50 hover:border-neon-blue/30">
              <TrendingUp className="w-4 h-4 mr-2" />
              {sortBy === "newest" ? "Newest" : "Oldest"}
              <ChevronDown className="w-3 h-3 ml-2" />
            </Button>
          </div>

          <Badge variant="outline" className="text-xs border-neon-green/30 text-neon-green">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse mr-1"></div>
            Live
          </Badge>
        </div>
      </div>

      {/* Transaction Type Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["CALL", "DELEGATECALL", "STATICCALL", "CREATE"].map(type => {
          const count = mockInternalTransactions.filter(tx => tx.type === type).length;
          const successRate = mockInternalTransactions
            .filter(tx => tx.type === type && tx.success).length / 
            mockInternalTransactions.filter(tx => tx.type === type).length * 100;
          
          return (
            <Card key={type} className="bg-card/60 backdrop-blur-sm border-border/50 hover:border-neon-blue/30 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-medium text-foreground">{count}</div>
                <div className="text-xs text-muted-foreground mb-2">{type}</div>
                <div className="text-xs text-neon-green">{successRate.toFixed(1)}% success</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center space-x-2">
            <Hash className="w-5 h-5 text-neon-blue" />
            <span>Recent Internal Transactions</span>
          </h3>
          <div className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {mockInternalTransactions.length} transactions
          </div>
        </div>

        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <InternalTransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center pt-6">
          <Button 
            variant="outline" 
            className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
          >
            <GitBranch className="w-4 h-4 mr-2" />
            Load More Internal Transactions
          </Button>
        </div>
      </div>
    </div>
  );
}
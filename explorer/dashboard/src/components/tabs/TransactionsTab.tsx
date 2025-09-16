import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ARPBadge, generateMockARPProfile, type RepType } from "../ARPBadge";
import { ProfileDrawer } from "../ProfileDrawer";
import { DashboardWidget } from "../DashboardWidget";
import { FollowButton } from "../FollowButton";
import { useFollowButton } from "../SubscriptionManager";
import { PaginationAdvanced } from "../ui/pagination-advanced";
import { usePaginatedData } from "../hooks/usePaginatedData";
import { useIsMobile } from "../ui/use-mobile";
import { 
  ArrowRightLeft, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Clock,
  Send,
  Vote,
  Users,
  Bot,
  CheckCircle,
  XCircle,
  Loader,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Transaction types with icons and colors
const transactionTypes = {
  transfer: { 
    icon: Send, 
    color: "text-neon-blue", 
    bg: "bg-neon-blue/10", 
    label: "Transfer" 
  },
  proposal: { 
    icon: Vote, 
    color: "text-chart-4", 
    bg: "bg-chart-4/10", 
    label: "Proposal" 
  },
  delegation: { 
    icon: Users, 
    color: "text-chart-3", 
    bg: "bg-chart-3/10", 
    label: "Delegation" 
  },
  ai_agent: { 
    icon: Bot, 
    color: "text-neon-green", 
    bg: "bg-neon-green/10", 
    label: "AI Agent" 
  }
};

const transactionStatuses = {
  pending: { 
    icon: Loader, 
    color: "text-chart-4", 
    bg: "bg-chart-4/10", 
    animation: "animate-spin" 
  },
  success: { 
    icon: CheckCircle, 
    color: "text-neon-green", 
    bg: "bg-neon-green/10", 
    animation: "" 
  },
  failed: { 
    icon: XCircle, 
    color: "text-destructive", 
    bg: "bg-destructive/10", 
    animation: "" 
  }
};

// Enhanced transaction data generator
const generateTransactions = (count: number) => {
  const types = ['transfer', 'ai_agent', 'proposal', 'delegation'];
  const statuses = ['success', 'pending', 'failed'];
  const transactions = [];

  const walletAddresses = [
    { address: "sblkd8da6bf26964af9d7eed9e03e53415d37aa96045", ens: "vitalik.eth", nickname: "SocialBlock Founder" },
    { address: "sblk47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503", ens: "uniswap.eth", nickname: "DEX Protocol" },
    { address: "sblk742d35cc6430c0532b0c4c2c5c3b1c5d8d2e1f8c", ens: null, nickname: "AI Trading Bot #47" },
    { address: "sblk88e6a0c2ddd26feeb64f039a2c41296fcb3f5640", ens: "pool.uniswap.eth", nickname: "USDC/SBLK Pool" },
    { address: "sblk5e349b609b6c6bb2b0f73b5e0b2beb6d7c8a9b4e", ens: "governance.ens", nickname: "DAO Multisig" },
    { address: "sblk8ba1f109551bd432803012645hac136c7cc2e12c", ens: "whale92.eth", nickname: "Crypto Whale #92" },
    { address: "sblk3cd751e6b0078be393132286c442345e5dc49699", ens: null, nickname: "Exchange Hot Wallet" },
    { address: "sblk28c6c06298d514db089934071355e5743bf21d60", ens: "binance14.eth", nickname: "Binance 14" }
  ];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = i < 5 ? (Math.random() > 0.8 ? 'pending' : 'success') : statuses[Math.floor(Math.random() * statuses.length)];
    const fromWallet = walletAddresses[Math.floor(Math.random() * walletAddresses.length)];
    const toWallet = walletAddresses[Math.floor(Math.random() * walletAddresses.length)];
    const secondsAgo = Math.floor(Math.random() * 3600) + (i * 2);
    const date = new Date(Date.now() - secondsAgo * 1000);
    const value = Math.random() * 100;
    const valueUsd = value * 2500; // Mock SBLK price

    transactions.push({
      hash: `sblk${Math.random().toString(16).slice(2, 66)}`,
      type,
      from: fromWallet,
      to: toWallet,
      value: `${value.toFixed(3)} SBLK`,
      valueUsd: `${valueUsd.toLocaleString()}`,
      gasUsed: Math.floor(Math.random() * 200000) + 21000,
      gasLimit: Math.floor(Math.random() * 50000) + 250000,
      gasPrice: `${Math.floor(Math.random() * 20) + 10} gwei`,
      status,
      timestamp: secondsAgo < 60 ? `${secondsAgo}s ago` : 
                 secondsAgo < 3600 ? `${Math.floor(secondsAgo / 60)}m ago` : 
                 `${Math.floor(secondsAgo / 3600)}h ago`,
      timestampFull: date.toLocaleString(),
      block: status === 'pending' ? null : `${18952847 - i}`,
      nonce: Math.floor(Math.random() * 10000),
      isLive: i < 3 && Math.random() > 0.5
    });
  }

  return transactions;
};

const TOTAL_TRANSACTIONS = 3;
const allTransactions = generateTransactions(TOTAL_TRANSACTIONS);

// Define mockTransactions type for TypeScript
type MockTransaction = ReturnType<typeof generateTransactions>[0];

const TransactionRow = ({ transaction, index }: { 
  transaction: MockTransaction; 
  index: number; 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const txType = transactionTypes[transaction.type as keyof typeof transactionTypes];
  const status = transactionStatuses[transaction.status as keyof typeof transactionStatuses];
  
  // Follow hooks for from and to addresses
  const fromFollowProps = useFollowButton(
    transaction.from.address, 
    'wallet', 
    transaction.from.ens || transaction.from.nickname || formatAddress(transaction.from)
  );
  const toFollowProps = useFollowButton(
    transaction.to.address, 
    'wallet', 
    transaction.to.ens || transaction.to.nickname || formatAddress(transaction.to)
  );

  const formatAddress = (addressData: typeof transaction.from) => {
    if (addressData.ens) {
      return addressData.ens;
    }
    if (addressData.nickname) {
      return addressData.nickname;
    }
    return `${addressData.address.slice(0, 8)}...${addressData.address.slice(-4)}`;
  };

  const getGasUsagePercentage = () => {
    return (transaction.gasUsed / transaction.gasLimit) * 100;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="group relative">
      {/* Live transaction pulse animation */}
      {transaction.isLive && (
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue/20 via-neon-green/20 to-neon-blue/20 rounded-lg opacity-75 group-hover:opacity-100 blur-sm animate-pulse"></div>
      )}
      
      {/* Main transaction row */}
      <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-3 md:p-6 hover:border-neon-blue/30 transition-all duration-300 cursor-pointer touch-optimized"
           onClick={() => setIsExpanded(!isExpanded)}>
        
        {/* Mobile-first responsive layout */}
        <div className="space-y-3 md:space-y-0">
          
          {/* Top row - Icon, Hash, Status, and Expand */}
          <div className="flex items-center justify-between">
            {/* Left: Icon and Hash */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`p-2 md:p-3 rounded-lg ${txType.bg} flex-shrink-0`}>
                <txType.icon className={`w-4 h-4 md:w-5 md:h-5 ${txType.color}`} />
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-neon-blue text-xs md:text-sm font-medium truncate">
                    <span className="md:hidden">{transaction.hash.slice(0, 8)}...{transaction.hash.slice(-4)}</span>
                    <span className="hidden md:inline">{transaction.hash.slice(0, 12)}...{transaction.hash.slice(-8)}</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-muted/50 touch-optimized"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(transaction.hash);
                    }}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  {transaction.isLive && (
                    <div className="flex items-center space-x-1.5">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-neon-green rounded-full animate-pulse"></div>
                      <span className="text-xs text-neon-green font-medium hidden md:inline">LIVE</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {txType.label}
                </div>
              </div>
            </div>

            {/* Right: Status and Expand */}
            <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
              {/* Status badge */}
              <div className="flex items-center space-x-1.5 md:space-x-2">
                <div className={`p-1.5 md:p-2 rounded ${status.bg}`}>
                  <status.icon className={`w-3 h-3 ${status.color} ${status.animation}`} />
                </div>
                <span className={`text-xs font-medium ${status.color} hidden md:inline`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
              
              {/* Expand icon */}
              <div className="p-1 touch-optimized">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Second row - From/To addresses (Mobile) */}
          <div className="md:hidden">
            <div className="flex items-center justify-between text-xs space-x-2">
              <div className="flex items-center space-x-1 min-w-0 flex-1">
                <FollowButton
                  id={transaction.from.address}
                  type="wallet"
                  name={transaction.from.ens || transaction.from.nickname}
                  isFollowing={fromFollowProps.isFollowing}
                  onFollowChange={fromFollowProps.onFollowChange}
                  onOpenSubscriptions={fromFollowProps.onOpenSubscriptions}
                  size="sm"
                />
                <ProfileDrawer
                  profile={generateMockARPProfile(transaction.from.address, {
                    ens: transaction.from.ens || undefined,
                    primaryType: (transaction.type === 'ai_agent' ? 'builder' : 
                                 transaction.type === 'proposal' ? 'civic' : 
                                 Math.random() > 0.5 ? 'social' : 'voter') as RepType
                  })}
                  trigger={
                    <span className="text-muted-foreground truncate max-w-20 cursor-pointer hover:text-neon-blue transition-colors">
                      {formatAddress(transaction.from)}
                    </span>
                  }
                />
              </div>
              
              <ArrowRightLeft className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              
              <div className="flex items-center space-x-1 min-w-0 flex-1 justify-end">
                <ProfileDrawer
                  profile={generateMockARPProfile(transaction.to.address, {
                    ens: transaction.to.ens || undefined,
                    primaryType: (transaction.to.nickname?.includes('Pool') ? 'builder' : 
                                 transaction.to.nickname?.includes('DAO') ? 'civic' : 
                                 'social') as RepType
                  })}
                  trigger={
                    <span className="text-muted-foreground truncate max-w-20 cursor-pointer hover:text-neon-blue transition-colors">
                      {formatAddress(transaction.to)}
                    </span>
                  }
                />
                <FollowButton
                  id={transaction.to.address}
                  type="wallet"
                  name={transaction.to.ens || transaction.to.nickname}
                  isFollowing={toFollowProps.isFollowing}
                  onFollowChange={toFollowProps.onFollowChange}
                  onOpenSubscriptions={toFollowProps.onOpenSubscriptions}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Third row - Value and Gas (Mobile) */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              {/* Value */}
              <div>
                <div className="font-mono text-neon-green font-medium text-sm">
                  {transaction.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {transaction.valueUsd}
                </div>
              </div>
              
              {/* Gas usage - compact mobile version */}
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-muted-foreground">Gas</span>
                  <span className="font-mono text-neon-blue text-xs">{getGasUsagePercentage().toFixed(0)}%</span>
                </div>
                <div className="w-16 bg-muted/30 rounded-full h-1.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      getGasUsagePercentage() > 90 ? 'bg-destructive' :
                      getGasUsagePercentage() > 70 ? 'bg-chart-4' : 'bg-neon-green'
                    }`}
                    style={{ width: `${Math.min(getGasUsagePercentage(), 100)}%` }}
                  />
                </div>
              </div>
              
              {/* Timestamp (Mobile) */}
              <div className="text-right">
                <div className="text-xs text-muted-foreground">
                  {transaction.timestamp}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop layout - hidden on mobile */}
          <div className="hidden md:flex md:items-center md:justify-between md:mt-3">
            {/* Desktop From/To addresses */}
            <div className="flex items-center space-x-3 text-sm flex-1">
              <div className="flex items-center space-x-1">
                <FollowButton
                  id={transaction.from.address}
                  type="wallet"
                  name={transaction.from.ens || transaction.from.nickname}
                  isFollowing={fromFollowProps.isFollowing}
                  onFollowChange={fromFollowProps.onFollowChange}
                  onOpenSubscriptions={fromFollowProps.onOpenSubscriptions}
                  size="sm"
                />
                <ProfileDrawer
                  profile={generateMockARPProfile(transaction.from.address, {
                    ens: transaction.from.ens || undefined,
                    primaryType: (transaction.type === 'ai_agent' ? 'builder' : 
                                 transaction.type === 'proposal' ? 'civic' : 
                                 Math.random() > 0.5 ? 'social' : 'voter') as RepType
                  })}
                  trigger={
                    <span className="text-muted-foreground truncate max-w-24 cursor-pointer hover:text-neon-blue transition-colors">
                      {formatAddress(transaction.from)}
                    </span>
                  }
                />
              </div>
              
              <ArrowRightLeft className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              
              <div className="flex items-center space-x-1">
                <FollowButton
                  id={transaction.to.address}
                  type="wallet"
                  name={transaction.to.ens || transaction.to.nickname}
                  isFollowing={toFollowProps.isFollowing}
                  onFollowChange={toFollowProps.onFollowChange}
                  onOpenSubscriptions={toFollowProps.onOpenSubscriptions}
                  size="sm"
                />
                <ProfileDrawer
                  profile={generateMockARPProfile(transaction.to.address, {
                    ens: transaction.to.ens || undefined,
                    primaryType: (transaction.to.nickname?.includes('Pool') ? 'builder' : 
                                 transaction.to.nickname?.includes('DAO') ? 'civic' : 
                                 'social') as RepType
                  })}
                  trigger={
                    <span className="text-muted-foreground truncate max-w-24 cursor-pointer hover:text-neon-blue transition-colors">
                      {formatAddress(transaction.to)}
                    </span>
                  }
                />
              </div>
            </div>

            {/* Desktop Value and Gas */}
            <div className="flex items-center space-x-6 text-sm">
              {/* Value */}
              <div className="text-center min-w-[90px] px-2">
                <div className="font-mono text-neon-green font-medium mb-1">
                  {transaction.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {transaction.valueUsd}
                </div>
              </div>
              
              {/* Gas usage meter */}
              <div className="w-32 px-2">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground font-medium">Gas</span>
                  <span className="font-mono text-neon-blue">{getGasUsagePercentage().toFixed(0)}%</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      getGasUsagePercentage() > 90 ? 'bg-destructive' :
                      getGasUsagePercentage() > 70 ? 'bg-chart-4' : 'bg-neon-green'
                    }`}
                    style={{ width: `${Math.min(getGasUsagePercentage(), 100)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {transaction.gasUsed.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Desktop Timestamp */}
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">
                {transaction.timestamp}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded details - Mobile optimized */}
        {isExpanded && (
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border/30 space-y-4 md:space-y-6">
            
            {/* Technical details grid - responsive */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 text-sm">
              <div className="space-y-1 md:space-y-2">
                <div className="text-xs text-muted-foreground font-medium">Block</div>
                <div className="font-mono text-neon-blue text-xs md:text-sm">
                  {transaction.block || 'Pending...'}
                </div>
              </div>
              <div className="space-y-1 md:space-y-2">
                <div className="text-xs text-muted-foreground font-medium">Nonce</div>
                <div className="font-mono text-xs md:text-sm">{transaction.nonce}</div>
              </div>
              <div className="space-y-1 md:space-y-2">
                <div className="text-xs text-muted-foreground font-medium">Gas Price</div>
                <div className="font-mono text-xs md:text-sm">{transaction.gasPrice}</div>
              </div>
              <div className="space-y-1 md:space-y-2">
                <div className="text-xs text-muted-foreground font-medium">Full Time</div>
                <div className="text-xs">{transaction.timestampFull}</div>
              </div>
            </div>
            
            {/* Full addresses - Mobile optimized */}
            <div className="space-y-3 md:space-y-4">
              
              {/* From address */}
              <div className="space-y-2 md:space-y-3">
                <div className="text-xs text-muted-foreground font-medium">From Address</div>
                <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-muted/20 rounded-lg">
                  <span className="font-mono text-xs break-all flex-1 leading-relaxed">
                    {transaction.from.address}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-muted/50 touch-optimized flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(transaction.from.address);
                    }}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                {transaction.from.nickname && (
                  <div className="text-xs text-muted-foreground ml-2 md:ml-3">
                    📝 {transaction.from.nickname}
                  </div>
                )}
              </div>
              
              {/* To address */}
              <div className="space-y-2 md:space-y-3">
                <div className="text-xs text-muted-foreground font-medium">To Address</div>
                <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-muted/20 rounded-lg">
                  <span className="font-mono text-xs break-all flex-1 leading-relaxed">
                    {transaction.to.address}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-muted/50 touch-optimized flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(transaction.to.address);
                    }}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                {transaction.to.nickname && (
                  <div className="text-xs text-muted-foreground ml-2 md:ml-3">
                    📝 {transaction.to.nickname}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons - Mobile optimized */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-3 pt-2 md:pt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full md:w-auto text-xs border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 px-4 py-3 md:py-2 touch-optimized"
                onClick={(e) => {
                  e.stopPropagation();
                  // SocialBlock Explorer - no external links needed
                }}
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                View Details
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full md:w-auto text-xs border-neon-green/30 text-neon-green hover:bg-neon-green/10 px-4 py-3 md:py-2 touch-optimized"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Explain transaction ${transaction.hash} with AI`);
                }}
              >
                <Bot className="w-3 h-3 mr-2" />
                Explain with AI
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export function TransactionsTab() {
  const isMobile = useIsMobile();
  const [pagination, paginationActions] = usePaginatedData({
    totalItems: TOTAL_TRANSACTIONS,
    initialItemsPerPage: 15
  });

  // Get current page data
  const currentTransactions = allTransactions.slice(pagination.startIndex, pagination.endIndex);
  
  // Calculate max pages to show (100 pages max)
  const maxPages = Math.min(pagination.totalPages, 100);
  const isAtMaxPages = pagination.currentPage >= maxPages;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardWidget
          title="24h Transactions"
          value="2.4M"
          change={{ value: "+5.7%", type: "increase" }}
          icon={<ArrowRightLeft className="w-5 h-5 text-neon-blue" />}
        />
        
        <DashboardWidget
          title="Success Rate"
          value="98.7%"
          change={{ value: "+0.2%", type: "increase" }}
          icon={<TrendingUp className="w-5 h-5 text-neon-green" />}
        />
        
        <DashboardWidget
          title="Avg Gas Fee"
          value="12 gwei"
          change={{ value: "-8.1%", type: "decrease" }}
          icon={<Zap className="w-5 h-5 text-neon-blue" />}
        />
        
        <DashboardWidget
          title="Total Volume"
          value="$847M"
          change={{ value: "+12.3%", type: "increase" }}
          icon={<DollarSign className="w-5 h-5 text-neon-green" />}
        />
      </div>

      {/* Transaction Feed */}
      <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ArrowRightLeft className="w-5 h-5 text-neon-blue" />
              <span>Live Transaction Feed</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs border-neon-green/30 text-neon-green">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse mr-1"></div>
                Live
              </Badge>
              <Badge variant="outline" className="text-xs">
                {TOTAL_TRANSACTIONS.toLocaleString()} total
              </Badge>
            </div>
          </div>
          
          {/* Transaction type legend */}
          <div className="flex items-center space-x-6 pt-4 text-xs">
            {Object.entries(transactionTypes).map(([key, type]) => (
              <div key={key} className="flex items-center space-x-2">
                <div className={`p-1 rounded ${type.bg}`}>
                  <type.icon className={`w-3 h-3 ${type.color}`} />
                </div>
                <span className="text-muted-foreground">{type.label}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {pagination.isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="p-6 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-40"></div>
                          <div className="h-3 bg-muted rounded w-24"></div>
                        </div>
                      </div>
                      <div className="w-16 h-4 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              currentTransactions.map((transaction, index) => (
                <TransactionRow key={transaction.hash} transaction={transaction} index={index} />
              ))
            )}
          </div>
          
          {/* Advanced Pagination */}
          <div className="pt-6">
            <PaginationAdvanced
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              isLoading={pagination.isLoading}
              onPageChange={paginationActions.setPage}
              onItemsPerPageChange={paginationActions.setItemsPerPage}
              onLoadMore={paginationActions.loadMore}
              showLoadMore={!isMobile}
              showPageSizeSelector={true}
              showPageJumper={true}
              showItemCount={true}
              loadMoreText="Load More Transactions"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
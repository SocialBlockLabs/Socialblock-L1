import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { ARPBadge, generateMockARPProfile } from "./ARPBadge";
import { PaginationAdvanced } from "./ui/pagination-advanced";
import { usePaginatedData } from "./hooks/usePaginatedData";
import { Clock, Blocks, ExternalLink, Zap, Bot } from "lucide-react";

// Utility function to format numbers with abbreviations
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

// Enhanced mock data generator for blocks
const generateMockBlocks = (count: number, startHeight: number = 18234567) => {
  const blocks = [];
  const validators = [
    { name: "Prysm Node 001", id: "prysm-001", avatar: "PN" },
    { name: "Lighthouse 42", id: "lighthouse-42", avatar: "L4" },
    { name: "Teku Validator", id: "teku-007", avatar: "TV" },
    { name: "Nimbus Node 15", id: "nimbus-15", avatar: "NN" },
    { name: "Geth Validator", id: "geth-003", avatar: "GV" },
    { name: "Besu Validator", id: "besu-008", avatar: "BV" },
    { name: "Nethermind Node", id: "neth-012", avatar: "NT" },
    { name: "Reth Validator", id: "reth-004", avatar: "RT" }
  ];

  for (let i = 0; i < count; i++) {
    const validator = validators[Math.floor(Math.random() * validators.length)];
    const secondsAgo = Math.floor(Math.random() * 3600) + (i * 12); // Realistic block timing
    const date = new Date(Date.now() - secondsAgo * 1000);
    
    blocks.push({
      height: startHeight - i,
      hash: `sblk${Math.random().toString(16).slice(2, 66)}`,
      timestamp: secondsAgo < 60 ? `${secondsAgo}s ago` : 
                 secondsAgo < 3600 ? `${Math.floor(secondsAgo / 60)}m ago` : 
                 `${Math.floor(secondsAgo / 3600)}h ago`,
      timestampFull: date.toLocaleString(),
      validator: {
        ...validator,
        address: `sblk${Math.random().toString(16).slice(2, 42)}`
      },
      transactions: Math.floor(Math.random() * 8000) + 500,
      gasUsed: Math.floor(Math.random() * 25000000) + 5000000,
      gasLimit: 30000000,
      reward: `${(Math.random() * 3 + 1).toFixed(3)} SBLK`,
      status: "confirmed"
    });
  }
  return blocks;
};

// Generate minimal dataset for demo
const TOTAL_BLOCKS = 3;
const allMockBlocks = generateMockBlocks(TOTAL_BLOCKS);

// Gas usage meter component
const GasMeter = ({ used, limit }: { used: number; limit: number }) => {
  const percentage = (used / limit) * 100;
  const isHigh = percentage > 90;
  const isMedium = percentage > 70;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Gas Usage</span>
        <span className={`text-xs font-mono ${
          isHigh ? 'text-destructive' : 
          isMedium ? 'text-chart-4' : 
          'text-neon-green'
        }`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="relative w-full h-2 bg-muted/30 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            isHigh ? 'bg-destructive shadow-[0_0_8px_rgba(255,68,68,0.4)]' :
            isMedium ? 'bg-chart-4 shadow-[0_0_8px_rgba(247,220,111,0.4)]' :
            'bg-neon-green shadow-[0_0_8px_rgba(0,255,65,0.4)]'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
        <span>{formatNumber(used)}</span>
        <span>{formatNumber(limit)}</span>
      </div>
    </div>
  );
};

// Individual block row component
const BlockRow = ({ 
  block, 
  index,
  onBlockClick
}: { 
  block: typeof allMockBlocks[0]; 
  index: number;
  onBlockClick?: (blockHeight: number) => void;
}) => {
  const handleExplainWithAI = () => {
    // This would trigger the AI companion with block-specific context
    console.log(`Explain block ${block.height} with AI`);
  };

  return (
    <div 
      className="group relative"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative p-6 rounded-xl border border-border/50 group-hover:border-neon-blue/30 transition-all duration-300 hover:shadow-cyber">
        {/* AI Explain Button - appears on hover */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExplainWithAI}
            className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 backdrop-blur-xl"
          >
            <Bot className="w-3 h-3 mr-1" />
            Explain with AI
          </Button>
        </div>
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          <div className="space-y-5">
            {/* Header Row */}
            <div className="flex items-start justify-between">
              <Button 
                variant="ghost" 
                className="h-auto p-0 hover:bg-transparent group/height"
                onClick={() => onBlockClick?.(block.height)}
              >
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg font-semibold text-neon-blue group-hover/height:text-neon-green transition-colors">
                      #{block.height}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover/height:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-xs text-muted-foreground font-mono truncate max-w-[200px] mt-1">
                    {block.hash}
                  </div>
                </div>
              </Button>
              
              <div className="flex items-start space-x-3 ml-4">
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-right min-w-0">
                  <div className="text-sm font-semibold whitespace-nowrap">{block.timestamp}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[120px]">{block.timestampFull}</div>
                </div>
              </div>
            </div>
            
            {/* Validator Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-neon-blue via-chart-1 to-neon-green text-black text-sm font-bold">
                    {block.validator.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{block.validator.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{block.validator.id}</div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="text-lg font-mono font-bold text-neon-green">{formatNumber(block.transactions)}</div>
                <div className="text-xs text-muted-foreground">transactions</div>
              </div>
            </div>
            
            {/* Gas Usage */}
            <div className="px-1">
              <GasMeter used={block.gasUsed} limit={block.gasLimit} />
            </div>
            
            {/* Reward */}
            <div className="flex justify-center pt-2">
              <div className="text-center px-4 py-3 rounded-lg bg-muted/20 border border-border/30">
                <div className="text-base font-mono font-bold text-chart-4">{block.reward}</div>
                <div className="text-xs text-muted-foreground">block reward</div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center">
          {/* Block Height - Clickable */}
          <div className="col-span-2">
            <Button 
              variant="ghost" 
              className="h-auto p-0 hover:bg-transparent group/height w-full justify-start"
              onClick={() => onBlockClick?.(block.height)}
            >
              <div className="text-left space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-lg font-semibold text-neon-blue group-hover/height:text-neon-green transition-colors">
                    #{block.height}
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover/height:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-muted-foreground font-mono truncate max-w-[140px]">
                  {block.hash}
                </div>
              </div>
            </Button>
          </div>

          {/* Timestamp */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div className="space-y-1">
                <div className="text-sm font-semibold">{block.timestamp}</div>
                <div className="text-xs text-muted-foreground">{block.timestampFull}</div>
              </div>
            </div>
          </div>

          {/* Validator with Avatar */}
          <div className="col-span-3">
            <div className="flex items-center space-x-4">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-neon-blue via-chart-1 to-neon-green text-black text-sm font-bold">
                  {block.validator.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{block.validator.name}</div>
                <div className="text-xs text-muted-foreground truncate">{block.validator.id}</div>
              </div>
            </div>
          </div>

          {/* Transaction Count */}
          <div className="col-span-1">
            <div className="text-center space-y-1">
              <div className="text-lg font-mono font-bold text-neon-green">{formatNumber(block.transactions)}</div>
              <div className="text-xs text-muted-foreground">txns</div>
            </div>
          </div>

          {/* Gas Used - Visual Meter */}
          <div className="col-span-3">
            <GasMeter used={block.gasUsed} limit={block.gasLimit} />
          </div>

          {/* Block Reward */}
          <div className="col-span-1">
            <div className="text-center space-y-1">
              <div className="text-sm font-mono font-bold text-chart-4">{block.reward}</div>
              <div className="text-xs text-muted-foreground">reward</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RecentBlocksProps {
  limit?: number;
  onBlockClick?: (blockHeight: number) => void;
}

export function RecentBlocks({ limit, onBlockClick }: RecentBlocksProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  const [pagination, paginationActions] = usePaginatedData({
    totalItems: TOTAL_BLOCKS,
    initialItemsPerPage: limit || 20
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get current page data
  const currentBlocks = allMockBlocks.slice(pagination.startIndex, pagination.endIndex);
  return (
    <Card className="w-full backdrop-blur-cyber border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Blocks className="w-6 h-6 text-neon-blue" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[rgba(0,255,65,0)] rounded-full animate-pulse"></div>
            </div>
            <div>
              <CardTitle className="text-xl font-normal text-glow-blue text-[rgba(255,255,255,1)]">Recent Blocks</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Latest confirmed blocks on the network</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Desktop Headers */}
        <div className="hidden lg:grid grid-cols-12 gap-8 px-6 py-3 text-xs font-medium text-muted-foreground bg-muted/20 rounded-lg">
          <div className="col-span-2">Block Height</div>
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-3">Validator</div>
          <div className="col-span-1 text-center">Transactions</div>
          <div className="col-span-3">Gas Usage</div>
          <div className="col-span-1 text-center">Reward</div>
        </div>
        
        {/* Block Rows */}
        <div className="space-y-4">
          {pagination.isLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="p-6 rounded-xl border border-border/50 bg-muted/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/3"></div>
                    </div>
                    <div className="w-16 h-4 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            currentBlocks.map((block, index) => (
              <BlockRow 
                key={block.height} 
                block={block} 
                index={index}
                onBlockClick={onBlockClick}
              />
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
            loadMoreText="Load More Blocks"
          />
        </div>
      </CardContent>
    </Card>
  );
}
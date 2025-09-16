import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DashboardWidget } from "../DashboardWidget";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { 
  Bot, 
  TrendingUp, 
  Zap, 
  Activity, 
  Brain, 
  Target, 
  Sparkles, 
  Eye, 
  MessageSquare,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Cpu,
  Network,
  Radar,
  Info,
  TrendingDown,
  BarChart3,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Mock data for AI-detected trends - Minimal demo set
const aiTrends = [
  {
    id: "defi-yield-farming",
    name: "DeFi Yield Farming Renaissance",
    summary: "AI models detect a 340% surge in yield farming protocols with new innovative mechanics. Cross-chain liquidity pools are experiencing unprecedented growth as users seek higher APY opportunities.",
    confidence: 94,
    sentiment: "bullish",
    sentimentScore: 8.7,
    timeframe: "7d",
    category: "DeFi",
    aiAnalyst: "DeepMarket v3.2",
    sentimentHistory: [
      { time: "6d", score: 6.2 },
      { time: "5d", score: 6.8 },
      { time: "4d", score: 7.1 },
      { time: "3d", score: 7.9 },
      { time: "2d", score: 8.3 },
      { time: "1d", score: 8.5 },
      { time: "now", score: 8.7 }
    ],
    relatedTokens: [
      { symbol: "UNI", change: 12.4, volume: "high", marketCap: 4.2e9, liquidity: "excellent" },
      { symbol: "AAVE", change: 8.7, volume: "high", marketCap: 1.8e9, liquidity: "excellent" },
      { symbol: "COMP", change: 15.2, volume: "medium", marketCap: 800e6, liquidity: "good" }
    ],
    activeAgents: [
      { name: "YieldBot Pro", status: "analyzing", activity: "Monitoring 47 pools" }
    ],
    tags: ["yield-farming", "cross-chain", "liquidity"],
    impact: "high"
  }
];

// Simplified Static Sentiment Chart Component
const SentimentChart = ({ data, currentScore }: { 
  data: typeof aiTrends[0]['sentimentHistory']; 
  currentScore: number;
}) => {
  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));
  const range = maxScore - minScore || 1;

  const getSentimentColor = (score: number) => {
    if (score >= 8) return "#97F11D"; // Brand green
    if (score >= 7) return "#00FF41"; // Neon green
    if (score >= 6) return "#00F5FF"; // Neon cyan
    if (score >= 4) return "#F7DC6F"; // Yellow
    if (score >= 3) return "#FF8C47"; // Orange
    return "#FF6B35"; // Red
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 8) return "Very Bullish";
    if (score >= 7) return "Bullish";
    if (score >= 6) return "Positive";
    if (score >= 4) return "Neutral";
    if (score >= 3) return "Bearish";
    return "Very Bearish";
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 7) return <TrendingUp className="w-3 h-3" />;
    if (score >= 4) return <Minus className="w-3 h-3" />;
    return <TrendingDown className="w-3 h-3" />;
  };

  return (
    <div className="w-full">
      {/* Chart Container - Responsive */}
      <div className="relative bg-muted/10 rounded-lg p-3 border border-border/20 h-24 w-full">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 400 80" 
          className="overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="sentiment-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={getSentimentColor(data[0].score)} stopOpacity="0.8"/>
              <stop offset="100%" stopColor={getSentimentColor(currentScore)} stopOpacity="1"/>
            </linearGradient>
            
            <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={getSentimentColor(currentScore)} stopOpacity="0.2"/>
              <stop offset="100%" stopColor={getSentimentColor(currentScore)} stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          {/* Generate path data */}
          {(() => {
            const points = data.map((point, index) => {
              const x = (index / (data.length - 1)) * 380 + 10;
              const y = 70 - ((point.score - minScore) / range) * 50;
              return { x, y, score: point.score };
            });

            const pathData = points.map((point, index) => 
              `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
            ).join(' ');

            const areaData = `${pathData} L ${points[points.length - 1].x} 70 L 10 70 Z`;

            return (
              <>
                {/* Area fill */}
                <path
                  d={areaData}
                  fill="url(#area-gradient)"
                />
                
                {/* Main line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="url(#sentiment-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={index === points.length - 1 ? "3" : "2"}
                    fill={getSentimentColor(point.score)}
                    className={index === points.length - 1 ? "animate-pulse" : ""}
                  />
                ))}
              </>
            );
          })()}
        </svg>
      </div>
      
      {/* Sentiment indicator */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          <div 
            className="flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium"
            style={{ 
              color: getSentimentColor(currentScore),
              backgroundColor: `${getSentimentColor(currentScore)}15`
            }}
          >
            {getSentimentIcon(currentScore)}
            <span>{getSentimentLabel(currentScore)}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div 
            className="text-lg font-mono font-bold"
            style={{ color: getSentimentColor(currentScore) }}
          >
            {currentScore.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Minimal Token Grid Component with Fixed Colors
const TokenGrid = ({ tokens }: { tokens: typeof aiTrends[0]['relatedTokens'] }) => {
  const getTokenColor = (change: number) => {
    if (change > 10) return "#97F11D"; // Brand green for big gains
    if (change > 0) return "#00FF41"; // Neon green for gains
    if (change === 0) return "#888"; // Gray for no change
    if (change > -10) return "#F7DC6F"; // Yellow for small losses
    return "#FF6B35"; // Red for big losses
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e9) return `${(cap / 1e9).toFixed(1)}B`;
    if (cap >= 1e6) return `${(cap / 1e6).toFixed(0)}M`;
    return `${(cap / 1e3).toFixed(0)}K`;
  };

  const getVolumeIndicator = (volume: string) => {
    const dots = volume === "high" ? 3 : volume === "medium" ? 2 : 1;
    return Array.from({ length: 3 }, (_, i) => (
      <div 
        key={i} 
        className={`w-1 h-1 rounded-full ${i < dots ? 'bg-current opacity-100' : 'bg-current opacity-20'}`}
      />
    ));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {tokens.map((token) => (
        <div
          key={token.symbol}
          className="p-3 rounded-lg bg-muted/10 border border-border/30 hover:border-current/30 transition-all duration-200 group"
          style={{ borderColor: `${getTokenColor(token.change)}30` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="font-mono font-bold text-sm">{token.symbol}</div>
            <div className="flex space-x-0.5" style={{ color: getTokenColor(token.change) }}>
              {getVolumeIndicator(token.volume)}
            </div>
          </div>
          
          {/* Change */}
          <div className="flex items-center space-x-1 mb-2">
            {token.change > 0 ? (
              <ArrowUp className="w-3 h-3" style={{ color: getTokenColor(token.change) }} />
            ) : token.change < 0 ? (
              <ArrowDown className="w-3 h-3" style={{ color: getTokenColor(token.change) }} />
            ) : (
              <Minus className="w-3 h-3" style={{ color: getTokenColor(token.change) }} />
            )}
            <span 
              className="text-sm font-bold font-mono"
              style={{ color: getTokenColor(token.change) }}
            >
              {token.change > 0 ? '+' : ''}{token.change.toFixed(1)}%
            </span>
          </div>
          
          {/* Market cap */}
          <div className="text-xs text-muted-foreground">
            {formatMarketCap(token.marketCap)}
          </div>
        </div>
      ))}
    </div>
  );
};

// Active Agents Component
const ActiveAgents = ({ agents }: { agents: typeof aiTrends[0]['activeAgents'] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-neon-green";
      case "analyzing": return "text-neon-blue";
      case "trading": return "text-chart-4";
      case "monitoring": return "text-chart-5";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Zap className="w-3 h-3" />;
      case "analyzing": return <Brain className="w-3 h-3" />;
      case "trading": return <TrendingUp className="w-3 h-3" />;
      case "monitoring": return <Eye className="w-3 h-3" />;
      default: return <Bot className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-2">
      {agents.map((agent, index) => (
        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/20 border border-border/30">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-br from-neon-blue/20 to-neon-green/20 text-xs">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium truncate">{agent.name}</span>
              <div className={`flex items-center space-x-1 ${getStatusColor(agent.status)}`}>
                {getStatusIcon(agent.status)}
                <span className="text-xs capitalize">{agent.status}</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">{agent.activity}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Trend Card Component with Cleaner Design
const TrendCard = ({ trend }: { trend: typeof aiTrends[0] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "#97F11D"; // Brand green
    if (confidence >= 80) return "#00FF41"; // Neon green  
    if (confidence >= 70) return "#00F5FF"; // Neon cyan
    return "#F7DC6F"; // Yellow
  };

  const getSentimentBadge = (sentiment: string) => {
    const badges = {
      bullish: { label: "Bullish", color: "text-[#97F11D] bg-[#97F11D]/10" },
      bearish: { label: "Bearish", color: "text-[#FF6B35] bg-[#FF6B35]/10" },
      neutral: { label: "Neutral", color: "text-[#F7DC6F] bg-[#F7DC6F]/10" }
    };
    return badges[sentiment as keyof typeof badges] || badges.neutral;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "DeFi": return <Target className="w-4 h-4" />;
      case "Infrastructure": return <Network className="w-4 h-4" />;
      case "NFTs": return <Sparkles className="w-4 h-4" />;
      case "Governance": return <MessageSquare className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const sentimentBadge = getSentimentBadge(trend.sentiment);

  return (
    <Card className="group relative bg-card/80 backdrop-blur-sm border border-border/50 hover:border-[#97F11D]/30 transition-all duration-300">
      {/* Minimal Confidence Score with Tooltip */}
      <div className="absolute top-4 right-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center space-y-1 cursor-help">
              <div 
                className="text-xs font-mono font-bold"
                style={{ color: getConfidenceColor(trend.confidence) }}
              >
                {trend.confidence}%
              </div>
              <div className="text-xs text-muted-foreground">confidence</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-sm">
            <p className="text-sm">
              <span className="font-semibold" style={{ color: getConfidenceColor(trend.confidence) }}>
                AI Confidence Level
              </span><br />
              Statistical confidence in this trend analysis based on data quality, 
              model consensus, and historical accuracy. Higher confidence indicates more reliable predictions.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between pr-16">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {getCategoryIcon(trend.category)}
              <CardTitle className="text-lg">{trend.name}</CardTitle>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`text-xs ${sentimentBadge.color}`}>
                {sentimentBadge.label}
              </Badge>
              <Badge variant="outline" className="text-xs border-muted-foreground/30">
                {trend.category}
              </Badge>
              <Badge variant="outline" className="text-xs border-muted-foreground/30">
                {trend.timeframe}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI Summary with Tooltips */}
        <div className="p-3 bg-muted/10 rounded-lg border border-border/20">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4 text-[#97F11D]" />
            <span className="text-sm font-medium">AI Analysis</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground hover:text-[#97F11D] cursor-help transition-colors">
                  by {trend.aiAnalyst}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm">
                <p className="text-sm">
                  <span className="font-semibold text-[#97F11D]">{trend.aiAnalyst}</span><br />
                  Advanced AI model specializing in {trend.category.toLowerCase()} trend detection and analysis. 
                  Uses multiple data sources and machine learning algorithms to identify market patterns.
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 text-muted-foreground hover:text-[#97F11D] cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm">
                <p className="text-sm">
                  Real-time AI-generated analysis of market trends, social sentiment, and ecosystem developments. 
                  Updated continuously as new data becomes available.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{trend.summary}</p>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="space-y-6">
            {/* Sentiment Chart with Tooltip */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#97F11D]" />
                <span>Sentiment Trend</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-muted-foreground hover:text-[#97F11D] cursor-help transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <p className="text-sm">
                      <span className="font-semibold text-[#97F11D]">AI Sentiment Analysis</span><br />
                      Real-time sentiment tracking across social media, forums, and news sources. 
                      Scores range from 0-10, with higher values indicating more positive market sentiment.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </h4>
              <SentimentChart data={trend.sentimentHistory} currentScore={trend.sentimentScore} />
            </div>

            {/* Related Tokens with Tooltip */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-[#97F11D]" />
                <span>Related Tokens</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-muted-foreground hover:text-[#97F11D] cursor-help transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <p className="text-sm">
                      <span className="font-semibold text-[#97F11D]">Trend-Related Tokens</span><br />
                      Cryptocurrencies and tokens most likely to be affected by this trend. 
                      Shows price changes, trading volume, and market impact indicators.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </h4>
              <TokenGrid tokens={trend.relatedTokens} />
            </div>

            {/* Active Agents with Tooltip */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                <Bot className="w-4 h-4 text-[#97F11D]" />
                <span>Active AI Agents</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-muted-foreground hover:text-[#97F11D] cursor-help transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <p className="text-sm">
                      <span className="font-semibold text-[#97F11D]">Monitoring AI Agents</span><br />
                      Specialized AI agents currently analyzing this trend in real-time. 
                      Each agent has different capabilities and provides unique insights on the developing situation.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </h4>
              <ActiveAgents agents={trend.activeAgents} />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-border/20">
          <div className="flex items-center space-x-2">
            {trend.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs bg-muted/20">
                #{tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-[#97F11D]/30 text-[#97F11D] hover:bg-[#97F11D]/10"
            >
              <Eye className="w-3 h-3 mr-1" />
              Analyze
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="border-muted-foreground/30 hover:bg-muted/20"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  More
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function AITrendsTab() {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Stats Grid with Tooltips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <DashboardWidget
                  title="AI Agents Online"
                  value="156"
                  change={{ value: "+8", type: "increase" }}
                  icon={<Bot className="w-5 h-5 text-neon-blue" />}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <p className="text-sm">
                <span className="font-semibold text-neon-blue">Active AI Agents</span><br />
                Number of AI agents currently online and actively analyzing market data, 
                social sentiment, and blockchain activity across the ecosystem.
              </p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <DashboardWidget
                  title="Trends Detected"
                  value="47"
                  change={{ value: "+12", type: "increase" }}
                  icon={<Brain className="w-5 h-5 text-neon-green" />}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <p className="text-sm">
                <span className="font-semibold text-neon-green">Detected Trends</span><br />
                Total number of emerging trends identified by AI models in the last 24 hours. 
                Includes market movements, social patterns, and technological developments.
              </p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <DashboardWidget
                  title="Avg Confidence"
                  value="87.3%"
                  change={{ value: "+2.1%", type: "increase" }}
                  icon={<Target className="w-5 h-5 text-neon-blue" />}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <p className="text-sm">
                <span className="font-semibold text-neon-blue">Average Confidence</span><br />
                Mean confidence score across all active trend analyses. 
                Reflects the overall certainty of AI models in their current predictions and insights.
              </p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <DashboardWidget
                  title="AI Processing Load"
                  value="73%"
                  change={{ value: "+5%", type: "increase" }}
                  icon={<Zap className="w-5 h-5 text-neon-green" />}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <p className="text-sm">
                <span className="font-semibold text-neon-green">Processing Load</span><br />
                Current computational load across the AI agent network. 
                Higher loads indicate increased market activity and more intensive analysis being performed.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

      {/* Header with Tooltip */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-medium">AI-Detected Ecosystem Trends</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground hover:text-[#97F11D] cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm">
                <p className="text-sm">
                  <span className="font-semibold text-[#97F11D]">AI Trend Detection System</span><br />
                  Advanced machine learning algorithms continuously analyze market data, social sentiment, 
                  and blockchain metrics to identify emerging trends before they become mainstream.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time trend analysis powered by advanced machine learning algorithms
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs border-neon-green/30 text-neon-green">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse mr-1"></div>
            Live Analysis
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Updated 2m ago
          </Badge>
        </div>
      </div>

      {/* Trend Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {aiTrends.map((trend) => (
          <TrendCard key={trend.id} trend={trend} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button 
          variant="outline" 
          className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 hover:border-neon-blue/50"
        >
          <Brain className="w-4 h-4 mr-2" />
          Analyze More Trends
        </Button>
      </div>
    </div>
    </TooltipProvider>
  );
}
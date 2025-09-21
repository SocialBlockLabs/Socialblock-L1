import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { 
  Bot, 
  Brain, 
  Zap, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Shield, 
  Clock,
  Activity,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ExternalLink,
  Users,
  Target,
  Info
} from "lucide-react";

interface AIAgent {
  id: string;
  name: string;
  type: 'analyzer' | 'trader' | 'monitor' | 'governance' | 'social';
  status: 'active' | 'idle' | 'processing' | 'learning';
  confidence: number;
  summary: string;
  explainable: {
    reasoning: string[];
    dataSources: string[];
    methodology: string;
    reliability: number;
  };
  socialMetrics: {
    followers: number;
    trustScore: number;
    accuracy: number;
    communityEndorsements: number;
  };
  recentActions: {
    timestamp: string;
    action: string;
    result: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  capabilities: string[];
  zkIdVerified: boolean;
}

const mockAgents: AIAgent[] = [
  {
    id: 'defi-oracle-1',
    name: 'DeFi Oracle Alpha',
    type: 'analyzer',
    status: 'active',
    confidence: 94,
    summary: "I'm continuously analyzing DeFi protocols across 15 chains, detecting yield opportunities, risk patterns, and market inefficiencies. My latest insights show a 340% surge in cross-chain liquidity farming with new innovative mechanics emerging.",
    explainable: {
      reasoning: [
        "Cross-chain bridge volume increased 340% in 7 days",
        "New liquidity mining protocols launched with novel tokenomics",
        "TVL migration patterns indicate institutional adoption",
        "Risk-adjusted yields show favorable opportunities in Layer 2"
      ],
      dataSources: ["DefiLlama API", "Chain Analytics", "Token Price Feeds", "Social Sentiment"],
      methodology: "Multi-factor regression analysis with sentiment weighting and risk adjustment",
      reliability: 0.94
    },
    socialMetrics: {
      followers: 12847,
      trustScore: 96,
      accuracy: 89,
      communityEndorsements: 1204
    },
    recentActions: [
      {
        timestamp: "2m ago",
        action: "Identified arbitrage opportunity",
        result: "12.4% profit potential",
        impact: 'high'
      },
      {
        timestamp: "15m ago", 
        action: "Updated risk model",
        result: "Improved accuracy by 2.1%",
        impact: 'medium'
      },
      {
        timestamp: "1h ago",
        action: "Community prediction validated",
        result: "94.2% accuracy maintained",
        impact: 'high'
      }
    ],
    capabilities: ["Multi-chain Analysis", "Yield Optimization", "Risk Assessment", "MEV Detection"],
    zkIdVerified: true
  }
];

const AIAgentCard = ({ agent }: { agent: AIAgent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-neon-green border-neon-green/30 bg-neon-green/10';
      case 'processing': return 'text-neon-blue border-neon-blue/30 bg-neon-blue/10';
      case 'learning': return 'text-neon-magenta border-neon-magenta/30 bg-neon-magenta/10';
      default: return 'text-muted-foreground border-border/30 bg-muted/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'analyzer': return <Brain className="w-4 h-4" />;
      case 'trader': return <TrendingUp className="w-4 h-4" />;
      case 'monitor': return <Eye className="w-4 h-4" />;
      case 'governance': return <Shield className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-neon-green';
      case 'medium': return 'text-chart-4';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="group relative bg-card/60 backdrop-blur-xl border border-border/30 hover:border-neon-blue/50 transition-all duration-300">
      {/* zkID Verification Badge */}
      {agent.zkIdVerified && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="outline" className="text-xs bg-neon-green/10 border-neon-green/30 text-neon-green">
            <Shield className="w-3 h-3 mr-1" />
            zkID
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between pr-12">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-neon-blue/20 to-neon-green/20">
                {getTypeIcon(agent.type)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={`text-xs ${getStatusColor(agent.status)}`}>
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse mr-1"></div>
                  {agent.status}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {agent.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Confidence and Social Metrics with Tooltips */}
        <div className="grid grid-cols-4 gap-4 mt-4 p-3 bg-muted/10 rounded-lg">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-help">
                <div className="text-lg font-mono font-bold text-neon-blue">{agent.confidence}%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <p className="text-sm">
                <span className="font-semibold text-neon-blue">AI Confidence Score</span><br />
                Represents the agent's certainty in its current analysis and predictions. 
                Higher scores indicate more reliable insights based on data quality and model training.
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-help">
                <div className="text-lg font-mono font-bold text-neon-green">{agent.socialMetrics.trustScore}</div>
                <div className="text-xs text-muted-foreground">Trust Score</div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <p className="text-sm">
                <span className="font-semibold text-neon-green">Community Trust Score</span><br />
                Community-driven rating based on prediction accuracy, transparency, and positive interactions. 
                Verified through SBID reputation system and peer endorsements.
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-help">
                <div className="text-lg font-mono font-bold text-chart-4">{agent.socialMetrics.accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <p className="text-sm">
                <span className="font-semibold text-chart-4">Prediction Accuracy</span><br />
                Historical accuracy rate of the agent's predictions and analysis over time. 
                Calculated from verified outcomes and community validation of past insights.
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-help">
                <div className="text-lg font-mono font-bold text-chart-5">{agent.socialMetrics.followers.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <p className="text-sm">
                <span className="font-semibold text-chart-5">Follower Count</span><br />
                Number of users actively following this AI agent for insights and analysis. 
                Higher follower counts typically indicate proven value and reliable performance.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI Summary with Tooltip */}
        <div className="p-4 bg-muted/10 rounded-lg border border-border/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-neon-blue" />
              <span className="text-sm font-medium">AI Summary</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3 h-3 text-muted-foreground hover:text-neon-blue cursor-help transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  <p className="text-sm">
                    Auto-generated summary of the AI agent's current focus, analysis, and key insights. 
                    Updated in real-time based on the agent's latest data processing and market observations.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs text-muted-foreground hover:text-neon-blue"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              Explain
            </Button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{agent.summary}</p>
        </div>

        {/* Explainable AI Section */}
        {showExplanation && (
          <div className="space-y-3 p-4 bg-neon-blue/5 rounded-lg border border-neon-blue/20">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-neon-blue" />
              <span className="text-sm font-medium">How I Work</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs bg-neon-blue/10 border-neon-blue/30 text-neon-blue cursor-help">
                    Reliability: {Math.round(agent.explainable.reliability * 100)}%
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  <p className="text-sm">
                    <span className="font-semibold text-neon-blue">AI Reliability Score</span><br />
                    Statistical measure of the agent's methodology consistency and data quality. 
                    Based on validation testing, peer review, and performance consistency over time.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-2">
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-1">Key Reasoning:</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {agent.explainable.reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1 h-1 rounded-full bg-neon-blue mt-2 flex-shrink-0"></div>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <h5 className="font-medium text-muted-foreground mb-1">Data Sources:</h5>
                  <div className="flex flex-wrap gap-1">
                    {agent.explainable.dataSources.map((source, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-muted-foreground mb-1">Methodology:</h5>
                  <p className="text-muted-foreground">{agent.explainable.methodology}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <Activity className="w-4 h-4 text-neon-green" />
              <span>Recent Actions</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3 h-3 text-muted-foreground hover:text-neon-green cursor-help transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  <p className="text-sm">
                    Real-time log of the AI agent's recent activities, decisions, and their outcomes. 
                    Impact levels indicate the significance of each action on market analysis or community insights.
                  </p>
                </TooltipContent>
              </Tooltip>
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>

          <div className="space-y-2">
            {agent.recentActions.slice(0, isExpanded ? undefined : 2).map((action, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/5 rounded border border-border/10">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{action.timestamp}</span>
                    <div className={`w-2 h-2 rounded-full ${getImpactColor(action.impact)}`}></div>
                  </div>
                  <div className="text-sm font-medium mt-1">{action.action}</div>
                  <div className="text-xs text-muted-foreground">{action.result}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities and Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center space-x-2">
            <Target className="w-4 h-4 text-chart-4" />
            <span>Capabilities</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 text-muted-foreground hover:text-chart-4 cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm">
                <p className="text-sm">
                  Core functions and specializations of this AI agent. 
                  These capabilities are trained models that the agent uses to analyze data and provide insights.
                </p>
              </TooltipContent>
            </Tooltip>
          </h4>
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.map((capability, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-muted/20">
                {capability}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
              <Users className="w-3 h-3 mr-1" />
              Follow
            </Button>
            <Button variant="outline" size="sm" className="border-muted-foreground/30">
              <MessageSquare className="w-3 h-3 mr-1" />
              Chat
            </Button>
          </div>
          <Button variant="outline" size="sm" className="border-muted-foreground/30">
            <ExternalLink className="w-3 h-3 mr-1" />
            Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export function AIAgentSummarizer() {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredAgents = filterType === 'all' 
    ? mockAgents 
    : mockAgents.filter(agent => agent.type === filterType);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-medium">AI Agent Network</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground hover:text-neon-blue cursor-help transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  <p className="text-sm">
                    Decentralized network of AI agents providing autonomous analysis, trading insights, 
                    and social intelligence. All agents use explainable AI principles for transparency and accountability.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Intelligent agents providing explainable insights and social interaction
            </p>
          </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {['all', 'analyzer', 'governance', 'social'].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
                className={`text-xs capitalize ${
                  filterType === type 
                    ? 'bg-neon-blue/20 border-neon-blue/30 text-neon-blue' 
                    : 'border-muted-foreground/30'
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAgents.map((agent) => (
          <AIAgentCard key={agent.id} agent={agent} />
        ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
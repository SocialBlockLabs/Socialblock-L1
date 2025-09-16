import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { 
  Bot, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Shield,
  Users,
  Zap,
  Brain,
  MessageSquare,
  ArrowRight,
  Eye,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react";

interface AICompanionProps {
  currentTab: string;
  contextData?: any;
}

interface Insight {
  id: string;
  type: 'highlight' | 'warning' | 'opportunity' | 'explanation';
  title: string;
  content: string;
  confidence: number;
  actionable?: boolean;
}

const getContextualExplanations = (tab: string) => {
  const explanations = {
    blocks: {
      greeting: "Hi! I'm your blockchain companion. I can help explain blocks, their contents, and what's happening on the network.",
      summary: "Blocks are like digital containers that hold batches of transactions. Each block builds on the previous one, creating an immutable chain of records.",
      insights: [
        {
          id: 'block-basics',
          type: 'explanation' as const,
          title: 'What are blocks?',
          content: 'Think of blocks as pages in a digital ledger. Each page contains multiple transactions and is cryptographically linked to the previous page, making the history tamper-proof.',
          confidence: 95
        },
        {
          id: 'block-validation',
          type: 'highlight' as const,
          title: 'How blocks get validated',
          content: 'Validators compete to create new blocks by solving complex puzzles or being chosen through stake-based selection. This ensures network security and decentralization.',
          confidence: 92
        },
        {
          id: 'block-timing',
          type: 'opportunity' as const,
          title: 'Block time insights',
          content: 'Faster block times mean quicker transaction confirmation, but may impact network stability. Current average is looking healthy.',
          confidence: 88,
          actionable: true
        }
      ]
    },
    transactions: {
      greeting: "Hey there! I'm here to decode transactions for you. From simple transfers to complex smart contract interactions, I'll make it all clear.",
      summary: "Transactions are instructions that change the blockchain state. They include transfers, smart contract calls, and other operations that cost gas fees.",
      insights: [
        {
          id: 'tx-types',
          type: 'explanation' as const,
          title: 'Transaction types explained',
          content: 'Simple transfers move tokens between addresses. Smart contract interactions can be anything from DeFi swaps to NFT mints. Each type has different gas costs.',
          confidence: 94
        },
        {
          id: 'gas-optimization',
          type: 'opportunity' as const,
          title: 'Gas optimization tips',
          content: 'Transaction fees fluctuate based on network congestion. Consider batching operations or using Layer 2 solutions during high-fee periods.',
          confidence: 89,
          actionable: true
        },
        {
          id: 'tx-status',
          type: 'highlight' as const,
          title: 'Understanding transaction status',
          content: 'Pending transactions are waiting for inclusion. Confirmed transactions are in a block. Failed transactions still consume gas but revert changes.',
          confidence: 96
        }
      ]
    },
    proposals: {
      greeting: "Welcome! I'm your governance guide. I'll help you understand DAO proposals, voting mechanisms, and democratic participation.",
      summary: "Governance proposals let token holders collectively make decisions about protocol changes, treasury management, and community direction.",
      insights: [
        {
          id: 'voting-power',
          type: 'explanation' as const,
          title: 'How voting power works',
          content: 'Your voting power typically comes from token holdings, delegation, or reputation scores. Some DAOs use quadratic voting to prevent whale dominance.',
          confidence: 93
        },
        {
          id: 'proposal-lifecycle',
          type: 'highlight' as const,
          title: 'Proposal lifecycle',
          content: 'Proposals go through drafting, discussion, voting, and execution phases. Each phase has specific timeframes and participation requirements.',
          confidence: 91
        },
        {
          id: 'participation-tips',
          type: 'opportunity' as const,
          title: 'Maximize your impact',
          content: 'Engage in discussions before voting. Delegate to active community members if you can\'t participate directly. Your voice matters in shaping the protocol.',
          confidence: 87,
          actionable: true
        }
      ]
    },
    reputation: {
      greeting: "Hi! I specialize in reputation systems and digital identity. Let me explain how civic scores, zkIDs, and community trust work.",
      summary: "Reputation systems create accountability and trust in decentralized networks through verifiable credentials and community endorsements.",
      insights: [
        {
          id: 'zkid-privacy',
          type: 'explanation' as const,
          title: 'zkID and privacy',
          content: 'Zero-knowledge IDs let you prove identity or credentials without revealing personal information. It\'s like showing you\'re over 21 without showing your birthdate.',
          confidence: 95
        },
        {
          id: 'reputation-building',
          type: 'opportunity' as const,
          title: 'Building your reputation',
          content: 'Consistent participation, quality contributions, and community endorsements boost your civic score. Start with small, meaningful interactions.',
          confidence: 89,
          actionable: true
        },
        {
          id: 'trust-networks',
          type: 'highlight' as const,
          title: 'Trust networks',
          content: 'Reputation creates webs of trust where endorsements from trusted community members carry more weight. Quality over quantity matters.',
          confidence: 92
        }
      ]
    }
  };

  return explanations[tab as keyof typeof explanations] || explanations.blocks;
};

const InsightCard = ({ insight, isExpanded, onToggle }: {
  insight: Insight;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'highlight': return <Lightbulb className="w-4 h-4 text-chart-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-chart-3" />;
      case 'opportunity': return <Target className="w-4 h-4 text-neon-green" />;
      case 'explanation': return <Brain className="w-4 h-4 text-neon-blue" />;
      default: return <Sparkles className="w-4 h-4 text-neon-magenta" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'highlight': return 'border-chart-4/30 bg-chart-4/10';
      case 'warning': return 'border-chart-3/30 bg-chart-3/10';
      case 'opportunity': return 'border-neon-green/30 bg-neon-green/10';
      case 'explanation': return 'border-neon-blue/30 bg-neon-blue/10';
      default: return 'border-neon-magenta/30 bg-neon-magenta/10';
    }
  };

  return (
    <Card className={`border ${getTypeColor(insight.type)} transition-all duration-300 hover:scale-[1.02]`}>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer">
            <div className="flex items-center space-x-3">
              {getTypeIcon(insight.type)}
              <div>
                <h4 className="font-medium">{insight.title}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {Math.round(insight.confidence)}% confidence
                  </Badge>
                  {insight.actionable && (
                    <Badge variant="outline" className="text-xs text-neon-green border-neon-green/30 bg-neon-green/10">
                      Actionable
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.content}
            </p>
            {insight.actionable && (
              <div className="mt-3 flex items-center space-x-2">
                <Button size="sm" variant="outline" className="border-neon-green/30 text-neon-green hover:bg-neon-green/10">
                  <ArrowRight className="w-3 h-3 mr-1" />
                  Take Action
                </Button>
                <Button size="sm" variant="ghost" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Learn More
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

const TypingAnimation = () => (
  <div className="flex items-center space-x-1 text-muted-foreground">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
    <span className="text-xs ml-2">AI is thinking...</span>
  </div>
);

export function AICompanion({ currentTab, contextData }: AICompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());
  const [isThinking, setIsThinking] = useState(false);
  const [hasNewInsights, setHasNewInsights] = useState(true);

  const explanation = getContextualExplanations(currentTab);

  const toggleInsight = (insightId: string) => {
    const newExpanded = new Set(expandedInsights);
    if (newExpanded.has(insightId)) {
      newExpanded.delete(insightId);
    } else {
      newExpanded.add(insightId);
    }
    setExpandedInsights(newExpanded);
  };

  const handleExplainClick = () => {
    setIsOpen(true);
    setIsThinking(true);
    
    // Simulate AI thinking delay
    setTimeout(() => {
      setIsThinking(false);
      setHasNewInsights(false);
    }, 1500);
  };

  const getFloatingButtonText = () => {
    switch (currentTab) {
      case 'blocks': return 'Explain Blocks';
      case 'transactions': return 'Explain Transactions';
      case 'proposals': return 'Explain Proposals';
      case 'reputation': return 'Explain Reputation';
      case 'validators': return 'Explain Validators';
      case 'ai-trends': return 'Explain AI Trends';
      default: return 'Explain with AI';
    }
  };

  useEffect(() => {
    // Reset insights when tab changes
    setExpandedInsights(new Set());
    setHasNewInsights(true);
  }, [currentTab]);

  return (
    <>
      {/* Floating AI Button */}
      <div className="fixed bottom-40 right-6 z-50">
        <div className="relative">
          <Button
            onClick={handleExplainClick}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-green/20 border-2 border-neon-blue/50 hover:border-neon-green/50 backdrop-blur-xl group transition-all duration-300 hover:scale-110"
          >
            <Bot className="w-6 h-6 text-neon-blue group-hover:text-neon-green transition-colors duration-300 animate-pulse" />
            
            {/* Floating tooltip */}
            <div className="absolute bottom-full mb-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap">
                {getFloatingButtonText()}
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border/50"></div>
              </div>
            </div>
          </Button>

          {/* Notification dot for new insights */}
          {hasNewInsights && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon-green rounded-full border-2 border-background flex items-center justify-center animate-pulse">
              <Sparkles className="w-2 h-2 text-background" />
            </div>
          )}

          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border-2 border-neon-blue/30 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border border-neon-green/30 animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>

      {/* AI Companion Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-green/20 border border-neon-blue/30 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-neon-blue" />
                </div>
                <div>
                  <DialogTitle className="text-lg">AI Companion</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Your personal blockchain guide • {currentTab} specialist
                  </DialogDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs text-neon-green border-neon-green/30 bg-neon-green/10">
                  <Activity className="w-3 h-3 mr-1" />
                  Online
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* AI Greeting */}
              <div className="space-y-4">
                <div className="p-4 bg-muted/10 rounded-lg border border-border/20">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-green/20 border border-neon-blue/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-neon-blue" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed">
                        {explanation.greeting}
                      </p>
                      <div className="text-xs text-muted-foreground flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>Just now</span>
                        <CheckCircle className="w-3 h-3 text-neon-green" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-neon-blue/5 rounded-lg border border-neon-blue/20">
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-neon-blue mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-neon-blue mb-2">Quick Summary</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {explanation.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thinking Animation */}
              {isThinking && (
                <div className="p-4">
                  <TypingAnimation />
                </div>
              )}

              {/* Insights Section */}
              {!isThinking && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-neon-magenta" />
                      <span>AI Insights & Highlights</span>
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {explanation.insights.length} insights
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {explanation.insights.map((insight) => (
                      <InsightCard
                        key={insight.id}
                        insight={insight}
                        isExpanded={expandedInsights.has(insight.id)}
                        onToggle={() => toggleInsight(insight.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Recommendations */}
              {!isThinking && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Target className="w-4 h-4 text-neon-green" />
                    <span>Recommended Actions</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" className="justify-start border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
                      <Eye className="w-3 h-3 mr-2" />
                      Explore More Details
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start border-neon-green/30 text-neon-green hover:bg-neon-green/10">
                      <Users className="w-3 h-3 mr-2" />
                      Join Community Discussion
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start border-chart-4/30 text-chart-4 hover:bg-chart-4/10">
                      <TrendingUp className="w-3 h-3 mr-2" />
                      View Analytics
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start border-neon-magenta/30 text-neon-magenta hover:bg-neon-magenta/10">
                      <MessageSquare className="w-3 h-3 mr-2" />
                      Ask Follow-up
                    </Button>
                  </div>
                </div>
              )}

              {/* Conversation Starter */}
              {!isThinking && (
                <div className="p-4 bg-muted/5 rounded-lg border border-border/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Continue the conversation</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Have specific questions about {currentTab}? I'm here to help! Feel free to ask about anything you see on screen.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
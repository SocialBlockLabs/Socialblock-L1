import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { VotingHeatmap, generateMockVotingData } from "../VotingHeatmap";
import { DashboardWidget } from "../DashboardWidget";
import { FollowButton } from "../FollowButton";
import { useFollowButton } from "../SubscriptionManager";
import { PaginationAdvanced } from "../ui/pagination-advanced";
import { usePaginatedData } from "../hooks/usePaginatedData";
import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip as RechartsTooltip, Legend, BarChart, Bar, ComposedChart } from "recharts";
import { 
  Vote, 
  Users, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Calendar,
  Timer,
  Shield,
  Bot,
  Star,
  ThumbsUp,
  ThumbsDown,
  Activity,
  AlertCircle,
  BookOpen
} from "lucide-react";

// Minimal demo set of proposals
const mockProposals = [
  {
    id: "prop-001",
    title: "SocialSwap DEX Integration",
    summary: "Proposal to integrate SocialSwap decentralized exchange directly into the SocialBlock protocol, enabling native token swaps with reduced fees and enhanced liquidity.",
    status: "live",
    category: "Protocol Upgrade",
    author: {
      name: "SocialBlock Foundation",
      avatar: "SBF",
      reputation: 9950,
      address: "sblkd8da6bf26964af9d7eed9e03e53415d37aa96045"
    },
    voting: {
      total: 8947623,
      breakdown: {
        repWeighted: {
          for: 6847234,
          against: 1234567,
          abstain: 865822
        },
        validator: {
          for: 1247,
          against: 89,
          abstain: 156
        },
        agent: {
          for: 23,
          against: 4,
          abstain: 7
        }
      }
    },
    timeline: {
      created: "2024-07-15T10:00:00Z",
      votingStart: "2024-07-16T00:00:00Z", 
      votingEnd: "2024-07-23T23:59:59Z",
      execution: null
    },
    voteHistory: [
      { time: "1d", for: 5200000, against: 800000, abstain: 400000 },
      { time: "2d", for: 4800000, against: 900000, abstain: 450000 },
      { time: "3d", for: 4200000, against: 950000, abstain: 500000 }
    ],
    gitbook: "https://docs.socialblock.io/proposals/socialswap-integration",
    body: `# SocialSwap DEX Integration

## Abstract

This proposal outlines the integration of SocialSwap DEX directly into the SocialBlock protocol, enabling seamless token swaps with reduced fees and enhanced liquidity through native protocol support.`,
    quorum: 5000000,
    minimumVotingPower: 1000000
  },
  {
    id: "prop-002",
    title: "Treasury Allocation for AI Research Fund",
    summary: "Allocate 50,000 SBLK tokens from the DAO treasury to establish an AI research fund supporting development of blockchain-AI integration protocols.",
    status: "passed",
    category: "Treasury",
    author: {
      name: "AI Research Collective",
      avatar: "ARC",
      reputation: 8750,
      address: "sblk47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503"
    },
    voting: {
      total: 6234567,
      breakdown: {
        repWeighted: {
          for: 4234567,
          against: 1234567,
          abstain: 765433
        },
        validator: {
          for: 892,
          against: 234,
          abstain: 89
        },
        agent: {
          for: 18,
          against: 3,
          abstain: 2
        }
      }
    },
    timeline: {
      created: "2024-07-01T10:00:00Z",
      votingStart: "2024-07-02T00:00:00Z",
      votingEnd: "2024-07-09T23:59:59Z",
      execution: "2024-07-10T12:00:00Z"
    },
    voteHistory: [
      { time: "1d", for: 4100000, against: 1200000, abstain: 700000 },
      { time: "2d", for: 3900000, against: 1180000, abstain: 720000 }
    ],
    gitbook: "https://docs.socialblock.io/proposals/ai-research-fund",
    body: `# Treasury Allocation for AI Research Fund

## Summary

This proposal requests an allocation of 50,000 SBLK tokens from the DAO treasury to establish a dedicated AI research fund.`,
    quorum: 3000000,
    minimumVotingPower: 500000
  },
  {
    id: "prop-003",
    title: "Validator Slashing Penalty Reduction",
    summary: "Reduce slashing penalties for minor infractions from 5% to 2% of staked amount to encourage validator participation while maintaining network security.",
    status: "failed",
    category: "Network Parameters",
    author: {
      name: "Validator Alliance",
      avatar: "VA",
      reputation: 7820,
      address: "sblk9876543210fedcba9876543210fedcba98765432"
    },
    voting: {
      total: 4567890,
      breakdown: {
        repWeighted: {
          for: 1567890,
          against: 2345678,
          abstain: 654322
        },
        validator: {
          for: 567,
          against: 789,
          abstain: 123
        },
        agent: {
          for: 8,
          against: 15,
          abstain: 3
        }
      }
    },
    timeline: {
      created: "2024-06-20T10:00:00Z",
      votingStart: "2024-06-21T00:00:00Z",
      votingEnd: "2024-06-28T23:59:59Z",
      execution: null
    },
    voteHistory: [
      { time: "1d", for: 1500000, against: 2300000, abstain: 600000 },
      { time: "2d", for: 1450000, against: 2250000, abstain: 620000 }
    ],
    gitbook: "https://docs.socialblock.io/proposals/slashing-reduction",
    body: `# Validator Slashing Penalty Reduction

## Abstract

This proposal suggests reducing slashing penalties for minor validator infractions from the current 5% to 2% of the staked amount.`,
    quorum: 2500000,
    minimumVotingPower: 400000
  }
];

// Voting Breakdown Component
const VotingBreakdown = ({ voting }: { voting: typeof mockProposals[0]['voting'] }) => {
  const categories = [
    { name: "Rep-Weighted", data: voting.breakdown.repWeighted, icon: Star, color: "text-neon-blue" },
    { name: "Validators", data: voting.breakdown.validator, icon: Shield, color: "text-neon-green" },
    { name: "AI Agents", data: voting.breakdown.agent, icon: Bot, color: "text-chart-4" }
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Voting Breakdown</h4>
      {categories.map((category) => {
        const total = category.data.for + category.data.against + category.data.abstain;
        const forPercent = (category.data.for / total) * 100;
        const againstPercent = (category.data.against / total) * 100;
        const abstainPercent = (category.data.abstain / total) * 100;
        const Icon = category.icon;
        
        return (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${category.color}`} />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{total.toLocaleString()} votes</span>
            </div>
            <div className="space-y-1">
              <div className="flex w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                <div className="bg-neon-green" style={{ width: `${forPercent}%` }} />
                <div className="bg-chart-3" style={{ width: `${againstPercent}%` }} />
                <div className="bg-chart-4" style={{ width: `${abstainPercent}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="text-neon-green">{forPercent.toFixed(1)}% For</span>
                <span className="text-chart-3">{againstPercent.toFixed(1)}% Against</span>
                <span className="text-chart-4">{abstainPercent.toFixed(1)}% Abstain</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Markdown Preview Component
const MarkdownPreview = ({ content }: { content: string }) => {
  const lines = content.split('\n').slice(0, 8);
  
  return (
    <div className="space-y-2 text-xs text-muted-foreground p-3 bg-muted/10 rounded border border-border/20 max-h-32 overflow-hidden">
      {lines.map((line, index) => {
        if (line.startsWith('# ')) {
          return <h4 key={index} className="font-medium text-foreground">{line.substring(2)}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h5 key={index} className="font-medium text-sm text-muted-foreground mt-2">{line.substring(3)}</h5>;
        }
        if (line.trim() === '') {
          return <div key={index} className="h-2" />;
        }
        return <p key={index} className="text-xs leading-relaxed">{line}</p>;
      })}
      <div className="text-center pt-2 border-t border-border/10">
        <span className="text-xs text-muted-foreground">Preview • View full content below</span>
      </div>
    </div>
  );
};

// ProposalCard Component with improved hover effects
const ProposalCard = ({ proposal, index }: { proposal: typeof mockProposals[0]; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVotingDetails, setShowVotingDetails] = useState(false);
  
  const followProps = useFollowButton(
    proposal.author.address, 
    'governance', 
    proposal.author.name
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-neon-green border-neon-green/30 bg-neon-green/10';
      case 'passed': return 'text-neon-blue border-neon-blue/30 bg-neon-blue/10';
      case 'failed': return 'text-chart-3 border-chart-3/30 bg-chart-3/10';
      default: return 'text-muted-foreground border-border/30 bg-muted/10';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Protocol Upgrade': return 'text-neon-blue bg-neon-blue/10 border-neon-blue/30';
      case 'Treasury': return 'text-neon-green bg-neon-green/10 border-neon-green/30';
      case 'Network Parameters': return 'text-chart-4 bg-chart-4/10 border-chart-4/30';
      case 'Governance': return 'text-chart-5 bg-chart-5/10 border-chart-5/30';
      case 'Security': return 'text-chart-3 bg-chart-3/10 border-chart-3/30';
      default: return 'text-muted-foreground bg-muted/10 border-border/30';
    }
  };

  const formatTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const totalVotes = proposal.voting.breakdown.repWeighted.for + 
                    proposal.voting.breakdown.repWeighted.against + 
                    proposal.voting.breakdown.repWeighted.abstain;
  const forPercent = (proposal.voting.breakdown.repWeighted.for / totalVotes) * 100;

  return (
    <div className="group relative">
      <div 
        className="animate-in fade-in-50 duration-300" 
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <Card className="group bg-card/60 backdrop-blur-sm border border-border/30 transition-all duration-300 cursor-pointer hover:shadow-proposal-glow"
              onClick={() => setIsExpanded(!isExpanded)}>
          {proposal.status === 'live' && (
            <div className="absolute -top-2 -right-2 z-10">
              <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-neon-green">LIVE</span>
              </div>
            </div>
          )}
          
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1 pr-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={`text-xs ${getCategoryColor(proposal.category)}`}>
                      {proposal.category}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(proposal.status)}`}>
                      {proposal.status.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight pr-4">{proposal.title}</CardTitle>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-neon-blue/20 to-neon-green/20 text-xs font-bold">
                      {proposal.author.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{proposal.author.name}</span>
                    <FollowButton
                      id={proposal.author.address}
                      type="governance"
                      name={proposal.author.name}
                      isFollowing={followProps.isFollowing}
                      onFollowChange={followProps.onFollowChange}
                      onOpenSubscriptions={followProps.onOpenSubscriptions}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/30" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                      className={forPercent > 50 ? "text-neon-green" : "text-chart-4"}
                      strokeDasharray={`${forPercent * 1.76} 176`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold">{forPercent.toFixed(0)}%</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground text-center">Support</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              {proposal.summary}
            </p>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">{totalVotes.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Votes</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">
                  {proposal.status === 'live' 
                    ? formatTimeRemaining(proposal.timeline.votingEnd)
                    : new Date(proposal.timeline.created).toLocaleDateString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {proposal.status === 'live' ? 'Time Left' : 'Created'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">{proposal.id.toUpperCase()}</div>
                <div className="text-xs text-muted-foreground">Proposal ID</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neon-green">For: {proposal.voting.breakdown.repWeighted.for.toLocaleString()}</span>
                <span className="text-chart-3">Against: {proposal.voting.breakdown.repWeighted.against.toLocaleString()}</span>
                <span className="text-chart-4">Abstain: {proposal.voting.breakdown.repWeighted.abstain.toLocaleString()}</span>
              </div>
              <Progress 
                value={forPercent} 
                className="h-2 bg-muted/30"
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-border/20 mt-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
                  <Vote className="w-3 h-3 mr-1" />
                  Vote
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowVotingDetails(!showVotingDetails);
                  }}
                  className="border-muted-foreground/30"
                >
                  <Activity className="w-3 h-3 mr-1" />
                  Analysis
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <div className="flex items-center space-x-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span className="text-xs text-muted-foreground">{isExpanded ? 'Less' : 'More'}</span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <Collapsible open={isExpanded}>
            <CollapsibleContent>
              <CardContent className="pt-0 border-t border-border/20">
                <div className="space-y-6">
                  
                  {showVotingDetails && (
                    <div className="space-y-4">
                      <VotingBreakdown voting={proposal.voting} />
                    </div>
                  )}
                  
                  <VotingHeatmap 
                    votingData={generateMockVotingData(proposal.id)}
                    className="mt-6"
                  />
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-neon-blue" />
                      <span>Proposal Timeline</span>
                    </h4>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'Created', date: proposal.timeline.created, status: 'completed' },
                        { label: 'Voting Started', date: proposal.timeline.votingStart, status: 'completed' },
                        { label: 'Voting Ends', date: proposal.timeline.votingEnd, status: proposal.status === 'live' ? 'active' : 'completed' },
                        { label: 'Execution', date: proposal.timeline.execution, status: proposal.timeline.execution ? 'completed' : 'pending' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            item.status === 'completed' ? 'bg-neon-green' :
                            item.status === 'active' ? 'bg-neon-blue animate-pulse' :
                            'bg-muted border-2 border-border'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{item.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {item.date ? new Date(item.date).toLocaleDateString() : 'TBD'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-neon-green" />
                      <span>Proposal Content</span>
                    </h4>
                    <MarkdownPreview content={proposal.body} />
                  </div>
                  
                  <div className="flex items-center space-x-3 pt-4 border-t border-border/20">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                    >
                      <BookOpen className="w-3 h-3 mr-2" />
                      View Full Proposal
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Discussion Forum
                    </Button>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
};

export function ProposalsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardWidget
          title="Active Proposals"
          value="12"
          change={{ value: "+3", type: "increase" }}
          icon={<Vote className="w-5 h-5 text-neon-blue" />}
        />
        
        <DashboardWidget
          title="Avg Participation"
          value="73.2%"
          change={{ value: "+5.1%", type: "increase" }}
          icon={<Users className="w-5 h-5 text-neon-green" />}
        />
        
        <DashboardWidget
          title="Proposals Passed"
          value="89.4%"
          change={{ value: "+2.3%", type: "increase" }}
          icon={<CheckCircle className="w-5 h-5 text-neon-blue" />}
        />
        
        <DashboardWidget
          title="Total Voters"
          value="45.6K"
          change={{ value: "+1.2K", type: "increase" }}
          icon={<Activity className="w-5 h-5 text-neon-green" />}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">Governance Proposals</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Active and historical proposals for network governance
            </p>
          </div>
          
          <Badge variant="outline" className="text-xs border-neon-green/30 text-neon-green">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse mr-1"></div>
            {mockProposals.filter(p => p.status === 'live').length} Live
          </Badge>
        </div>

        <div className="space-y-6">
          {mockProposals.map((proposal, index) => (
            <ProposalCard 
              key={proposal.id} 
              proposal={proposal} 
              index={index}
            />
          ))}
        </div>

        <div className="text-center pt-6">
          <Button 
            variant="outline" 
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
          >
            <Vote className="w-4 h-4 mr-2" />
            Load More Proposals
          </Button>
        </div>
      </div>
    </div>
  );
}
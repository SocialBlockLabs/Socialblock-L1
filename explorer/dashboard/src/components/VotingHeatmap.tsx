import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Shield, 
  Bot, 
  Code, 
  Activity,
  Zap,
  Eye,
  ChevronRight
} from "lucide-react";

interface Vote {
  id: string;
  address: string;
  voterType: 'validator' | 'agent' | 'builder' | 'civic' | 'social';
  choice: 'for' | 'against' | 'abstain';
  weight: number; // Reputation weight
  timestamp: string;
  blockNumber: number;
  stakingPower?: number;
  reason?: string;
}

interface VotingData {
  proposalId: string;
  totalVotes: number;
  totalWeight: number;
  votes: Vote[];
  timeline: {
    blockNumber: number;
    timestamp: string;
    cumulativeFor: number;
    cumulativeAgainst: number;
    cumulativeAbstain: number;
    votesInBlock: number;
  }[];
  cohortBreakdown: {
    validator: { for: number; against: number; abstain: number; totalWeight: number };
    agent: { for: number; against: number; abstain: number; totalWeight: number };
    builder: { for: number; against: number; abstain: number; totalWeight: number };
    civic: { for: number; against: number; abstain: number; totalWeight: number };
    social: { for: number; against: number; abstain: number; totalWeight: number };
  };
}

interface VotingHeatmapProps {
  votingData: VotingData;
  className?: string;
}

const voterTypeConfig = {
  validator: {
    icon: Shield,
    label: 'Validators',
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/10',
    borderColor: 'border-neon-blue/30'
  },
  agent: {
    icon: Bot,
    label: 'AI Agents',
    color: 'text-neon-magenta',
    bgColor: 'bg-neon-magenta/10',
    borderColor: 'border-neon-magenta/30'
  },
  builder: {
    icon: Code,
    label: 'Builders',
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
    borderColor: 'border-chart-4/30'
  },
  civic: {
    icon: Users,
    label: 'Civic',
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/10',
    borderColor: 'border-neon-green/30'
  },
  social: {
    icon: Activity,
    label: 'Social',
    color: 'text-chart-5',
    bgColor: 'bg-chart-5/10',
    borderColor: 'border-chart-5/30'
  }
};



const WeightView = ({ votingData }: { votingData: VotingData }) => {
  // Calculate weight distribution
  const forWeight = votingData.votes.filter(v => v.choice === 'for').reduce((sum, v) => sum + v.weight, 0);
  const againstWeight = votingData.votes.filter(v => v.choice === 'against').reduce((sum, v) => sum + v.weight, 0);
  const abstainWeight = votingData.votes.filter(v => v.choice === 'abstain').reduce((sum, v) => sum + v.weight, 0);
  const totalWeight = forWeight + againstWeight + abstainWeight;

  // Top weighted votes
  const topWeightedVotes = votingData.votes
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-neon-green" />
          <span>Reputation-Weighted Results</span>
        </h4>
        
        {/* Weight distribution bars */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-neon-green">For</span>
              <span className="font-mono text-neon-green">{forWeight.toLocaleString()} ({((forWeight / totalWeight) * 100).toFixed(1)}%)</span>
            </div>
            <Progress value={(forWeight / totalWeight) * 100} className="h-3" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-chart-3">Against</span>
              <span className="font-mono text-chart-3">{againstWeight.toLocaleString()} ({((againstWeight / totalWeight) * 100).toFixed(1)}%)</span>
            </div>
            <Progress value={(againstWeight / totalWeight) * 100} className="h-3" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Abstain</span>
              <span className="font-mono text-muted-foreground">{abstainWeight.toLocaleString()} ({((abstainWeight / totalWeight) * 100).toFixed(1)}%)</span>
            </div>
            <Progress value={(abstainWeight / totalWeight) * 100} className="h-3" />
          </div>
        </div>
      </div>
      
      {/* Top weighted voters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-chart-4" />
          <span>Highest Influence Votes</span>
        </h4>
        
        <div className="space-y-2">
          {topWeightedVotes.map((vote, index) => {
            const config = voterTypeConfig[vote.voterType];
            const Icon = config.icon;
            return (
              <div key={vote.id} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/30">
                <div className="flex items-center space-x-3">
                  <div className="text-xs text-muted-foreground">#{index + 1}</div>
                  <div className={`p-1.5 rounded ${config.bgColor} ${config.borderColor} border`}>
                    <Icon className={`w-3 h-3 ${config.color}`} />
                  </div>
                  <div>
                    <div className="text-sm font-mono">{vote.address.slice(0, 8)}...{vote.address.slice(-6)}</div>
                    <div className="text-xs text-muted-foreground">{config.label}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      vote.choice === 'for' ? 'text-neon-green border-neon-green/30 bg-neon-green/10' :
                      vote.choice === 'against' ? 'text-chart-3 border-chart-3/30 bg-chart-3/10' :
                      'text-muted-foreground border-muted-foreground/30 bg-muted/10'
                    }`}
                  >
                    {vote.choice.toUpperCase()}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm font-mono font-medium">{vote.weight.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">weight</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CohortView = ({ votingData }: { votingData: VotingData }) => {
  const cohorts = Object.entries(votingData.cohortBreakdown);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium flex items-center space-x-2">
          <Users className="w-4 h-4 text-neon-magenta" />
          <span>Voter Cohort Breakdown</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cohorts.map(([cohortType, data]) => {
            const config = voterTypeConfig[cohortType as keyof typeof voterTypeConfig];
            
            // Safety check to prevent undefined config
            if (!config) {
              console.warn(`No config found for cohort type: ${cohortType}`);
              return null;
            }
            
            const Icon = config.icon;
            const totalVotes = data.for + data.against + data.abstain;
            
            return (
              <Card key={cohortType} className={`bg-muted/5 border-border/30 hover:${config.borderColor} transition-colors duration-300`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span>{config.label}</span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {totalVotes} votes
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Vote distribution */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neon-green">For: {data.for}</span>
                      <span className="text-chart-3">Against: {data.against}</span>
                      <span className="text-muted-foreground">Abstain: {data.abstain}</span>
                    </div>
                    
                    <div className="h-2 rounded-full overflow-hidden bg-muted/20 flex">
                      <div 
                        className="bg-neon-green" 
                        style={{ width: `${totalVotes > 0 ? (data.for / totalVotes) * 100 : 0}%` }}
                      />
                      <div 
                        className="bg-chart-3" 
                        style={{ width: `${totalVotes > 0 ? (data.against / totalVotes) * 100 : 0}%` }}
                      />
                      <div 
                        className="bg-muted-foreground/30" 
                        style={{ width: `${totalVotes > 0 ? (data.abstain / totalVotes) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Weight influence */}
                  <div className="pt-2 border-t border-border/20">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Total Weight:</span>
                      <span className="font-mono font-medium">{data.totalWeight.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1">
                      <span className="text-muted-foreground">Avg per Vote:</span>
                      <span className="font-mono">{totalVotes > 0 ? Math.round(data.totalWeight / totalVotes).toLocaleString() : 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export function VotingHeatmap({ votingData, className = '' }: VotingHeatmapProps) {
  const [activeView, setActiveView] = useState<'weight' | 'cohort'>('weight');
  
  // Quick stats
  const totalVotes = votingData.totalVotes;
  const participationRate = 75.3; // Mock participation rate
  const averageWeight = totalVotes > 0 ? Math.round(votingData.totalWeight / totalVotes) : 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with quick stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-medium flex items-center space-x-2">
            <Activity className="w-4 h-4 text-neon-blue" />
            <span>Voting Analysis</span>
          </h3>
          
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3 text-neon-green" />
              <span className="text-muted-foreground">{totalVotes} votes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-chart-4" />
              <span className="text-muted-foreground">{participationRate}% participation</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="w-3 h-3 text-neon-magenta" />
              <span className="text-muted-foreground">{averageWeight} avg weight</span>
            </div>
          </div>
        </div>
      </div>

      {/* View toggle tabs */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'weight' | 'cohort')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/20">
          <TabsTrigger 
            value="weight" 
            className="text-xs data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue data-[state=active]:border-neon-blue/30"
          >
            <BarChart3 className="w-3 h-3 mr-2" />
            Weight View
          </TabsTrigger>
          <TabsTrigger 
            value="cohort" 
            className="text-xs data-[state=active]:bg-neon-magenta/20 data-[state=active]:text-neon-magenta data-[state=active]:border-neon-magenta/30"
          >
            <Users className="w-3 h-3 mr-2" />
            Cohort View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="mt-4">
          <WeightView votingData={votingData} />
        </TabsContent>

        <TabsContent value="cohort" className="mt-4">
          <CohortView votingData={votingData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to generate mock voting data
export const generateMockVotingData = (proposalId: string): VotingData => {
  const votes: Vote[] = [];
  const timeline: VotingData['timeline'] = [];
  
  // Generate mock votes
  for (let i = 0; i < 50; i++) {
    votes.push({
      id: `vote_${i}`,
      address: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
      voterType: ['validator', 'agent', 'builder', 'civic', 'social'][Math.floor(Math.random() * 5)] as Vote['voterType'],
      choice: ['for', 'against', 'abstain'][Math.floor(Math.random() * 3)] as Vote['choice'],
      weight: Math.floor(Math.random() * 1000) + 10,
      timestamp: `${Math.floor(Math.random() * 24)}h ago`,
      blockNumber: 18234000 + Math.floor(Math.random() * 1000),
      stakingPower: Math.floor(Math.random() * 50000),
      reason: Math.random() > 0.7 ? 'Detailed reasoning provided' : undefined
    });
  }

  // Generate timeline
  let cumulativeFor = 0, cumulativeAgainst = 0, cumulativeAbstain = 0;
  for (let i = 0; i < 20; i++) {
    const votesInBlock = Math.floor(Math.random() * 5) + 1;
    const forVotes = Math.floor(Math.random() * votesInBlock);
    const againstVotes = Math.floor(Math.random() * (votesInBlock - forVotes));
    const abstainVotes = votesInBlock - forVotes - againstVotes;

    cumulativeFor += forVotes;
    cumulativeAgainst += againstVotes;
    cumulativeAbstain += abstainVotes;

    timeline.push({
      blockNumber: 18234000 + i * 50,
      timestamp: `${20 - i}h ago`,
      cumulativeFor,
      cumulativeAgainst,
      cumulativeAbstain,
      votesInBlock
    });
  }

  // Calculate cohort breakdown with consistent keys
  const cohortBreakdown = {
    validator: { for: 0, against: 0, abstain: 0, totalWeight: 0 },
    agent: { for: 0, against: 0, abstain: 0, totalWeight: 0 },
    builder: { for: 0, against: 0, abstain: 0, totalWeight: 0 },
    civic: { for: 0, against: 0, abstain: 0, totalWeight: 0 },
    social: { for: 0, against: 0, abstain: 0, totalWeight: 0 }
  };

  votes.forEach(vote => {
    const cohort = vote.voterType;
    if (cohort in cohortBreakdown) {
      cohortBreakdown[cohort][vote.choice]++;
      cohortBreakdown[cohort].totalWeight += vote.weight;
    }
  });

  return {
    proposalId,
    totalVotes: votes.length,
    totalWeight: votes.reduce((sum, v) => sum + v.weight, 0),
    votes,
    timeline,
    cohortBreakdown
  };
};
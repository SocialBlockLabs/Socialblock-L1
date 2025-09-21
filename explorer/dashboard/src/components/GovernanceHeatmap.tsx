import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Separator } from "./ui/separator";
import { 
  Vote, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock, 
  Activity,
  Eye,
  Calendar,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Filter,
  Download,
  Search,
  X,
  ChevronDown,
  Settings,
  Bookmark,
  RotateCcw,
  SlidersHorizontal,
  Calendar as CalendarIcon,
  Percent,
  Hash,
  AlertTriangle,
  CheckCircle,
  Info,
  Star
} from "lucide-react";

interface GovernanceData {
  dao: string;
  proposalId: string;
  title: string;
  status: 'active' | 'passed' | 'failed' | 'pending';
  startTime: string;
  endTime: string;
  participation: {
    totalEligible: number;
    totalVoted: number;
    participationRate: number;
  };
  votingPower: {
    for: number;
    against: number;
    abstain: number;
  };
  demographics: {
    newVoters: number;
    repeatedVoters: number;
    whales: number;
    retail: number;
  };
  socialEngagement: {
    discussions: number;
    sentiment: number;
    influencerEndorsements: number;
  };
  category: 'treasury' | 'protocol' | 'governance' | 'ecosystem' | 'emergency';
  impact: 'critical' | 'high' | 'medium' | 'low';
}

interface FilterState {
  search: string;
  categories: string[];
  statuses: string[];
  participationRange: [number, number];
  impactLevels: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: 'date' | 'participation' | 'impact' | 'sentiment';
  sortOrder: 'asc' | 'desc';
  showOnlyActive: boolean;
}

interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: Partial<FilterState>;
  icon: React.ComponentType<{ className?: string }>;
}

const mockGovernanceData: GovernanceData[] = [
  {
    dao: 'Uniswap',
    proposalId: 'UNI-42',
    title: 'V4 Protocol Upgrade and Fee Structure',
    status: 'active',
    startTime: '2024-12-01',
    endTime: '2024-12-08',
    participation: { totalEligible: 45000, totalVoted: 32400, participationRate: 72 },
    votingPower: { for: 8900000, against: 1200000, abstain: 450000 },
    demographics: { newVoters: 1200, repeatedVoters: 31200, whales: 45, retail: 32355 },
    socialEngagement: { discussions: 847, sentiment: 8.4, influencerEndorsements: 23 },
    category: 'protocol',
    impact: 'critical'
  },
  {
    dao: 'Compound',
    proposalId: 'COMP-156',
    title: 'Interest Rate Model Update',
    status: 'passed',
    startTime: '2024-11-15',
    endTime: '2024-11-22',
    participation: { totalEligible: 23000, totalVoted: 18400, participationRate: 80 },
    votingPower: { for: 6200000, against: 890000, abstain: 310000 },
    demographics: { newVoters: 890, repeatedVoters: 17510, whales: 34, retail: 18366 },
    socialEngagement: { discussions: 456, sentiment: 7.2, influencerEndorsements: 18 },
    category: 'protocol',
    impact: 'high'
  },
  {
    dao: 'AAVE',
    proposalId: 'AIP-89',
    title: 'Treasury Diversification Strategy',
    status: 'active',
    startTime: '2024-11-28',
    endTime: '2024-12-05',
    participation: { totalEligible: 34000, totalVoted: 21760, participationRate: 64 },
    votingPower: { for: 4500000, against: 2100000, abstain: 800000 },
    demographics: { newVoters: 1340, repeatedVoters: 20420, whales: 67, retail: 21693 },
    socialEngagement: { discussions: 623, sentiment: 6.8, influencerEndorsements: 15 },
    category: 'treasury',
    impact: 'medium'
  },
  {
    dao: 'MakerDAO',
    proposalId: 'MKR-234',
    title: 'Emergency Stability Fee Adjustment',
    status: 'passed',
    startTime: '2024-11-20',
    endTime: '2024-11-23',
    participation: { totalEligible: 15000, totalVoted: 13500, participationRate: 90 },
    votingPower: { for: 8900000, against: 450000, abstain: 150000 },
    demographics: { newVoters: 234, repeatedVoters: 13266, whales: 89, retail: 13411 },
    socialEngagement: { discussions: 234, sentiment: 9.1, influencerEndorsements: 31 },
    category: 'emergency',
    impact: 'critical'
  },
  {
    dao: 'ENS',
    proposalId: 'ENS-67',
    title: 'Ecosystem Grant Program Expansion',
    status: 'active',
    startTime: '2024-11-25',
    endTime: '2024-12-02',
    participation: { totalEligible: 28000, totalVoted: 16800, participationRate: 60 },
    votingPower: { for: 3200000, against: 890000, abstain: 1100000 },
    demographics: { newVoters: 2100, repeatedVoters: 14700, whales: 23, retail: 16777 },
    socialEngagement: { discussions: 789, sentiment: 8.7, influencerEndorsements: 27 },
    category: 'ecosystem',
    impact: 'medium'
  },
  {
    dao: 'Arbitrum',
    proposalId: 'ARB-23',
    title: 'Gaming Ecosystem Development Fund',
    status: 'pending',
    startTime: '2024-12-05',
    endTime: '2024-12-12',
    participation: { totalEligible: 52000, totalVoted: 0, participationRate: 0 },
    votingPower: { for: 0, against: 0, abstain: 0 },
    demographics: { newVoters: 0, repeatedVoters: 0, whales: 0, retail: 0 },
    socialEngagement: { discussions: 156, sentiment: 7.8, influencerEndorsements: 12 },
    category: 'ecosystem',
    impact: 'high'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-neon-blue border-neon-blue/20 bg-neon-blue/5';
    case 'passed': return 'text-neon-green border-neon-green/20 bg-neon-green/5';
    case 'failed': return 'text-muted-foreground border-border/40 bg-muted/10';
    case 'pending': return 'text-muted-foreground border-border/30 bg-muted/5';
    default: return 'text-muted-foreground border-border/20 bg-muted/5';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'emergency': return Shield;
    case 'protocol': return Activity;
    case 'treasury': return Zap;
    case 'governance': return Vote;
    case 'ecosystem': return Users;
    default: return Target;
  }
};

const getImpactWeight = (impact: string) => {
  switch (impact) {
    case 'critical': return 1.0;
    case 'high': return 0.8;
    case 'medium': return 0.6;
    case 'low': return 0.4;
    default: return 0.5;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'critical': return 'text-destructive bg-destructive/10 border-destructive/30';
    case 'high': return 'text-chart-3 bg-chart-3/10 border-chart-3/30';
    case 'medium': return 'text-chart-4 bg-chart-4/10 border-chart-4/30';
    case 'low': return 'text-neon-green bg-neon-green/10 border-neon-green/30';
    default: return 'text-muted-foreground bg-muted/10 border-border/30';
  }
};

const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'active-high-impact',
    name: 'Active High Impact',
    description: 'Currently active proposals with high impact',
    icon: AlertTriangle,
    filters: {
      statuses: ['active'],
      impactLevels: ['critical', 'high'],
      showOnlyActive: true
    }
  },
  {
    id: 'recent-passed',
    name: 'Recently Passed',
    description: 'Proposals passed in the last 30 days',
    icon: CheckCircle,
    filters: {
      statuses: ['passed'],
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      }
    }
  },
  {
    id: 'high-participation',
    name: 'High Participation',
    description: 'Proposals with >75% participation rate',
    icon: Users,
    filters: {
      participationRange: [75, 100]
    }
  },
  {
    id: 'protocol-upgrades',
    name: 'Protocol Upgrades',
    description: 'Protocol and emergency proposals only',
    icon: Shield,
    filters: {
      categories: ['protocol', 'emergency']
    }
  }
];

const DEFAULT_FILTERS: FilterState = {
  search: '',
  categories: [],
  statuses: [],
  participationRange: [0, 100],
  impactLevels: [],
  dateRange: {
    start: '',
    end: ''
  },
  sortBy: 'date',
  sortOrder: 'desc',
  showOnlyActive: false
};

const HeatmapCell = ({ data }: { data: GovernanceData }) => {
  const participationIntensity = Math.min(data.participation.participationRate / 100, 1);
  const impactWeight = getImpactWeight(data.impact);
  const combinedIntensity = (participationIntensity * 0.7) + (impactWeight * 0.3);
  
  const baseOpacity = 0.05 + (combinedIntensity * 0.15);
  const borderOpacity = 0.1 + (combinedIntensity * 0.2);
  const shadowIntensity = combinedIntensity * 0.3;
  
  const CategoryIcon = getCategoryIcon(data.category);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="relative w-full h-24 rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden group hover:scale-[1.02] hover:shadow-lg hover:z-10"
            style={{
              background: `linear-gradient(135deg, 
                rgba(255, 255, 255, ${baseOpacity}) 0%, 
                rgba(136, 136, 136, ${baseOpacity * 0.8}) 50%, 
                rgba(255, 255, 255, ${baseOpacity * 0.6}) 100%
              )`,
              borderColor: `rgba(255, 255, 255, ${borderOpacity})`,
              boxShadow: `0 4px 12px rgba(0, 0, 0, ${shadowIntensity}), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
            }}
          >
            {/* Status indicator */}
            <div className="absolute top-2 right-2">
              <div className={`w-2 h-2 rounded-full ${
                data.status === 'active' ? 'bg-neon-blue animate-pulse' :
                data.status === 'passed' ? 'bg-neon-green' :
                data.status === 'failed' ? 'bg-muted-foreground' :
                'bg-muted-foreground/50'
              }`}></div>
            </div>

            {/* Category icon */}
            <div className="absolute top-2 left-2">
              <div className="w-5 h-5 rounded-lg bg-muted/20 border border-border/30 flex items-center justify-center">
                <CategoryIcon className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>

            {/* Participation rate bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/10 rounded-b-xl overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-muted-foreground/40 to-foreground/60 transition-all duration-500"
                style={{ width: `${data.participation.participationRate}%` }}
              ></div>
            </div>

            {/* Content */}
            <div className="p-3 pt-8 h-full flex flex-col justify-between">
              <div className="space-y-1">
                <div className="text-xs font-mono font-medium text-foreground/90">
                  {data.dao}
                </div>
                <div className="text-xs text-muted-foreground truncate leading-tight">
                  {data.title.slice(0, 25)}...
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-foreground/80">
                  {data.participation.participationRate}%
                </div>
                <Badge variant="outline" className="text-xs px-2 py-0 border-border/30 bg-muted/10 text-muted-foreground">
                  {data.impact}
                </Badge>
              </div>
            </div>

            {/* Subtle hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            
            {/* Enhanced border on hover */}
            <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-neon-blue/20 transition-colors duration-300"></div>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          align="center"
          className="p-0 border-0 bg-transparent shadow-2xl max-w-sm"
          sideOffset={8}
        >
          <ProposalTooltip data={data} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ProposalTooltip = ({ data }: { data: GovernanceData }) => {
  const CategoryIcon = getCategoryIcon(data.category);
  const totalVotingPower = data.votingPower.for + data.votingPower.against + data.votingPower.abstain;
  const forPercentage = totalVotingPower > 0 ? (data.votingPower.for / totalVotingPower) * 100 : 0;
  const againstPercentage = totalVotingPower > 0 ? (data.votingPower.against / totalVotingPower) * 100 : 0;
  const abstainPercentage = totalVotingPower > 0 ? (data.votingPower.abstain / totalVotingPower) * 100 : 0;
  
  return (
    <Card className="w-96 max-w-sm border-border/30 bg-card/98 backdrop-blur-xl shadow-xl">
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-4 border-b border-border/20 bg-muted/5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-muted/20 border border-border/30 flex items-center justify-center">
                <CategoryIcon className="w-4 h-4 text-foreground/80" />
              </div>
              <Badge variant="outline" className="text-xs capitalize border-border/30 bg-muted/20 text-foreground/80 px-2 py-1">
                {data.category}
              </Badge>
            </div>
            <Badge variant="outline" className={`text-xs px-2 py-1 ${getStatusColor(data.status)}`}>
              {data.status}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground leading-tight">{data.title}</h4>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="font-mono font-medium">{data.dao}</span>
              <span>•</span>
              <span className="font-mono">{data.proposalId}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="p-4 border-b border-border/20">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-1">
              <div className="text-xl font-mono font-bold text-neon-blue">
                {data.participation.participationRate}%
              </div>
              <div className="text-xs text-muted-foreground">Participation</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xl font-mono font-bold text-foreground">
                {data.participation.totalVoted.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Voters</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xl font-mono font-bold text-neon-green">
                {data.socialEngagement.sentiment.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Sentiment</div>
            </div>
          </div>
        </div>

        {/* Voting Power Distribution */}
        {totalVotingPower > 0 && (
          <div className="p-4 border-b border-border/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-foreground">Voting Power</h5>
                <span className="text-xs text-muted-foreground font-mono">
                  {(totalVotingPower / 1000000).toFixed(1)}M total
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex h-3 bg-muted/30 rounded-full overflow-hidden border border-border/20">
                  <div 
                    className="bg-neon-green transition-all duration-300" 
                    style={{ width: `${forPercentage}%` }}
                  ></div>
                  <div 
                    className="bg-destructive/70 transition-all duration-300" 
                    style={{ width: `${againstPercentage}%` }}
                  ></div>
                  <div 
                    className="bg-muted-foreground/40 transition-all duration-300" 
                    style={{ width: `${abstainPercentage}%` }}
                  ></div>
                </div>
                
                {/* Legend */}
                <div className="flex justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                    <span className="text-muted-foreground">For: {forPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-destructive/70"></div>
                    <span className="text-muted-foreground">Against: {againstPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40"></div>
                    <span className="text-muted-foreground">Abstain: {abstainPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demographics & Engagement */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Voter Types */}
            <div className="space-y-2">
              <h6 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Voter Types</h6>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-neon-blue/60"></div>
                    <span>New</span>
                  </div>
                  <span className="font-mono">{data.demographics.newVoters.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-neon-green/60"></div>
                    <span>Repeat</span>
                  </div>
                  <span className="font-mono">{data.demographics.repeatedVoters.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-chart-4/60"></div>
                    <span>Whales</span>
                  </div>
                  <span className="font-mono">{data.demographics.whales.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Social Engagement */}
            <div className="space-y-2">
              <h6 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Engagement</h6>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Discussions</span>
                  <span className="font-mono">{data.socialEngagement.discussions}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Endorsements</span>
                  <span className="font-mono">{data.socialEngagement.influencerEndorsements}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Impact</span>
                  <Badge variant="outline" className="text-xs px-1 py-0 h-4 border-border/30 bg-muted/10">
                    {data.impact}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeline */}
          {data.status !== 'pending' && (
            <div className="mt-4 pt-3 border-t border-border/20">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{data.startTime} → {data.endTime}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const FilterControls = ({ 
  filters, 
  onFiltersChange, 
  isMobile = false 
}: { 
  filters: FilterState; 
  onFiltersChange: (filters: FilterState) => void;
  isMobile?: boolean;
}) => {
  const categories = ['treasury', 'protocol', 'governance', 'ecosystem', 'emergency'];
  const statuses = ['active', 'passed', 'failed', 'pending'];
  const impactLevels = ['critical', 'high', 'medium', 'low'];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked 
      ? [...filters.statuses, status]
      : filters.statuses.filter(s => s !== status);
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleImpactChange = (impact: string, checked: boolean) => {
    const newImpacts = checked 
      ? [...filters.impactLevels, impact]
      : filters.impactLevels.filter(i => i !== impact);
    onFiltersChange({ ...filters, impactLevels: newImpacts });
  };

  const applyPreset = (preset: FilterPreset) => {
    onFiltersChange({ ...filters, ...preset.filters });
  };

  const clearAllFilters = () => {
    onFiltersChange(DEFAULT_FILTERS);
  };

  const hasActiveFilters = filters.search || 
    filters.categories.length > 0 || 
    filters.statuses.length > 0 || 
    filters.impactLevels.length > 0 || 
    filters.participationRange[0] > 0 || 
    filters.participationRange[1] < 100 ||
    filters.dateRange.start || 
    filters.dateRange.end ||
    filters.showOnlyActive;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center space-x-2">
          <Search className="w-4 h-4" />
          <span>Search Proposals</span>
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, DAO, or proposal ID..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange({ ...filters, search: '' })}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center space-x-2">
          <Bookmark className="w-4 h-4" />
          <span>Quick Filters</span>
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {FILTER_PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <Button
                key={preset.id}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
                className="justify-start text-left h-auto p-3 hover:bg-muted/50"
              >
                <div className="flex items-start space-x-3 w-full">
                  <Icon className="w-4 h-4 mt-0.5 text-neon-blue flex-shrink-0" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs text-muted-foreground leading-tight">{preset.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center space-x-2">
          <Target className="w-4 h-4" />
          <span>Categories</span>
          {filters.categories.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {filters.categories.length}
            </Badge>
          )}
        </Label>
        <div className="space-y-2">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <div key={category} className="flex items-center space-x-3">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label 
                  htmlFor={`category-${category}`}
                  className="flex items-center space-x-2 cursor-pointer flex-1"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{category}</span>
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Status */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center space-x-2">
          <Activity className="w-4 h-4" />
          <span>Status</span>
          {filters.statuses.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {filters.statuses.length}
            </Badge>
          )}
        </Label>
        <div className="space-y-2">
          {statuses.map((status) => (
            <div key={status} className="flex items-center space-x-3">
              <Checkbox
                id={`status-${status}`}
                checked={filters.statuses.includes(status)}
                onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
              />
              <Label 
                htmlFor={`status-${status}`}
                className="flex items-center space-x-2 cursor-pointer flex-1"
              >
                <div className={`w-2 h-2 rounded-full ${
                  status === 'active' ? 'bg-neon-blue' :
                  status === 'passed' ? 'bg-neon-green' :
                  status === 'failed' ? 'bg-destructive' :
                  'bg-muted-foreground'
                }`} />
                <span className="capitalize">{status}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Impact Level */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Impact Level</span>
          {filters.impactLevels.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {filters.impactLevels.length}
            </Badge>
          )}
        </Label>
        <div className="space-y-2">
          {impactLevels.map((impact) => (
            <div key={impact} className="flex items-center space-x-3">
              <Checkbox
                id={`impact-${impact}`}
                checked={filters.impactLevels.includes(impact)}
                onCheckedChange={(checked) => handleImpactChange(impact, checked as boolean)}
              />
              <Label 
                htmlFor={`impact-${impact}`}
                className="cursor-pointer flex-1"
              >
                <Badge variant="outline" className={`text-xs ${getImpactColor(impact)}`}>
                  {impact}
                </Badge>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Participation Rate */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center space-x-2">
          <Percent className="w-4 h-4" />
          <span>Participation Rate</span>
        </Label>
        <div className="space-y-4">
          <Slider
            value={filters.participationRange}
            onValueChange={(value) => onFiltersChange({ ...filters, participationRange: value as [number, number] })}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filters.participationRange[0]}%</span>
            <span>{filters.participationRange[1]}%</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Date Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4" />
          <span>Date Range</span>
        </Label>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label htmlFor="start-date" className="text-xs text-muted-foreground">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                dateRange: { ...filters.dateRange, start: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="end-date" className="text-xs text-muted-foreground">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Additional Options */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span>Options</span>
        </Label>
        <div className="flex items-center space-x-3">
          <Checkbox
            id="show-only-active"
            checked={filters.showOnlyActive}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, showOnlyActive: checked as boolean })}
          />
          <Label htmlFor="show-only-active" className="cursor-pointer">
            Show only active proposals
          </Label>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );
};

const SortingControls = ({ 
  filters, 
  onFiltersChange 
}: { 
  filters: FilterState; 
  onFiltersChange: (filters: FilterState) => void;
}) => {
  const sortOptions = [
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'participation', label: 'Participation', icon: Users },
    { value: 'impact', label: 'Impact', icon: AlertTriangle },
    { value: 'sentiment', label: 'Sentiment', icon: Star }
  ];

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="border-border/50 hover:border-neon-blue/30">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Sort by {sortOptions.find(opt => opt.value === filters.sortBy)?.label}
            <ChevronDown className="w-3 h-3 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <div className="space-y-1">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.value}
                  variant={filters.sortBy === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, sortBy: option.value as any })}
                  className="w-full justify-start"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {option.label}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onFiltersChange({ 
          ...filters, 
          sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
        })}
        className="border-border/50 hover:border-neon-green/30"
      >
        <TrendingUp className={`w-4 h-4 transition-transform ${filters.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
      </Button>
    </div>
  );
};

export function GovernanceHeatmap() {
  const [viewMode, setViewMode] = useState<'heatmap' | 'trends' | 'analytics'>('heatmap');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useState(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  const filteredData = useMemo(() => {
    return mockGovernanceData.filter(item => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!item.title.toLowerCase().includes(searchLower) &&
            !item.dao.toLowerCase().includes(searchLower) &&
            !item.proposalId.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
        return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(item.status)) {
        return false;
      }

      // Impact filter
      if (filters.impactLevels.length > 0 && !filters.impactLevels.includes(item.impact)) {
        return false;
      }

      // Participation rate filter
      if (item.participation.participationRate < filters.participationRange[0] ||
          item.participation.participationRate > filters.participationRange[1]) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start && new Date(item.startTime) < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && new Date(item.endTime) > new Date(filters.dateRange.end)) {
        return false;
      }

      // Show only active filter
      if (filters.showOnlyActive && item.status !== 'active') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          break;
        case 'participation':
          comparison = a.participation.participationRate - b.participation.participationRate;
          break;
        case 'impact':
          comparison = getImpactWeight(a.impact) - getImpactWeight(b.impact);
          break;
        case 'sentiment':
          comparison = a.socialEngagement.sentiment - b.socialEngagement.sentiment;
          break;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [filters]);

  const stats = useMemo(() => ({
    totalProposals: filteredData.length,
    avgParticipation: filteredData.length > 0 
      ? Math.round(filteredData.reduce((sum, d) => sum + d.participation.participationRate, 0) / filteredData.length)
      : 0,
    activeProposals: filteredData.filter(d => d.status === 'active').length,
    totalVoters: filteredData.reduce((sum, d) => sum + d.participation.totalVoted, 0)
  }), [filteredData]);

  const hasActiveFilters = filters.search || 
    filters.categories.length > 0 || 
    filters.statuses.length > 0 || 
    filters.impactLevels.length > 0 || 
    filters.participationRange[0] > 0 || 
    filters.participationRange[1] < 100 ||
    filters.dateRange.start || 
    filters.dateRange.end ||
    filters.showOnlyActive;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl font-medium">Governance Heatmap</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive visualization of DAO governance participation and voting patterns
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'heatmap' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('heatmap')}
            className={viewMode === 'heatmap' ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue' : ''}
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Heatmap
          </Button>
          <Button
            variant={viewMode === 'trends' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('trends')}
            className={viewMode === 'trends' ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue' : ''}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Trends
          </Button>
          <Button
            variant={viewMode === 'analytics' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('analytics')}
            className={viewMode === 'analytics' ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue' : ''}
          >
            <PieChart className="w-3 h-3 mr-1" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-foreground">{stats.totalProposals}</div>
            <div className="text-xs text-muted-foreground">
              {hasActiveFilters ? 'Filtered' : 'Total'} Proposals
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-neon-green">{stats.avgParticipation}%</div>
            <div className="text-xs text-muted-foreground">Avg Participation</div>
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-neon-blue">{stats.activeProposals}</div>
            <div className="text-xs text-muted-foreground">Active Now</div>
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-foreground">{stats.totalVoters.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Voters</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Filter Drawer */}
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-border/50 hover:border-neon-blue/30">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                      {[
                        filters.search && 1,
                        filters.categories.length,
                        filters.statuses.length,
                        filters.impactLevels.length,
                        (filters.participationRange[0] > 0 || filters.participationRange[1] < 100) && 1,
                        (filters.dateRange.start || filters.dateRange.end) && 1,
                        filters.showOnlyActive && 1
                      ].filter(Boolean).reduce((sum: number, val) => sum + (typeof val === 'number' ? val : 0), 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-80">
                <SheetHeader>
                  <SheetTitle>Filter Proposals</SheetTitle>
                  <SheetDescription>
                    Customize the view to focus on specific proposals
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <FilterControls 
                    filters={filters} 
                    onFiltersChange={setFilters}
                    isMobile={true}
                  />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            /* Desktop Filter Popover */
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-border/50 hover:border-neon-blue/30">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                      {[
                        filters.search && 1,
                        filters.categories.length,
                        filters.statuses.length,
                        filters.impactLevels.length,
                        (filters.participationRange[0] > 0 || filters.participationRange[1] < 100) && 1,
                        (filters.dateRange.start || filters.dateRange.end) && 1,
                        filters.showOnlyActive && 1
                      ].filter(Boolean).reduce((sum: number, val) => sum + (typeof val === 'number' ? val : 0), 0)}
                    </Badge>
                  )}
                  <ChevronDown className="w-3 h-3 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 max-h-[600px] overflow-y-auto" align="start">
                <FilterControls 
                  filters={filters} 
                  onFiltersChange={setFilters}
                />
              </PopoverContent>
            </Popover>
          )}

          <SortingControls filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="flex items-center space-x-2">
          {filteredData.length !== mockGovernanceData.length && (
            <Badge variant="outline" className="text-xs border-neon-green/30 text-neon-green">
              {filteredData.length} of {mockGovernanceData.length} proposals
            </Badge>
          )}
          
          <Button variant="outline" size="sm">
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'heatmap' && (
        <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-neon-blue" />
              </div>
              <span className="text-foreground">Participation Heatmap</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/10 flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">No proposals found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your filters to see more results
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                {filteredData.map((proposal) => (
                  <HeatmapCell key={proposal.proposalId} data={proposal} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Other view modes placeholder */}
      {viewMode === 'trends' && (
        <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
          <CardContent className="p-8 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Trends View</h3>
            <p className="text-sm text-muted-foreground">
              Participation trends visualization coming soon
            </p>
          </CardContent>
        </Card>
      )}

      {viewMode === 'analytics' && (
        <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
          <CardContent className="p-8 text-center">
            <PieChart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Analytics View</h3>
            <p className="text-sm text-muted-foreground">
              Advanced analytics dashboard coming soon
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { 
  Shield, 
  Star, 
  TrendingUp, 
  Users, 
  Award, 
  Zap, 
  Eye, 
  Heart,
  MessageSquare,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Target,
  Activity
} from "lucide-react";

interface ReputationProfile {
  zkId: string;
  ens?: string;
  avatar?: string;
  verificationLevel: 'basic' | 'verified' | 'elite' | 'legendary';
  civicScore: number;
  communityRank: number;
  totalContributions: number;
  endorsements: number;
  followers: number;
  badges: {
    id: string;
    name: string;
    description: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    earnedDate: string;
  }[];
  socialMetrics: {
    trustScore: number;
    influenceScore: number;
    participationScore: number;
    transparencyScore: number;
  };
  recentActivity: {
    type: 'vote' | 'proposal' | 'endorsement' | 'contribution';
    description: string;
    timestamp: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  proofCredentials: {
    kyc: boolean;
    soulbound: boolean;
    dao_member: string[];
    validator: boolean;
    developer: boolean;
  };
}

const mockProfile: ReputationProfile = {
  zkId: "zk1234567890abcdef",
  ens: "alice.eth",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b172?w=150&h=150&fit=crop&crop=face",
  verificationLevel: 'verified',
  civicScore: 847,
  communityRank: 234,
  totalContributions: 1247,
  endorsements: 89,
  followers: 3421,
  badges: [
    {
      id: 'governance-expert',
      name: 'Governance Expert',
      description: 'Participated in 50+ DAO votes with high accuracy',
      rarity: 'epic',
      earnedDate: '2024-01-15'
    },
    {
      id: 'civic-champion',
      name: 'Civic Champion',
      description: 'Top 1% civic reputation score',
      rarity: 'legendary',
      earnedDate: '2024-02-10'
    },
    {
      id: 'community-builder',
      name: 'Community Builder',
      description: 'Brought 100+ members to the platform',
      rarity: 'rare',
      earnedDate: '2024-01-28'
    }
  ],
  socialMetrics: {
    trustScore: 94,
    influenceScore: 87,
    participationScore: 92,
    transparencyScore: 96
  },
  recentActivity: [
    {
      type: 'vote',
      description: 'Voted on Uniswap V4 Governance Proposal',
      timestamp: '2h ago',
      impact: 'high'
    },
    {
      type: 'endorsement',
      description: 'Endorsed validator node performance',
      timestamp: '6h ago',
      impact: 'medium'
    },
    {
      type: 'contribution',
      description: 'Submitted security audit for DeFi protocol',
      timestamp: '1d ago',
      impact: 'high'
    }
  ],
  proofCredentials: {
    kyc: true,
    soulbound: true,
    dao_member: ['Uniswap', 'Compound', 'AAVE'],
    validator: false,
    developer: true
  }
};

const getBadgeRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'border-neon-magenta/50 bg-neon-magenta/10 text-neon-magenta';
    case 'epic': return 'border-neon-blue/50 bg-neon-blue/10 text-neon-blue';
    case 'rare': return 'border-neon-green/50 bg-neon-green/10 text-neon-green';
    default: return 'border-muted-foreground/30 bg-muted/10 text-muted-foreground';
  }
};

const getVerificationColor = (level: string) => {
  switch (level) {
    case 'legendary': return 'text-neon-magenta border-neon-magenta/30 bg-neon-magenta/10';
    case 'elite': return 'text-neon-blue border-neon-blue/30 bg-neon-blue/10';
    case 'verified': return 'text-neon-green border-neon-green/30 bg-neon-green/10';
    default: return 'text-muted-foreground border-border/30 bg-muted/10';
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'vote': return <Shield className="w-3 h-3" />;
    case 'proposal': return <MessageSquare className="w-3 h-3" />;
    case 'endorsement': return <Star className="w-3 h-3" />;
    case 'contribution': return <Award className="w-3 h-3" />;
    default: return <Activity className="w-3 h-3" />;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'text-neon-green';
    case 'medium': return 'text-chart-4';
    default: return 'text-muted-foreground';
  }
};

interface MiniReputationBadgeProps {
  profile: ReputationProfile;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  onClick?: () => void;
}

export function MiniReputationBadge({ profile, size = 'sm', showScore = true, onClick }: MiniReputationBadgeProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
          >
            <div className="relative">
              <Avatar className={sizeClasses[size]}>
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-neon-blue/20 to-neon-green/20">
                  {profile.ens?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              {/* zkID Verification Badge */}
              <div className="absolute -bottom-1 -right-1">
                <div className={`w-4 h-4 rounded-full border-2 border-background flex items-center justify-center ${getVerificationColor(profile.verificationLevel)}`}>
                  <Shield className="w-2 h-2" />
                </div>
              </div>
            </div>

            {showScore && (
              <div className="flex flex-col">
                <span className="text-xs font-mono font-medium text-neon-blue">
                  {profile.civicScore}
                </span>
                <span className="text-xs text-muted-foreground">
                  #{profile.communityRank}
                </span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-0">
          <ReputationTooltip profile={profile} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ReputationTooltip({ profile }: { profile: ReputationProfile }) {
  return (
    <Card className="w-80 border-border/50">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-neon-blue/20 to-neon-green/20">
              {profile.ens?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{profile.ens || 'Anonymous'}</span>
              <Badge variant="outline" className={`text-xs ${getVerificationColor(profile.verificationLevel)}`}>
                <Shield className="w-3 h-3 mr-1" />
                {profile.verificationLevel}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {profile.zkId.slice(0, 16)}...
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-3 p-2 bg-muted/10 rounded">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-neon-blue">{profile.civicScore}</div>
            <div className="text-xs text-muted-foreground">Civic</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-neon-green">#{profile.communityRank}</div>
            <div className="text-xs text-muted-foreground">Rank</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-chart-4">{profile.endorsements}</div>
            <div className="text-xs text-muted-foreground">Endorse</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-chart-5">{profile.socialMetrics.trustScore}%</div>
            <div className="text-xs text-muted-foreground">Trust</div>
          </div>
        </div>

        {/* Top Badges */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Top Badges</div>
          <div className="flex flex-wrap gap-1">
            {profile.badges.slice(0, 3).map((badge) => (
              <Badge 
                key={badge.id} 
                variant="outline" 
                className={`text-xs ${getBadgeRarityColor(badge.rarity)}`}
              >
                <Award className="w-3 h-3 mr-1" />
                {badge.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Proof Credentials */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Verifications</div>
          <div className="flex flex-wrap gap-1">
            {profile.proofCredentials.kyc && (
              <Badge variant="outline" className="text-xs text-neon-green border-neon-green/30 bg-neon-green/10">
                <CheckCircle className="w-3 h-3 mr-1" />
                KYC
              </Badge>
            )}
            {profile.proofCredentials.soulbound && (
              <Badge variant="outline" className="text-xs text-neon-blue border-neon-blue/30 bg-neon-blue/10">
                <Sparkles className="w-3 h-3 mr-1" />
                Soulbound
              </Badge>
            )}
            {profile.proofCredentials.developer && (
              <Badge variant="outline" className="text-xs text-chart-4 border-chart-4/30 bg-chart-4/10">
                <Target className="w-3 h-3 mr-1" />
                Dev
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FullReputationProfile({ profile }: { profile: ReputationProfile }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'activity' | 'social'>('overview');

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-neon-blue/20 to-neon-green/20 text-xl">
                    {profile.ens?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {/* Verification Level Ring */}
                <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent bg-gradient-to-r from-neon-blue via-neon-green to-neon-magenta p-1">
                  <div className="w-full h-full rounded-full bg-card"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-medium">{profile.ens || 'Anonymous User'}</h1>
                  <Badge variant="outline" className={`${getVerificationColor(profile.verificationLevel)}`}>
                    <Shield className="w-4 h-4 mr-1" />
                    {profile.verificationLevel}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground font-mono">
                  zkID: {profile.zkId}
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.followers.toLocaleString()} followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.endorsements} endorsements</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.totalContributions.toLocaleString()} contributions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
                <Heart className="w-3 h-3 mr-1" />
                Follow
              </Button>
              <Button variant="outline" size="sm" className="border-neon-green/30 text-neon-green hover:bg-neon-green/10">
                <Star className="w-3 h-3 mr-1" />
                Endorse
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-3 h-3 mr-1" />
                Message
              </Button>
            </div>
          </div>

          {/* Civic Score Progress */}
          <div className="mt-6 p-4 bg-muted/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Civic Reputation Score</span>
              <span className="text-lg font-mono font-bold text-neon-blue">{profile.civicScore}/1000</span>
            </div>
            <Progress value={profile.civicScore / 10} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Community Rank: #{profile.communityRank.toLocaleString()}</span>
              <span>Top {Math.round((profile.communityRank / 100000) * 100)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 bg-muted/10 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'badges', label: 'Badges', icon: Award },
          { id: 'activity', label: 'Activity', icon: Activity },
          { id: 'social', label: 'Social', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 ${
                activeTab === tab.id 
                  ? 'bg-neon-blue/20 border-neon-blue/30 text-neon-blue' 
                  : 'hover:bg-muted/20'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Social Metrics */}
            <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Social Metrics</h3>
                <div className="space-y-4">
                  {Object.entries(profile.socialMetrics).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{key.replace('Score', '')} Score</span>
                        <span className="font-mono">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Proof Credentials */}
            <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Verifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/5 rounded border border-border/10">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-neon-green" />
                      <span>KYC Verified</span>
                    </div>
                    {profile.proofCredentials.kyc && <Badge variant="outline" className="text-neon-green border-neon-green/30 bg-neon-green/10">Verified</Badge>}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/5 rounded border border-border/10">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-neon-blue" />
                      <span>Soulbound Token</span>
                    </div>
                    {profile.proofCredentials.soulbound && <Badge variant="outline" className="text-neon-blue border-neon-blue/30 bg-neon-blue/10">Active</Badge>}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/5 rounded border border-border/10">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-chart-4" />
                      <span>DAO Memberships</span>
                    </div>
                    <Badge variant="outline">{profile.proofCredentials.dao_member.length} DAOs</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'badges' && (
          <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Achievement Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.badges.map((badge) => (
                  <div key={badge.id} className={`p-4 rounded-lg border-2 ${getBadgeRarityColor(badge.rarity)}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-5 h-5" />
                      <span className="font-medium">{badge.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className={getBadgeRarityColor(badge.rarity)}>
                        {badge.rarity}
                      </Badge>
                      <span className="text-muted-foreground">{badge.earnedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'activity' && (
          <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {profile.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/5 rounded border border-border/10">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full bg-muted/20`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <div className="font-medium">{activity.description}</div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{activity.timestamp}</span>
                          <div className={`w-2 h-2 rounded-full ${getImpactColor(activity.impact)}`}></div>
                          <span className="capitalize">{activity.impact} impact</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Export both the mini badge component and full profile for different use cases
export { mockProfile };
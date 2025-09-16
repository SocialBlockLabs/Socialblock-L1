import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { ProfileDrawer } from "./ProfileDrawer";
import { 
  Star,
  Shield,
  Users,
  Code,
  Vote,
  Heart,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Calendar,
  Activity,
  Award,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Zap,
  Target,
  Eye,
  Clock
} from "lucide-react";

type RepType = 'validator' | 'civic' | 'social' | 'builder' | 'voter';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ARPProfile {
  address: string;
  sbId: string;
  ens?: string;
  avatar?: string;
  totalScore: number;
  starLevel: 1 | 2 | 3 | 4 | 5;
  primaryType: RepType;
  secondaryTypes?: RepType[];
  typeScores: {
    validator: number;
    civic: number;
    social: number;
    builder: number;
    voter: number;
  };
  lastScoreChange: {
    amount: number;
    timestamp: string;
    reason: string;
    type: 'increase' | 'decrease';
  };
  recentActivity: {
    timestamp: string;
    type: string;
    description: string;
    scoreImpact: number;
  }[];
  achievements: {
    id: string;
    name: string;
    description: string;
    earnedDate: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }[];
  stats: {
    totalContributions: number;
    communityEndorsements: number;
    streak: number;
    rank: number;
    percentile: number;
  };
  isVerified: boolean;
  sbIdProfileUrl: string;
}

const repTypeConfig = {
  validator: {
    icon: Shield,
    label: 'Validator',
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/10',
    borderColor: 'border-neon-blue/30',
    description: 'Network validation and security'
  },
  civic: {
    icon: Heart,
    label: 'Civic',
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/10',
    borderColor: 'border-neon-green/30',
    description: 'Community governance participation'
  },
  social: {
    icon: Users,
    label: 'Social',
    color: 'text-neon-magenta',
    bgColor: 'bg-neon-magenta/10',
    borderColor: 'border-neon-magenta/30',
    description: 'Social engagement and networking'
  },
  builder: {
    icon: Code,
    label: 'Builder',
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
    borderColor: 'border-chart-4/30',
    description: 'Protocol development and innovation'
  },
  voter: {
    icon: Vote,
    label: 'Voter',
    color: 'text-chart-5',
    bgColor: 'bg-chart-5/10',
    borderColor: 'border-chart-5/30',
    description: 'Governance voting participation'
  }
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'text-neon-magenta border-neon-magenta/30 bg-neon-magenta/10';
    case 'epic': return 'text-neon-blue border-neon-blue/30 bg-neon-blue/10';
    case 'rare': return 'text-neon-green border-neon-green/30 bg-neon-green/10';
    default: return 'text-muted-foreground border-border/30 bg-muted/10';
  }
};

const getStarColor = (level: number, index: number) => {
  if (index < level) {
    switch (level) {
      case 5: return 'text-neon-magenta';
      case 4: return 'text-neon-blue';
      case 3: return 'text-neon-green';
      case 2: return 'text-chart-4';
      default: return 'text-chart-5';
    }
  }
  return 'text-muted-foreground/30';
};

const getBadgeSize = (size: Size) => {
  switch (size) {
    case 'sm': return { container: 'w-8 h-8', star: 'w-2 h-2', icon: 'w-3 h-3' };
    case 'md': return { container: 'w-10 h-10', star: 'w-2.5 h-2.5', icon: 'w-4 h-4' };
    case 'lg': return { container: 'w-12 h-12', star: 'w-3 h-3', icon: 'w-5 h-5' };
    case 'xl': return { container: 'w-16 h-16', star: 'w-4 h-4', icon: 'w-6 h-6' };
    default: return { container: 'w-10 h-10', star: 'w-2.5 h-2.5', icon: 'w-4 h-4' };
  }
};

const ARPModal = ({ profile }: { profile: ARPProfile }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'history' | 'achievements'>('overview');
  const primaryTypeConfig = repTypeConfig[profile.primaryType];

  return (
    <Card className="w-96 max-h-[80vh] overflow-hidden border-border/50 bg-card/95 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-neon-blue/20 to-neon-green/20">
                {profile.ens?.charAt(0).toUpperCase() || profile.address?.slice(2, 4).toUpperCase() || 'SB'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <CardTitle className="text-lg flex items-center space-x-2">
                <span>{profile.ens || `${profile.address?.slice(0, 6) || '0x0000'}...${profile.address?.slice(-4) || '0000'}`}</span>
                {profile.isVerified && (
                  <div className="w-5 h-5 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center">
                    <Shield className="w-3 h-3 text-neon-green" />
                  </div>
                )}
              </CardTitle>
              
              <div className="flex items-center space-x-2 mt-1">
                {/* Star Rating */}
                <div className="flex items-center space-x-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${getStarColor(profile.starLevel, star)} ${
                        star <= profile.starLevel ? 'fill-current' : ''
                      }`}
                    />
                  ))}
                </div>
                
                <Badge variant="outline" className={`text-xs ${primaryTypeConfig.color} ${primaryTypeConfig.borderColor} ${primaryTypeConfig.bgColor}`}>
                  <primaryTypeConfig.icon className="w-3 h-3 mr-1" />
                  {primaryTypeConfig.label}
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-neon-blue">{profile.totalScore}</div>
            <div className="text-xs text-muted-foreground">ARP Score</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 p-3 bg-muted/10 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-neon-green">#{profile.stats.rank}</div>
            <div className="text-xs text-muted-foreground">Rank</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-chart-4">{profile.stats.percentile}%</div>
            <div className="text-xs text-muted-foreground">Percentile</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-chart-5">{profile.stats.streak}d</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
        </div>

        {/* Last Score Change */}
        <div className="flex items-center justify-between p-2 bg-muted/5 rounded border border-border/20">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded ${profile.lastScoreChange.type === 'increase' ? 'bg-neon-green/10' : 'bg-chart-3/10'}`}>
              {profile.lastScoreChange.type === 'increase' ? (
                <TrendingUp className={`w-3 h-3 ${profile.lastScoreChange.type === 'increase' ? 'text-neon-green' : 'text-chart-3'}`} />
              ) : (
                <TrendingDown className={`w-3 h-3 ${profile.lastScoreChange.type === 'increase' ? 'text-neon-green' : 'text-chart-3'}`} />
              )}
            </div>
            <div>
              <div className="text-sm font-medium">
                {profile.lastScoreChange.type === 'increase' ? '+' : ''}{profile.lastScoreChange.amount} points
              </div>
              <div className="text-xs text-muted-foreground">{profile.lastScoreChange.reason}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">{profile.lastScoreChange.timestamp}</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 max-h-64 overflow-y-auto">
        {/* Section Tabs */}
        <div className="flex items-center space-x-1 bg-muted/10 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'achievements', label: 'Badges', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeSection === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex-1 text-xs ${
                  activeSection === tab.id 
                    ? 'bg-neon-blue/20 border-neon-blue/30 text-neon-blue' 
                    : 'hover:bg-muted/20'
                }`}
              >
                <Icon className="w-3 h-3 mr-1" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Content Sections */}
        {activeSection === 'overview' && (
          <div className="space-y-4">
            {/* Rep Type Breakdown */}
            <div>
              <h4 className="text-sm font-medium mb-3">Reputation Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(profile.typeScores).map(([type, score]) => {
                  const config = repTypeConfig[type as RepType];
                  const percentage = (score / 1000) * 100;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <config.icon className={`w-3 h-3 ${config.color}`} />
                          <span>{config.label}</span>
                        </div>
                        <span className="font-mono">{score}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Community Stats */}
            <div>
              <h4 className="text-sm font-medium mb-3">Community Impact</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-neon-blue" />
                  <span>{profile.stats.totalContributions} contributions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-neon-magenta" />
                  <span>{profile.stats.communityEndorsements} endorsements</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'history' && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Recent Activity</h4>
            {profile.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start justify-between p-2 bg-muted/5 rounded border border-border/10">
                <div className="flex-1">
                  <div className="text-sm font-medium">{activity.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{activity.timestamp}</div>
                </div>
                <div className={`text-xs font-mono px-2 py-1 rounded ${
                  activity.scoreImpact > 0 ? 'text-neon-green bg-neon-green/10' : 
                  activity.scoreImpact < 0 ? 'text-chart-3 bg-chart-3/10' : 
                  'text-muted-foreground bg-muted/10'
                }`}>
                  {activity.scoreImpact > 0 ? '+' : ''}{activity.scoreImpact}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'achievements' && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Achievement Badges</h4>
            <div className="grid grid-cols-1 gap-2">
              {profile.achievements.map((achievement) => (
                <div key={achievement.id} className={`p-3 rounded-lg border ${getRarityColor(achievement.rarity)}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">{achievement.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                  <div className="flex justify-between items-center text-xs">
                    <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    <span className="text-muted-foreground">{achievement.earnedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SBID Profile Link */}
        <Separator />
        <Button
          variant="outline"
          size="sm"
          className="w-full border-neon-green/30 text-neon-green hover:bg-neon-green/10"
          onClick={() => window.open(profile.sbIdProfileUrl, '_blank')}
        >
          <ExternalLink className="w-3 h-3 mr-2" />
          View SBID Profile
        </Button>
      </CardContent>
    </Card>
  );
};

interface ARPBadgeProps {
  profile: ARPProfile;
  size?: Size;
  showLabel?: boolean;
  className?: string;
}

export function ARPBadge({ profile, size = 'md', showLabel = false, className = '' }: ARPBadgeProps) {
  const sizeConfig = getBadgeSize(size);
  const primaryTypeConfig = repTypeConfig[profile.primaryType];

  // For small badges, use hover card; for larger ones, use profile drawer
  const useDrawer = size === 'md' || size === 'lg' || size === 'xl';

  const badgeContent = (
    <div className={`inline-flex items-center space-x-2 cursor-pointer group ${className}`}>
      {/* Main Badge */}
      <div 
        className={`
          ${sizeConfig.container} 
          relative rounded-full border-2 ${primaryTypeConfig.borderColor} 
          ${primaryTypeConfig.bgColor} 
          flex items-center justify-center 
          transition-all duration-300 
          group-hover:scale-110 
          group-hover:shadow-lg
        `}
        style={{
          boxShadow: profile.starLevel >= 4 
            ? `0 0 ${size === 'sm' ? '6px' : size === 'md' ? '8px' : '12px'} ${primaryTypeConfig.color.includes('neon-blue') ? 'rgba(0, 245, 255, 0.3)' : primaryTypeConfig.color.includes('neon-green') ? 'rgba(0, 255, 65, 0.3)' : primaryTypeConfig.color.includes('neon-magenta') ? 'rgba(255, 0, 255, 0.3)' : 'rgba(136, 136, 136, 0.2)'}` 
            : 'none'
        }}
      >
        {/* Primary Type Icon */}
        <primaryTypeConfig.icon className={`${sizeConfig.icon} ${primaryTypeConfig.color}`} />
        
        {/* Star Level Indicator */}
        <div className="absolute -top-1 -right-1 flex items-center space-x-0.5">
          <div className={`
            w-4 h-4 rounded-full border ${primaryTypeConfig.borderColor} 
            ${primaryTypeConfig.bgColor} flex items-center justify-center
          `}>
            <Star 
              className={`w-2 h-2 ${getStarColor(profile.starLevel, 1)} ${
                profile.starLevel >= 1 ? 'fill-current' : ''
              }`} 
            />
          </div>
        </div>

        {/* Verification Badge */}
        {profile.isVerified && (
          <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-neon-green border border-background flex items-center justify-center">
            <Shield className="w-1.5 h-1.5 text-background" />
          </div>
        )}

        {/* Pulse animation for high-level badges */}
        {profile.starLevel >= 4 && (
          <div className={`
            absolute inset-0 rounded-full border-2 ${primaryTypeConfig.borderColor} 
            animate-pulse opacity-50
          `}></div>
        )}
      </div>

      {/* Optional Label */}
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{primaryTypeConfig.label}</span>
          <div className="flex items-center space-x-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-2 h-2 ${getStarColor(profile.starLevel, star)} ${
                  star <= profile.starLevel ? 'fill-current' : ''
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (useDrawer) {
    return (
      <ProfileDrawer 
        profile={profile}
        trigger={badgeContent}
      />
    );
  }

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        {badgeContent}
      </HoverCardTrigger>
      
      <HoverCardContent 
        side="top" 
        align="center" 
        className="p-0 w-auto border-0 bg-transparent"
        sideOffset={8}
      >
        <ARPModal profile={profile} />
      </HoverCardContent>
    </HoverCard>
  );
}

// Helper function to generate mock ARP profiles
export const generateMockARPProfile = (
  address?: string, 
  overrides: Partial<ARPProfile> = {}
): ARPProfile => {
  // Generate a default address if none provided
  const defaultAddress = address || `sblk${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`;
  
  const mockProfile: ARPProfile = {
    address: defaultAddress,
    sbId: `sb${defaultAddress.slice(2, 18)}`,
    totalScore: Math.floor(Math.random() * 1000) + 200,
    starLevel: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5,
    primaryType: ['validator', 'civic', 'social', 'builder', 'voter'][Math.floor(Math.random() * 5)] as RepType,
    typeScores: {
      validator: Math.floor(Math.random() * 300),
      civic: Math.floor(Math.random() * 300),
      social: Math.floor(Math.random() * 300),
      builder: Math.floor(Math.random() * 300),
      voter: Math.floor(Math.random() * 300)
    },
    lastScoreChange: {
      amount: Math.floor(Math.random() * 20) - 10,
      timestamp: '2h ago',
      reason: 'DAO participation',
      type: Math.random() > 0.5 ? 'increase' : 'decrease'
    },
    recentActivity: [
      {
        timestamp: '2h ago',
        type: 'governance',
        description: 'Voted on governance proposal',
        scoreImpact: 5
      },
      {
        timestamp: '1d ago',
        type: 'social',
        description: 'Community endorsement received',
        scoreImpact: 10
      },
      {
        timestamp: '3d ago',
        type: 'validation',
        description: 'Block validation completed',
        scoreImpact: 3
      }
    ],
    achievements: [
      {
        id: 'early-adopter',
        name: 'Early Adopter',
        description: 'Among the first 1000 users',
        earnedDate: '2024-01-15',
        rarity: 'rare'
      },
      {
        id: 'governance-guru',
        name: 'Governance Guru',
        description: 'Participated in 50+ votes',
        earnedDate: '2024-03-22',
        rarity: 'epic'
      }
    ],
    stats: {
      totalContributions: Math.floor(Math.random() * 100) + 10,
      communityEndorsements: Math.floor(Math.random() * 50) + 5,
      streak: Math.floor(Math.random() * 30) + 1,
      rank: Math.floor(Math.random() * 10000) + 100,
      percentile: Math.floor(Math.random() * 99) + 1
    },
    isVerified: Math.random() > 0.3,
    sbIdProfileUrl: `https://sbid.protocol/profile/${defaultAddress}`,
    ...overrides
  };

  return mockProfile;
};

export { repTypeConfig, type ARPProfile, type RepType };
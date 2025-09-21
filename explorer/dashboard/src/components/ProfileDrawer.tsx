import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrustScoreMeter } from "./TrustScoreMeter";
import { VerificationBadges } from "./VerificationBadges";
import { ARPProfile, repTypeConfig } from "./ARPBadge";
import { 
  User, 
  Flag, 
  Eye, 
  ExternalLink, 
  Copy, 
  Heart, 
  UserPlus, 
  UserMinus,
  Shield,
  Globe,
  Calendar,
  MapPin,
  Link,
  Activity,
  TrendingUp,
  Award,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Fingerprint,
  Lock,
  Zap,
  Bot,
  BarChart3
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ProfileDrawerProps {
  profile: ARPProfile;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  onFollow?: (following: boolean) => void;
  onFlag?: () => void;
  onViewProof?: () => void;
}

interface ExternalLink {
  type: 'ceramic' | 'didx' | 'ens' | 'website' | 'github' | 'twitter';
  url: string;
  verified: boolean;
}

// Mock external links data
const generateExternalLinks = (profile: ARPProfile): ExternalLink[] => [
  {
    type: 'ceramic',
    url: `https://ceramic.network/profile/${profile.sbId}`,
    verified: true
  },
  {
    type: 'didx',
    url: `https://identity.foundation/didx/${profile.address}`,
    verified: profile.isVerified
  },
  {
    type: 'ens',
    url: profile.ens ? `https://app.ens.domains/name/${profile.ens}` : '',
    verified: !!profile.ens
  }
];

export function ProfileDrawer({ 
  profile, 
  trigger, 
  children, 
  onFollow, 
  onFlag, 
  onViewProof 
}: ProfileDrawerProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isOpen, setIsOpen] = useState(false);

  const handleFollow = () => {
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    onFollow?.(newFollowingState);
    toast(newFollowingState ? "Following user" : "Unfollowed user");
  };

  const handleFlag = () => {
    onFlag?.();
    toast("User flagged for review");
  };

  const handleViewProof = () => {
    onViewProof?.();
    // SocialBlock's own verification system
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  };

  const externalLinks = generateExternalLinks(profile);
  const trustScore = Math.floor((profile.totalScore / 10000) * 100);
  const primaryTypeConfig = repTypeConfig[profile.primaryType];

  // Mock verification data
  const verifications = [
    { id: 'sbid', type: 'sbid' as const, verified: true, provider: 'Civic', confidence: 98, timestamp: '2024-01-15' },
    { id: 'civic', type: 'civic' as const, verified: profile.isVerified, provider: 'Civic', confidence: 95, timestamp: '2024-02-10' },
    { id: 'ens', type: 'ens' as const, verified: !!profile.ens, provider: 'ENS', confidence: 100, timestamp: '2024-01-20' },
    { id: 'ceramic', type: 'ceramic' as const, verified: true, provider: 'Ceramic', confidence: 92, timestamp: '2024-03-05' },
    { id: 'social', type: 'social' as const, verified: Math.random() > 0.3, provider: 'Twitter', confidence: 88, timestamp: '2024-02-28' },
  ];

  const SheetWrapper = trigger ? Sheet : 'div';
  const wrapperProps = trigger ? { open: isOpen, onOpenChange: setIsOpen } : {};

  const drawerContent = (
    <SheetContent 
      side="right" 
      className="w-full sm:w-[800px] md:w-[1200px] lg:w-[1400px] xl:w-[1600px] 2xl:w-[1800px] max-w-[90vw] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/50 p-0"
    >
      {/* Enhanced Header with better spacing */}
      <SheetHeader className="px-8 py-6 pb-4 border-b border-border/30 sticky top-0 bg-card/95 backdrop-blur-xl z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SheetTitle className="text-xl md:text-2xl flex items-center space-x-3">
              <User className="w-6 h-6 text-neon-blue flex-shrink-0" />
              <span>Identity Profile</span>
            </SheetTitle>
            <SheetDescription className="text-sm md:text-base text-muted-foreground">
              View detailed SBID profile, reputation scores, and verification status
            </SheetDescription>
          </div>
          <Badge variant="outline" className="text-xs md:text-sm border-neon-green/30 text-neon-green bg-neon-green/10 px-3 py-1.5">
            <Activity className="w-4 h-4 mr-2" />
            Live Profile
          </Badge>
        </div>
      </SheetHeader>

      {/* Scrollable Content Area */}
      <div className="px-8 py-8 space-y-8 max-w-none">
        {/* Enhanced Profile Header */}
        <div className="space-y-6">
          {/* Avatar and Basic Info - Improved Layout */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative flex-shrink-0">
              <Avatar className="w-24 h-24 md:w-28 md:h-28 border-3 border-neon-blue/30 ring-2 ring-neon-blue/10">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-neon-blue/20 to-neon-green/20 text-xl md:text-2xl font-bold">
                  {profile.ens?.charAt(0).toUpperCase() || profile.address.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* Primary type indicator - Enhanced */}
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-background ${primaryTypeConfig.bgColor} ${primaryTypeConfig.borderColor} flex items-center justify-center shadow-lg`}>
                <primaryTypeConfig.icon className={`w-5 h-5 md:w-6 md:h-6 ${primaryTypeConfig.color}`} />
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-xl md:text-2xl font-bold">
                    {profile.ens || `${profile.address.slice(0, 8)}...${profile.address.slice(-6)}`}
                  </h2>
                  {profile.isVerified && (
                    <CheckCircle className="w-6 h-6 text-neon-green flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Fingerprint className="w-4 h-4 flex-shrink-0" />
                    <span className="font-mono">{profile.sbId}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-neon-blue/10"
                      onClick={() => copyToClipboard(profile.sbId)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Trust Score - Better positioning */}
              <div className="flex justify-start">
                <TrustScoreMeter score={trustScore} size="md" />
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              onClick={handleFollow}
              size="default"
              className={`flex-1 min-h-[40px] text-sm ${
                isFollowing 
                  ? 'bg-muted hover:bg-muted/80 text-foreground' 
                  : 'bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
              }`}
            >
              {isFollowing ? <UserMinus className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
            
            <Button
              variant="outline"
              size="default"
              onClick={handleViewProof}
              className="flex-1 sm:flex-initial min-h-[40px] text-sm border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Proof
            </Button>
            
            <Button
              variant="outline"
              size="default"
              onClick={handleFlag}
              className="w-full sm:w-auto min-h-[40px] px-4 border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Flag className="w-4 h-4" />
            </Button>
          </div>

          {/* Enhanced Verification Badges */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-medium flex items-center space-x-3">
              <Shield className="w-5 h-5 text-neon-blue" />
              <span>Verifications</span>
            </h3>
            <div className="p-4 bg-muted/10 rounded-lg border border-border/30">
              <VerificationBadges 
                verifications={verifications} 
                layout="grid" 
                size="md"
                showLabels={true}
              />
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Enhanced Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/20 h-12 text-base">
            <TabsTrigger value="overview" className="text-sm md:text-base py-3">Overview</TabsTrigger>
            <TabsTrigger value="reputation" className="text-sm md:text-base py-3">Reputation</TabsTrigger>
            <TabsTrigger value="activity" className="text-sm md:text-base py-3">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab - Enhanced Layout */}
          <TabsContent value="overview" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* ARP Score Breakdown - Better spacing */}
              <Card className="bg-muted/10 border-border/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base md:text-lg flex items-center space-x-3">
                    <Star className="w-5 h-5 text-chart-4" />
                    <span>ARP Score: {profile.totalScore.toLocaleString()}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(profile.typeScores).map(([type, score]) => {
                    const config = repTypeConfig[type as keyof typeof profile.typeScores];
                    const percentage = (score / 1000) * 100;
                    return (
                      <div key={type} className="space-y-3">
                        <div className="flex justify-between items-center text-sm md:text-base">
                          <div className="flex items-center space-x-3">
                            <config.icon className={`w-4 h-4 md:w-5 md:h-5 ${config.color}`} />
                            <span className="font-medium">{config.label}</span>
                          </div>
                          <span className="font-mono font-bold">{score.toLocaleString()}</span>
                        </div>
                        <Progress value={percentage} className="h-3" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* External Links - Enhanced */}
              <Card className="bg-muted/10 border-border/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base md:text-lg flex items-center space-x-3">
                    <Link className="w-5 h-5 text-neon-green" />
                    <span>External Profiles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {externalLinks.filter(link => link.url).map((link) => (
                    <div key={link.type} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-lg border-2 ${
                          link.verified ? 'border-neon-green/30 bg-neon-green/10' : 'border-muted-foreground/30 bg-muted/10'
                        } flex items-center justify-center`}>
                          {link.type === 'ceramic' && <Lock className="w-4 h-4" />}
                          {link.type === 'didx' && <Fingerprint className="w-4 h-4" />}
                          {link.type === 'ens' && <Globe className="w-4 h-4" />}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm md:text-base font-medium capitalize">{link.type}</span>
                          {link.verified && <CheckCircle className="w-4 h-4 text-neon-green" />}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 hover:bg-neon-blue/10"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reputation Tab - Enhanced */}
          <TabsContent value="reputation" className="space-y-6 mt-6">
            {/* Detailed Stats - Better grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-muted/10 border-border/30 text-center p-6">
                <div className="text-3xl md:text-4xl font-mono font-bold text-neon-blue mb-2">
                  #{profile.stats?.rank || 'N/A'}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">Global Rank</div>
              </Card>
              <Card className="bg-muted/10 border-border/30 text-center p-6">
                <div className="text-3xl md:text-4xl font-mono font-bold text-neon-green mb-2">
                  {profile.stats?.percentile || 'N/A'}%
                </div>
                <div className="text-sm md:text-base text-muted-foreground">Percentile</div>
              </Card>
            </div>

            {/* Recent Score Changes - Enhanced */}
            <Card className="bg-muted/10 border-border/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-base md:text-lg">Recent Score Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/20">
                  <div className="flex items-center space-x-4">
                    <TrendingUp className="w-5 h-5 text-neon-green flex-shrink-0" />
                    <span className="text-sm md:text-base font-medium">{profile.lastScoreChange.reason}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-base md:text-lg font-mono font-bold text-neon-green">
                      +{profile.lastScoreChange.amount.toLocaleString()}
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">{profile.lastScoreChange.timestamp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab - Enhanced */}
          <TabsContent value="activity" className="space-y-4 mt-6">
            <div className="space-y-4">
              {profile.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-muted/10 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors">
                  <div className="flex-1 pr-4">
                    <div className="text-sm md:text-base font-medium mb-2">{activity.description}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{activity.timestamp}</div>
                  </div>
                  <div className={`text-sm md:text-base font-mono font-bold px-3 py-2 rounded-lg ${
                    activity.scoreImpact > 0 ? 'text-neon-green bg-neon-green/10 border border-neon-green/20' : 
                    activity.scoreImpact < 0 ? 'text-chart-3 bg-chart-3/10 border border-chart-3/20' : 
                    'text-muted-foreground bg-muted/10 border border-muted/20'
                  }`}>
                    {activity.scoreImpact > 0 ? '+' : ''}{activity.scoreImpact.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SheetContent>
  );

  // If trigger is provided, wrap in Sheet component
  if (trigger) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
        {drawerContent}
      </Sheet>
    );
  }

  // If children are provided, render them and the drawer content separately
  if (children) {
    return (
      <>
        {children}
        {isOpen && drawerContent}
      </>
    );
  }

  // Default case - just render the trigger button and drawer
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="default" className="min-h-[40px]">
          <User className="w-4 h-4 mr-2" />
          View Profile
        </Button>
      </SheetTrigger>
      {drawerContent}
    </Sheet>
  );
}
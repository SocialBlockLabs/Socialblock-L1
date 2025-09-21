import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import {
  X,
  Shield,
  Crown,
  Star,
  Users,
  Activity,
  Globe,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Verified,
  Zap,
  Target,
  Network,
  Vote,
  Brain,
  Coins,
  Clock,
  ChevronRight,
  ExternalLink,
  Copy,
  QrCode,
  Settings
} from "lucide-react";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    address: string;
    name: string;
    avatar?: string;
    isVerified?: boolean;
    sbidLevel?: number;
    reputation?: number;
    badges?: string[];
    followers?: number;
    following?: number;
    joinedDate?: string;
    location?: string;
    website?: string;
    bio?: string;
  } | null;
}

export function ProfileModal({ open, onOpenChange, profile }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  // Default profile values to prevent null errors
  const safeProfile = profile || {
    address: "0x0000000000000000000000000000000000000000",
    name: "Anonymous User",
    avatar: "",
    isVerified: false,
    sbidLevel: 0,
    reputation: 0,
    badges: [],
    followers: 0,
    following: 0,
    joinedDate: "Recently",
    location: "",
    website: "",
    bio: ""
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(safeProfile.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return "0x0000...0000";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Early return if no profile data
  if (!profile) {
    return null;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "activity", label: "Activity", icon: TrendingUp },
    { id: "social", label: "Social", icon: Users },
    { id: "verification", label: "Verification", icon: Shield }
  ];

  const mockTransactions = [
    { hash: "0x1a2b3c...", type: "Transfer", amount: "1.5 ETH", time: "2m ago", status: "Success" },
    { hash: "0x4d5e6f...", type: "Swap", amount: "2,500 USDC", time: "1h ago", status: "Success" },
    { hash: "0x7g8h9i...", type: "Mint", amount: "NFT #1234", time: "3h ago", status: "Pending" },
  ];

  const mockSocialActivity = [
    { type: "endorsement", content: "Endorsed by CryptoExpert.eth", time: "5m ago" },
    { type: "follow", content: "Started following DeFiBuilder.eth", time: "1h ago" },
    { type: "comment", content: "Commented on governance proposal #42", time: "2h ago" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-card/98 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Enhanced Header */}
          <DialogHeader className="relative p-6 pb-4 border-b border-border/30">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-20 h-20 border-2 border-neon-blue/30 ring-2 ring-neon-blue/10">
                    <AvatarImage src={safeProfile.avatar} />
                    <AvatarFallback className="bg-neon-blue/10 text-neon-blue text-lg font-semibold">
                      {safeProfile.name?.charAt(0) || safeProfile.address.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {safeProfile.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-neon-blue/20 border-2 border-background flex items-center justify-center">
                      <Verified className="w-4 h-4 text-neon-blue" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      {safeProfile.name || "Anonymous User"}
                    </DialogTitle>
                    {safeProfile.sbidLevel && safeProfile.sbidLevel > 0 && (
                      <Badge variant="outline" className="border-neon-blue/30 text-neon-blue bg-neon-blue/5">
                        <Crown className="w-3 h-3 mr-1" />
                        SBID Level {safeProfile.sbidLevel}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div 
                      className="flex items-center space-x-2 px-3 py-1.5 bg-muted/20 rounded-lg border border-border/30 cursor-pointer hover:bg-muted/30 transition-colors group"
                      onClick={handleCopyAddress}
                    >
                      <code className="text-sm text-muted-foreground font-mono">
                        {formatAddress(safeProfile.address)}
                      </code>
                      {copied ? (
                        <Verified className="w-4 h-4 text-neon-green" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground group-hover:text-neon-blue transition-colors" />
                      )}
                    </div>
                    
                    {safeProfile.reputation && safeProfile.reputation > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center space-x-1 px-3 py-1.5 bg-neon-green/10 rounded-lg border border-neon-green/20">
                              <Star className="w-4 h-4 text-neon-green" />
                              <span className="text-sm font-medium text-neon-green">
                                {safeProfile.reputation}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Reputation Score</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  {safeProfile.bio && (
                    <p className="text-sm text-muted-foreground max-w-md line-clamp-2">
                      {safeProfile.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
                <Button variant="outline" size="sm" className="border-border/30">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-border/20">
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">{safeProfile.followers || 0}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">{safeProfile.following || 0}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">42</div>
                <div className="text-xs text-muted-foreground">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-neon-green">Active</div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
            </div>
          </DialogHeader>

          {/* Tab Navigation */}
          <div className="border-b border-border/30 bg-muted/5">
            <div className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-neon-blue text-neon-blue"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-full">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Profile Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>Profile Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {safeProfile.joinedDate && (
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Joined {safeProfile.joinedDate}</span>
                        </div>
                      )}
                      {safeProfile.location && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{safeProfile.location}</span>
                        </div>
                      )}
                      {safeProfile.website && (
                        <div className="flex items-center space-x-3">
                          <LinkIcon className="w-4 h-4 text-muted-foreground" />
                          <a 
                            href={safeProfile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-neon-blue hover:underline"
                          >
                            {safeProfile.website}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Verification Badges */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>Verification & Badges</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-neon-blue/10 text-neon-blue border-neon-blue/30">
                          <Verified className="w-3 h-3 mr-1" />
                          SBID Verified
                        </Badge>
                        <Badge className="bg-neon-green/10 text-neon-green border-neon-green/30">
                          <Crown className="w-3 h-3 mr-1" />
                          Early Adopter
                        </Badge>
                        <Badge variant="outline">
                          <Award className="w-3 h-3 mr-1" />
                          Community Builder
                        </Badge>
                        <Badge variant="outline">
                          <Target className="w-3 h-3 mr-1" />
                          Governance Participant
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Wallet Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Coins className="w-5 h-5" />
                        <span>Wallet Overview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Balance</span>
                        <span className="font-medium">$12,345.67</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">ETH Balance</span>
                        <span className="font-medium">8.24 ETH</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Token Holdings</span>
                        <span className="font-medium">15 tokens</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">NFTs</span>
                        <span className="font-medium">3 collections</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Heart className="w-5 h-5" />
                        <span>Social Metrics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Endorsements Received</span>
                        <span className="font-medium text-neon-green">127</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Endorsements Given</span>
                        <span className="font-medium">89</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Community Score</span>
                        <span className="font-medium text-neon-blue">94/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Governance Votes</span>
                        <span className="font-medium">23</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-5 h-5" />
                          <span>Recent Transactions</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          View All <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockTransactions.map((tx, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/30">
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                tx.status === 'Success' ? 'bg-neon-green' : 
                                tx.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <div>
                                <div className="font-medium text-sm">{tx.type}</div>
                                <code className="text-xs text-muted-foreground">{tx.hash}</code>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-sm">{tx.amount}</div>
                              <div className="text-xs text-muted-foreground">{tx.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="w-5 h-5" />
                        <span>AI Agent Interactions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-neon-blue/5 rounded-lg border border-neon-blue/20">
                          <div className="flex items-center space-x-3">
                            <Zap className="w-4 h-4 text-neon-blue" />
                            <div>
                              <div className="font-medium text-sm">DeFi Optimizer AI</div>
                              <div className="text-xs text-muted-foreground">Suggested yield farming strategy</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">1h ago</div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/30">
                          <div className="flex items-center space-x-3">
                            <Brain className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">Risk Assessment AI</div>
                              <div className="text-xs text-muted-foreground">Portfolio risk analysis completed</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">3h ago</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "social" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageCircle className="w-5 h-5" />
                        <span>Recent Social Activity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockSocialActivity.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg border border-border/30">
                            <div className="w-8 h-8 rounded-full bg-neon-blue/10 flex items-center justify-center flex-shrink-0">
                              {activity.type === 'endorsement' && <Heart className="w-4 h-4 text-neon-green" />}
                              {activity.type === 'follow' && <Users className="w-4 h-4 text-neon-blue" />}
                              {activity.type === 'comment' && <MessageCircle className="w-4 h-4 text-muted-foreground" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{activity.content}</p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Network className="w-5 h-5" />
                          <span>Network</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Mutual Connections</span>
                            <span className="font-medium">12</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Shared Communities</span>
                            <span className="font-medium">5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Cross Endorsements</span>
                            <span className="font-medium">8</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Vote className="w-5 h-5" />
                          <span>Governance</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Proposals Voted</span>
                            <span className="font-medium">23</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Proposals Created</span>
                            <span className="font-medium">3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Participation Rate</span>
                            <span className="font-medium text-neon-green">87%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "verification" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>SBID Verification Status</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-neon-green/10 rounded-lg border border-neon-green/20">
                          <div className="flex items-center space-x-3">
                            <Verified className="w-6 h-6 text-neon-green" />
                            <div>
                              <div className="font-semibold text-neon-green">Verified Identity</div>
                              <div className="text-sm text-muted-foreground">SBID Level 3 - Full Verification</div>
                            </div>
                          </div>
                          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                            Level 3
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-neon-green" />
                            <span className="text-sm">Email Verified</span>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-neon-green" />
                            <span className="text-sm">Phone Verified</span>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-neon-green" />
                            <span className="text-sm">Identity Document</span>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-neon-green" />
                            <span className="text-sm">Biometric Verification</span>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="font-medium">Verification Timeline</h4>
                          <div className="space-y-2 ml-4">
                            <div className="flex items-center space-x-3 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>Identity verified on March 15, 2024</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>SBID Level 3 achieved on March 20, 2024</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>Last verification update: March 25, 2024</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="w-5 h-5" />
                        <span>Trust & Reputation</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Trust Score</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-muted/30 rounded-full overflow-hidden">
                              <div className="w-4/5 h-full bg-gradient-to-r from-neon-blue to-neon-green rounded-full" />
                            </div>
                            <span className="text-sm font-medium">94/100</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Community Endorsements</span>
                          <span className="text-sm font-medium">127</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Successful Transactions</span>
                          <span className="text-sm font-medium">1,234</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Dispute Rate</span>
                          <span className="text-sm font-medium text-neon-green">0.2%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex items-center justify-between p-6 border-t border-border/30 bg-muted/5">
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
                <Users className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline">
                <Heart className="w-4 h-4 mr-2" />
                Endorse
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
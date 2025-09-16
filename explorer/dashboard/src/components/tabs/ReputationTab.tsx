import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ProfileDrawer } from "../ProfileDrawer";
import { generateMockARPProfile } from "../ARPBadge";
import { DashboardWidget } from "../DashboardWidget";
import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";
import { 
  TrendingUp, 
  Users, 
  Star, 
  Award, 
  Crown,
  Shield,
  CheckCircle,
  UserPlus,
  Eye,
  Vote,
  GitCommit,
  MessageSquare,
  Calendar,
  ExternalLink,
  Copy,
  BarChart3,
  Zap,
  Heart,
  RefreshCw,
  Filter,
  Search,
  ArrowUpRight,
  Activity,
  Target,
  Sparkles,
  TrendingDown,
  Info,
  ChevronRight,
  Clock,
  Brain,
  Hash,
  CircleDot,
  Flame,
  Globe,
  Medal,
  Verified,
  ArrowUp,
  ArrowDown,
  Minus,
  PieChart,
  LineChart,
  MoreHorizontal
} from "lucide-react";

// Enhanced reputation data with richer analytics
const staticReputationData = [
  { date: "Jan", score: 75, users: 12400, change: 0, avgIncrease: 2.3, month: "January" },
  { date: "Feb", score: 82, users: 15600, change: 7, avgIncrease: 3.1, month: "February" },
  { date: "Mar", score: 78, users: 18200, change: -4, avgIncrease: 2.8, month: "March" },
  { date: "Apr", score: 85, users: 21800, change: 7, avgIncrease: 3.4, month: "April" },
  { date: "May", score: 88, users: 25900, change: 3, avgIncrease: 3.7, month: "May" },
  { date: "Jun", score: 92, users: 31200, change: 4, avgIncrease: 4.2, month: "June" },
  { date: "Jul", score: 89, users: 34500, change: -3, avgIncrease: 3.9, month: "July" },
  { date: "Aug", score: 94, users: 38700, change: 5, avgIncrease: 4.5, month: "August" },
  { date: "Sep", score: 91, users: 42100, change: -3, avgIncrease: 4.1, month: "September" },
  { date: "Oct", score: 96, users: 45600, change: 5, avgIncrease: 4.8, month: "October" },
  { date: "Nov", score: 93, users: 48200, change: -3, avgIncrease: 4.4, month: "November" },
  { date: "Dec", score: 98, users: 52300, change: 5, avgIncrease: 5.2, month: "December" }
];

const topReputationProfiles = [
  {
    id: "1",
    name: "Alex Chen",
    username: "alexc_dev",
    address: "sblkd8da6bf26964af9d7eed9e03e53415d37aa96045",
    score: 9847,
    rank: 1,
    change: "+247",
    changePercent: "+2.4%",
    badge: "Diamond",
    avatar: "AC",
    endorsements: 847,
    contributions: 156,
    trustLevel: "Verified Leader",
    category: "Builder",
    isOnline: true,
    lastActive: "2m ago",
    weeklyGrowth: 5.2,
    specialties: ["DeFi", "Security", "Governance"],
    recentActivity: "Proposed governance improvement",
    stakingPower: "12,400 SBLK"
  },
  {
    id: "2", 
    name: "Sarah Kim",
    username: "sarah_validator",
    address: "sblk47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503",
    score: 9623,
    rank: 2,
    change: "+183",
    changePercent: "+1.8%",
    badge: "Platinum",
    avatar: "SK",
    endorsements: 723,
    contributions: 142,
    trustLevel: "Community Leader",
    category: "Validator",
    isOnline: true,
    lastActive: "5m ago",
    weeklyGrowth: 3.8,
    specialties: ["Validation", "Infrastructure", "Mentoring"],
    recentActivity: "Successfully validated 1000 blocks",
    stakingPower: "8,900 SBLK"
  },
  {
    id: "3",
    name: "Marcus Johnson", 
    username: "marcus_dao",
    address: "sblk742d35cc6430c0532b0c4c2c5c3b1c5d8d2e1f8c",
    score: 9401,
    rank: 3,
    change: "+312",
    changePercent: "+3.1%",
    badge: "Gold",
    avatar: "MJ",
    endorsements: 689,
    contributions: 128,
    trustLevel: "Active Contributor",
    category: "Civic",
    isOnline: false,
    lastActive: "1h ago",
    weeklyGrowth: 4.7,
    specialties: ["Governance", "Economics", "Research"],
    recentActivity: "Led community treasury discussion",
    stakingPower: "6,700 SBLK"
  },
  {
    id: "4",
    name: "Elena Rodriguez",
    username: "elena_consensus",
    address: "sblk88e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
    score: 9287,
    rank: 4,
    change: "+124",
    changePercent: "+1.2%",
    badge: "Gold",
    avatar: "ER",
    endorsements: 621,
    contributions: 119,
    trustLevel: "Trusted Member",
    category: "Validator",
    isOnline: true,
    lastActive: "12m ago",
    weeklyGrowth: 2.9,
    specialties: ["Consensus", "Performance", "Analytics"],
    recentActivity: "Optimized consensus mechanism",
    stakingPower: "5,400 SBLK"
  },
  {
    id: "5",
    name: "David Park",
    username: "david_protocol",
    address: "sblk5e349b609b6c6bb2b0f73b5e0b2beb6d7c8a9b4e",
    score: 9156,
    rank: 5,
    change: "+267",
    changePercent: "+2.7%",
    badge: "Silver",
    avatar: "DP",
    endorsements: 578,
    contributions: 104,
    trustLevel: "Rising Star",
    category: "Social",
    isOnline: true,
    lastActive: "8m ago",
    weeklyGrowth: 6.1,
    specialties: ["Community", "Education", "Events"],
    recentActivity: "Organized developer workshop",
    stakingPower: "4,200 SBLK"
  }
];

const reputationCategories = [
  {
    name: "Governance",
    score: 9420,
    maxScore: 10000,
    description: "DAO participation and voting activity",
    icon: Vote,
    color: "text-neon-green",
    bgColor: "bg-neon-green/10",
    borderColor: "border-neon-green/30",
    trend: "+5.2%",
    trendDirection: "up",
    activeUsers: 12400,
    avgScore: 78
  },
  {
    name: "Development",
    score: 9180,
    maxScore: 10000,
    description: "Code contributions and technical expertise",
    icon: GitCommit,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4/30",
    trend: "+3.8%",
    trendDirection: "up",
    activeUsers: 8700,
    avgScore: 82
  },
  {
    name: "Validation",
    score: 8890,
    maxScore: 10000,
    description: "Network security and validation performance",
    icon: Shield,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    borderColor: "border-chart-5/30",
    trend: "-1.2%",
    trendDirection: "down",
    activeUsers: 1247,
    avgScore: 88
  },
  {
    name: "Social Impact",
    score: 9580,
    maxScore: 10000,
    description: "Community engagement and peer recognition",
    icon: Heart,
    color: "text-neon-magenta",
    bgColor: "bg-neon-magenta/10",
    borderColor: "border-neon-magenta/30",
    trend: "+7.1%",
    trendDirection: "up",
    activeUsers: 23600,
    avgScore: 74
  }
];

// Activity feed data
const recentActivity = [
  {
    id: "1",
    user: "Alex Chen",
    avatar: "AC",
    action: "earned Diamond status",
    type: "achievement",
    time: "2m ago",
    impact: "+247 points",
    isPositive: true
  },
  {
    id: "2", 
    user: "Sarah Kim",
    avatar: "SK",
    action: "completed validator milestone",
    type: "validation",
    time: "8m ago",
    impact: "+89 points",
    isPositive: true
  },
  {
    id: "3",
    user: "Marcus Johnson",
    avatar: "MJ", 
    action: "led governance proposal",
    type: "governance",
    time: "15m ago",
    impact: "+156 points",
    isPositive: true
  },
  {
    id: "4",
    user: "Elena Rodriguez",
    avatar: "ER",
    action: "received peer endorsement",
    type: "social",
    time: "23m ago", 
    impact: "+34 points",
    isPositive: true
  },
  {
    id: "5",
    user: "David Park",
    avatar: "DP",
    action: "hosted community event",
    type: "community",
    time: "1h ago",
    impact: "+78 points",
    isPositive: true
  }
];

// Enhanced reputation chart component using Recharts
const ReputationTrendChart = ({ 
  data, 
  height = 192, 
  className = "",
  showTooltip = true 
}: { 
  data: Array<{date: string; score: number; users: number; change: number}>; 
  height?: number; 
  className?: string;
  showTooltip?: boolean;
}) => {
  const [hoveredData, setHoveredData] = useState<any>(null);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && showTooltip) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-1">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-muted-foreground">Score:</span>
              <span className="font-bold text-neon-green">{data.score}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-muted-foreground">Users:</span>
              <span className="font-medium">{data.users?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-muted-foreground">Change:</span>
              <span className={`font-medium ${data.change >= 0 ? 'text-neon-green' : 'text-chart-3'}`}>
                {data.change >= 0 ? '+' : ''}{data.change}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onMouseMove={(state) => {
            if (state.isTooltipActive) {
              setHoveredData(state.activePayload?.[0]?.payload);
            } else {
              setHoveredData(null);
            }
          }}
          onMouseLeave={() => setHoveredData(null)}
        >
          <defs>
            <linearGradient id="reputationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#97F11D" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#97F11D" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#97F11D"/>
              <stop offset="50%" stopColor="#00FF41"/>
              <stop offset="100%" stopColor="#97F11D"/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.1)" 
            horizontal={true}
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'rgba(136, 136, 136, 0.9)' }}
            className="text-xs"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'rgba(136, 136, 136, 0.9)' }}
            className="text-xs"
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          {showTooltip && (
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                stroke: '#97F11D', 
                strokeWidth: 1, 
                strokeDasharray: '3 3',
                strokeOpacity: 0.6
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="score"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            fill="url(#reputationGradient)"
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{ 
              r: 6, 
              stroke: '#97F11D', 
              strokeWidth: 2, 
              fill: '#97F11D',
              className: 'drop-shadow-lg'
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={false}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export function ReputationTab() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("12m");
  const [sortBy, setSortBy] = useState("score");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Diamond": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Platinum": return "bg-gray-400/20 text-gray-300 border-gray-400/30";
      case "Gold": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Silver": return "bg-gray-300/20 text-gray-200 border-gray-300/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getTrendIcon = (direction: string) => {
    return direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "achievement": return Award;
      case "validation": return Shield;
      case "governance": return Vote;
      case "social": return Heart;
      case "community": return Users;
      default: return Activity;
    }
  };

  const filteredProfiles = topReputationProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === "all" || profile.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex space-x-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>

        {/* Bento grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
          <Skeleton className="md:col-span-2 lg:col-span-2 h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Clean Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-neon-green/10 rounded-xl border border-neon-green/20">
                <Users className="w-5 h-5 text-neon-green" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Reputation Analytics</h1>
                <p className="text-muted-foreground">SBID-verified profiles and community trust metrics</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="12m">12 Months</SelectItem>
              </SelectContent>
            </Select>
            
            <Badge variant="outline" className="bg-neon-green/10 border-neon-green/30 text-neon-green">
              <CircleDot className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardWidget
            title="Total Verified Users"
            value="52.3K"
            change={{ value: "+8.2%", type: "increase" }}
            icon={<Verified className="w-5 h-5 text-neon-blue" />}
            tooltip="Number of SBID-verified users with active reputation scores"
          />
          <DashboardWidget
            title="Network Reputation"
            value="9,247"
            change={{ value: "+5.2%", type: "increase" }}
            icon={<Star className="w-5 h-5 text-neon-green" />}
            tooltip="Average community reputation score across all verified users"
          />
          <DashboardWidget
            title="Active Contributors"
            value="18.7K"
            change={{ value: "+12.4%", type: "increase" }}
            icon={<Activity className="w-5 h-5 text-chart-4" />}
            tooltip="Users who contributed to the network in the past 30 days"
          />
          <DashboardWidget
            title="Trust Level"
            value="94.7%"
            change={{ value: "+1.8%", type: "increase" }}
            icon={<Shield className="w-5 h-5 text-chart-5" />}
            tooltip="Percentage of transactions validated by trusted community members"
          />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
          
          {/* Main Reputation Chart - Large Card */}
          <Card className="md:col-span-2 lg:col-span-2 bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-all duration-500">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <LineChart className="w-5 h-5 text-neon-green" />
                    <CardTitle className="text-lg">Reputation Trends</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Network-wide reputation score evolution
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-neon-green/5 rounded-lg border border-neon-green/20">
                    <div className="text-2xl font-bold text-neon-green">98</div>
                    <div className="text-xs text-muted-foreground">Current Score</div>
                  </div>
                  <div className="text-center p-3 bg-chart-4/5 rounded-lg border border-chart-4/20">
                    <div className="text-2xl font-bold text-chart-4">+5.2%</div>
                    <div className="text-xs text-muted-foreground">YoY Growth</div>
                  </div>
                  <div className="text-center p-3 bg-chart-5/5 rounded-lg border border-chart-5/20">
                    <div className="text-2xl font-bold text-chart-5">52.3K</div>
                    <div className="text-xs text-muted-foreground">Active Users</div>
                  </div>
                </div>

                {/* Enhanced Chart with better spacing */}
                <div className="bg-card/20 p-4 rounded-xl border border-border/30">
                  <ReputationTrendChart 
                    data={staticReputationData} 
                    height={192}
                    showTooltip={true}
                    className="rounded-lg"
                  />
                </div>

                {/* Bottom metrics with enhanced styling */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/20">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-neon-green" />
                      <span className="text-sm text-muted-foreground">Peak</span>
                    </div>
                    <span className="font-bold text-neon-green">98</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/20">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-chart-4" />
                      <span className="text-sm text-muted-foreground">Average</span>
                    </div>
                    <span className="font-bold text-chart-4">87.2</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Contributors - Medium Card */}
          <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-all duration-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-chart-4" />
                  <CardTitle className="text-lg">Top Contributors</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredProfiles.slice(0, 5).map((profile, index) => (
                <ProfileDrawer
                  key={profile.id}
                  profile={generateMockARPProfile(profile.address, {
                    ens: profile.username,
                    primaryType: profile.category.toLowerCase() as any
                  })}
                  trigger={
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer group">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className={`${getBadgeColor(profile.badge)} text-xs font-medium`}>
                              {profile.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {profile.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-neon-green rounded-full border border-background"></div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{profile.name}</div>
                          <div className="text-xs text-muted-foreground">#{profile.rank}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{profile.score.toLocaleString()}</div>
                        <div className={`text-xs flex items-center ${
                          profile.changePercent.startsWith('+') ? 'text-neon-green' : 'text-chart-3'
                        }`}>
                          {profile.changePercent.startsWith('+') ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {profile.changePercent}
                        </div>
                      </div>
                    </div>
                  }
                />
              ))}
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                View Full Leaderboard
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Category Breakdown - Small Card */}
          <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-all duration-500">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-chart-5" />
                <CardTitle className="text-lg">Categories</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {reputationCategories.map((category, index) => {
                const Icon = category.icon;
                const TrendIcon = getTrendIcon(category.trendDirection);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${category.color}`} />
                        <span className="font-medium text-sm">{category.name}</span>
                      </div>
                      <div className={`flex items-center space-x-1 text-xs ${
                        category.trendDirection === 'up' ? 'text-neon-green' : 'text-chart-3'
                      }`}>
                        <TrendIcon className="w-3 h-3" />
                        {category.trend}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={(category.score / category.maxScore) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{category.activeUsers.toLocaleString()} users</span>
                        <span>Avg: {category.avgScore}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Search & Filters - Medium Card */}
          <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-all duration-500">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-neon-blue" />
                <CardTitle className="text-lg">Explore Profiles</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="builder">Builders</SelectItem>
                  <SelectItem value="validator">Validators</SelectItem>
                  <SelectItem value="civic">Civic Leaders</SelectItem>
                  <SelectItem value="social">Social Contributors</SelectItem>
                </SelectContent>
              </Select>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="font-bold text-neon-green">18.7K</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="font-bold text-chart-4">94.7%</div>
                  <div className="text-xs text-muted-foreground">Verified</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity - Wide Card */}
          <Card className="md:col-span-2 bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-all duration-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-neon-magenta" />
                  <CardTitle className="text-lg">Live Activity Feed</CardTitle>
                </div>
                <Badge variant="outline" className="bg-neon-green/10 border-neon-green/30 text-neon-green">
                  <CircleDot className="w-3 h-3 mr-1 animate-pulse" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-neon-green/10 text-neon-green text-xs font-medium">
                          {activity.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{activity.user}</span>
                          <Icon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{activity.action}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                      </div>
                    </div>
                    <div className={`font-medium text-sm ${
                      activity.isPositive ? 'text-neon-green' : 'text-chart-3'
                    }`}>
                      {activity.impact}
                    </div>
                  </div>
                );
              })}
              
              <Button variant="outline" size="sm" className="w-full">
                View All Activity
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Network Health - Small Card */}
          <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-all duration-500">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-chart-3" />
                <CardTitle className="text-lg">Network Health</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Trust Score</span>
                  <span className="font-bold text-neon-green">94.7%</span>
                </div>
                <Progress value={94.7} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Participation</span>
                  <span className="font-bold text-chart-4">87.3%</span>
                </div>
                <Progress value={87.3} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Consensus</span>
                  <span className="font-bold text-chart-5">99.1%</span>
                </div>
                <Progress value={99.1} className="h-2" />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Network Status</span>
                  <Badge variant="outline" className="bg-neon-green/10 border-neon-green/30 text-neon-green text-xs">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="text-muted-foreground">2m ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </TooltipProvider>
  );
}
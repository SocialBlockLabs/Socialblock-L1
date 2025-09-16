import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Puzzle, 
  Download, 
  Star, 
  Users, 
  Shield, 
  Zap, 
  Code,
  Eye,
  Settings,
  Trash2,
  ExternalLink,
  ChevronRight,
  Activity,
  TrendingUp,
  Bot,
  MessageSquare,
  Target,
  Sparkles
} from "lucide-react";

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: {
    name: string;
    zkId: string;
    avatar?: string;
    reputation: number;
  };
  category: 'analytics' | 'social' | 'governance' | 'security' | 'utility' | 'ai';
  status: 'installed' | 'available' | 'updating' | 'disabled';
  permissions: string[];
  rating: number;
  downloads: number;
  lastUpdated: string;
  size: string;
  screenshots?: string[];
  features: string[];
  dependencies?: string[];
  pricing: {
    type: 'free' | 'paid' | 'freemium';
    price?: number;
  };
  isVerified: boolean;
  isActive: boolean;
  config?: Record<string, any>;
}

const mockPlugins: Plugin[] = [
  {
    id: 'whale-tracker-pro',
    name: 'Whale Tracker Pro',
    description: 'Advanced whale movement tracking with AI-powered pattern recognition and alert system. Track large holders across multiple chains.',
    version: '2.1.4',
    author: {
      name: 'CryptoAnalytics',
      zkId: 'zk9876543210fedcba',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      reputation: 847
    },
    category: 'analytics',
    status: 'installed',
    permissions: ['read_transactions', 'send_notifications'],
    rating: 4.8,
    downloads: 12847,
    lastUpdated: '2024-11-28',
    size: '2.4 MB',
    features: ['Real-time whale alerts', 'Multi-chain support', 'Pattern recognition', 'Custom thresholds'],
    pricing: { type: 'freemium', price: 9.99 },
    isVerified: true,
    isActive: true,
    config: {
      alertThreshold: 1000000,
      chains: ['ethereum', 'polygon', 'arbitrum'],
      notifications: true
    }
  },
  {
    id: 'governance-insights',
    name: 'Governance Insights',
    description: 'Deep analysis of DAO governance patterns, voting behavior prediction, and proposal outcome forecasting.',
    version: '1.8.2',
    author: {
      name: 'DAOtools',
      zkId: 'zkabcdef1234567890',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b172?w=150&h=150&fit=crop&crop=face',
      reputation: 923
    },
    category: 'governance',
    status: 'installed',
    permissions: ['read_proposals', 'read_votes', 'access_social_data'],
    rating: 4.6,
    downloads: 8934,
    lastUpdated: '2024-11-25',
    size: '1.8 MB',
    features: ['Vote prediction', 'Delegate analysis', 'Participation metrics', 'Outcome forecasting'],
    pricing: { type: 'paid', price: 14.99 },
    isVerified: true,
    isActive: false
  },
  {
    id: 'social-sentiment',
    name: 'Social Sentiment Analyzer',
    description: 'Real-time social media sentiment analysis for tokens, protocols, and market trends with community insights.',
    version: '3.0.1',
    author: {
      name: 'SocialLens',
      zkId: 'zk5678901234abcdef',
      reputation: 756
    },
    category: 'social',
    status: 'available',
    permissions: ['access_social_apis', 'read_token_data'],
    rating: 4.3,
    downloads: 15672,
    lastUpdated: '2024-11-30',
    size: '3.2 MB',
    features: ['Multi-platform sentiment', 'Influencer tracking', 'Trend prediction', 'Custom alerts'],
    pricing: { type: 'free' },
    isVerified: false,
    isActive: false
  },
  {
    id: 'ai-portfolio-advisor',
    name: 'AI Portfolio Advisor',
    description: 'Intelligent portfolio optimization powered by machine learning algorithms and market analysis.',
    version: '1.2.0',
    author: {
      name: 'AIFinance',
      zkId: 'zk1357902468bdfcea',
      reputation: 892
    },
    category: 'ai',
    status: 'available',
    permissions: ['read_portfolio', 'access_market_data', 'send_recommendations'],
    rating: 4.9,
    downloads: 5421,
    lastUpdated: '2024-12-01',
    size: '4.1 MB',
    features: ['ML-powered analysis', 'Risk assessment', 'Auto-rebalancing', 'Performance tracking'],
    pricing: { type: 'paid', price: 29.99 },
    isVerified: true,
    isActive: false
  },
  {
    id: 'security-scanner',
    name: 'Smart Contract Security Scanner',
    description: 'Automated security analysis for smart contracts with vulnerability detection and audit reports.',
    version: '2.3.1',
    author: {
      name: 'SecureChain',
      zkId: 'zk2468135790acbdef',
      reputation: 967
    },
    category: 'security',
    status: 'updating',
    permissions: ['read_contracts', 'access_audit_data'],
    rating: 4.7,
    downloads: 7892,
    lastUpdated: '2024-11-29',
    size: '1.9 MB',
    features: ['Vulnerability scanning', 'Audit reports', 'Risk scoring', 'Compliance checks'],
    pricing: { type: 'freemium', price: 19.99 },
    isVerified: true,
    isActive: true
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'analytics': return <TrendingUp className="w-4 h-4" />;
    case 'social': return <MessageSquare className="w-4 h-4" />;
    case 'governance': return <Shield className="w-4 h-4" />;
    case 'security': return <Shield className="w-4 h-4" />;
    case 'utility': return <Zap className="w-4 h-4" />;
    case 'ai': return <Bot className="w-4 h-4" />;
    default: return <Puzzle className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'analytics': return 'text-neon-blue border-neon-blue/30 bg-neon-blue/10';
    case 'social': return 'text-neon-green border-neon-green/30 bg-neon-green/10';
    case 'governance': return 'text-neon-magenta border-neon-magenta/30 bg-neon-magenta/10';
    case 'security': return 'text-chart-3 border-chart-3/30 bg-chart-3/10';
    case 'utility': return 'text-chart-4 border-chart-4/30 bg-chart-4/10';
    case 'ai': return 'text-chart-5 border-chart-5/30 bg-chart-5/10';
    default: return 'text-muted-foreground border-border/30 bg-muted/10';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'installed': return 'text-neon-green border-neon-green/30 bg-neon-green/10';
    case 'available': return 'text-neon-blue border-neon-blue/30 bg-neon-blue/10';
    case 'updating': return 'text-chart-4 border-chart-4/30 bg-chart-4/10';
    case 'disabled': return 'text-muted-foreground border-border/30 bg-muted/10';
    default: return 'text-muted-foreground border-border/30 bg-muted/10';
  }
};

const PluginCard = ({ plugin, onToggle, onInstall, onConfigure }: {
  plugin: Plugin;
  onToggle?: (id: string) => void;
  onInstall?: (id: string) => void;
  onConfigure?: (id: string) => void;
}) => {
  return (
    <Card className="group relative bg-card/60 backdrop-blur-xl border border-border/30 hover:border-neon-blue/50 transition-all duration-300">
      {/* Verified Badge */}
      {plugin.isVerified && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="outline" className="text-xs bg-neon-green/10 border-neon-green/30 text-neon-green">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between pr-16">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getCategoryColor(plugin.category)}`}>
              {getCategoryIcon(plugin.category)}
            </div>
            
            <div className="space-y-1">
              <CardTitle className="text-lg">{plugin.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={`text-xs ${getCategoryColor(plugin.category)}`}>
                  {plugin.category}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getStatusColor(plugin.status)}`}>
                  {plugin.status}
                </Badge>
                <span className="text-xs text-muted-foreground">v{plugin.version}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rating and Downloads */}
        <div className="flex items-center justify-between mt-2 p-2 bg-muted/10 rounded">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-chart-4 text-chart-4" />
            <span className="text-sm font-mono">{plugin.rating}</span>
            <span className="text-xs text-muted-foreground">({plugin.downloads.toLocaleString()} downloads)</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{plugin.size}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{plugin.description}</p>

        {/* Author Info */}
        <div className="flex items-center space-x-2 p-2 bg-muted/5 rounded border border-border/10">
          <Avatar className="w-8 h-8">
            <AvatarImage src={plugin.author.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-neon-blue/20 to-neon-green/20 text-xs">
              {plugin.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-medium">{plugin.author.name}</div>
            <div className="text-xs text-muted-foreground">Rep: {plugin.author.reputation}</div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Key Features</div>
          <div className="flex flex-wrap gap-1">
            {plugin.features.slice(0, 4).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-muted/20">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {plugin.pricing.type === 'free' ? (
              <Badge variant="outline" className="text-neon-green border-neon-green/30 bg-neon-green/10">
                Free
              </Badge>
            ) : plugin.pricing.type === 'paid' ? (
              <Badge variant="outline" className="text-chart-4 border-chart-4/30 bg-chart-4/10">
                ${plugin.pricing.price}/month
              </Badge>
            ) : (
              <Badge variant="outline" className="text-neon-blue border-neon-blue/30 bg-neon-blue/10">
                Freemium
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">Updated {plugin.lastUpdated}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {plugin.status === 'installed' ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={plugin.isActive}
                  onCheckedChange={() => onToggle?.(plugin.id)}
                />
                <span className="text-xs">{plugin.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConfigure?.(plugin.id)}
              >
                <Settings className="w-3 h-3 mr-1" />
                Configure
              </Button>
            </div>
          ) : plugin.status === 'available' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onInstall?.(plugin.id)}
              className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
            >
              <Download className="w-3 h-3 mr-1" />
              Install
            </Button>
          ) : plugin.status === 'updating' ? (
            <div className="flex items-center space-x-2">
              <Progress value={67} className="w-24 h-2" />
              <span className="text-xs text-muted-foreground">Updating...</span>
            </div>
          ) : null}

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Eye className="w-3 h-3 mr-1" />
              Details
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PluginManager = () => {
  const [plugins, setPlugins] = useState(mockPlugins);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPlugins = plugins.filter(plugin => {
    const categoryMatch = filterCategory === 'all' || plugin.category === filterCategory;
    const statusMatch = filterStatus === 'all' || plugin.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const handleToggle = (id: string) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === id ? { ...plugin, isActive: !plugin.isActive } : plugin
    ));
  };

  const handleInstall = (id: string) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === id ? { ...plugin, status: 'installed' as const, isActive: true } : plugin
    ));
  };

  const handleConfigure = (id: string) => {
    console.log('Configure plugin:', id);
  };

  const installedCount = plugins.filter(p => p.status === 'installed').length;
  const activeCount = plugins.filter(p => p.status === 'installed' && p.isActive).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-neon-blue">{installedCount}</div>
            <div className="text-xs text-muted-foreground">Installed</div>
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-neon-green">{activeCount}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-chart-4">{plugins.length}</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-chart-5">6</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-4 bg-muted/10 rounded-lg">
        <div className="flex items-center space-x-1">
          <span className="text-xs text-muted-foreground">Category:</span>
          {['all', 'analytics', 'social', 'governance', 'security', 'ai', 'utility'].map((category) => (
            <Button
              key={category}
              variant={filterCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterCategory(category)}
              className={`text-xs capitalize ${
                filterCategory === category 
                  ? 'bg-neon-blue/20 border-neon-blue/30 text-neon-blue' 
                  : 'text-muted-foreground'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-xs text-muted-foreground">Status:</span>
          {['all', 'installed', 'available', 'updating'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={`text-xs capitalize ${
                filterStatus === status 
                  ? 'bg-neon-green/20 border-neon-green/30 text-neon-green' 
                  : 'text-muted-foreground'
              }`}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Plugin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlugins.map((plugin) => (
          <PluginCard 
            key={plugin.id} 
            plugin={plugin} 
            onToggle={handleToggle}
            onInstall={handleInstall}
            onConfigure={handleConfigure}
          />
        ))}
      </div>
    </div>
  );
};

const PluginDeveloper = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-neon-blue" />
            <span>Plugin Development Kit</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Build and distribute your own plugins for the SocialBlock Explorer community. 
            Access our comprehensive SDK and earn revenue from your creations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/10 rounded-lg border border-border/20">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-neon-blue" />
                <span className="font-medium">SDK Access</span>
              </div>
              <p className="text-xs text-muted-foreground">Full API access, development tools, and testing environment</p>
            </div>

            <div className="p-4 bg-muted/10 rounded-lg border border-border/20">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-neon-green" />
                <span className="font-medium">Distribution</span>
              </div>
              <p className="text-xs text-muted-foreground">Publish to the community marketplace with built-in monetization</p>
            </div>

            <div className="p-4 bg-muted/10 rounded-lg border border-border/20">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-chart-4" />
                <span className="font-medium">Verification</span>
              </div>
              <p className="text-xs text-muted-foreground">Security review and community verification process</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <Button className="bg-neon-blue/20 border-neon-blue/30 text-neon-blue hover:bg-neon-blue/30">
              <Code className="w-4 h-4 mr-2" />
              Get Started
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Example Plugin Architecture */}
      <Card className="bg-card/60 backdrop-blur-xl border border-border/30">
        <CardHeader>
          <CardTitle>Plugin Architecture Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/20 rounded-lg p-4 font-mono text-xs overflow-x-auto">
            <pre className="text-muted-foreground">
{`// Plugin Interface
interface PluginAPI {
  name: string;
  version: string;
  permissions: Permission[];
  
  onInstall(): Promise<void>;
  onActivate(): Promise<void>;
  onDeactivate(): Promise<void>;
  
  // Render methods
  renderWidget(): React.Component;
  renderSettings(): React.Component;
  
  // Data access
  getData(endpoint: string): Promise<any>;
  subscribeToEvents(events: string[]): void;
}

// Example plugin implementation
export class WhaleTrackerPlugin implements PluginAPI {
  name = "Whale Tracker Pro";
  version = "2.1.4";
  permissions = ["read_transactions", "send_notifications"];
  
  async onInstall() {
    // Plugin installation logic
  }
  
  renderWidget() {
    return <WhaleTrackerWidget />;
  }
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export function PluginSystem() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium">Plugin System</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Extend your explorer with community-built plugins and custom functionality
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-neon-green/30 text-neon-green hover:bg-neon-green/10">
            <Puzzle className="w-4 h-4 mr-2" />
            Browse Store
          </Button>
          <Button variant="outline" className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
            <Code className="w-4 h-4 mr-2" />
            Develop Plugin
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="manager" className="space-y-6">
        <TabsList className="bg-muted/10 p-1 rounded-lg">
          <TabsTrigger value="manager" className="flex-1">
            <Settings className="w-4 h-4 mr-2" />
            Plugin Manager
          </TabsTrigger>
          <TabsTrigger value="developer" className="flex-1">
            <Code className="w-4 h-4 mr-2" />
            Developer Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manager">
          <PluginManager />
        </TabsContent>

        <TabsContent value="developer">
          <PluginDeveloper />
        </TabsContent>
      </Tabs>
    </div>
  );
}
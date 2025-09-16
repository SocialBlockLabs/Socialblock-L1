import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { 
  Puzzle, 
  Bot, 
  Shield, 
  Gift, 
  Activity, 
  Settings, 
  Maximize2, 
  Minimize2,
  GripVertical,
  Eye,
  EyeOff,
  Zap,
  Database,
  Map,
  Users,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Target,
  Filter,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { AIWatchLogs } from "./plugins/AIWatchLogs";
import { ZkIDRegistry } from "./plugins/ZkIDRegistry";
import { AirdropClaimMap } from "./plugins/AirdropClaimMap";
import { ValidatorTracker } from "./plugins/ValidatorTracker";

interface Plugin {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  type: 'overlay' | 'drawer' | 'subtab';
  category: 'monitoring' | 'identity' | 'defi' | 'governance';
  size: 'sm' | 'md' | 'lg';
  position: number;
  data?: any;
}

interface PluginDrawerProps {
  currentTab: string;
  isVisible: boolean;
  onToggle: () => void;
}

interface ActivePlugin {
  id: string;
  component: React.ComponentType<any>;
}

const defaultPlugins: Plugin[] = [
  {
    id: 'ai-watch-logs',
    name: 'AI Watch Logs',
    description: 'Real-time AI agent activity monitoring and decision logs',
    icon: Bot,
    enabled: true,
    type: 'drawer',
    category: 'monitoring',
    size: 'lg',
    position: 0
  },
  {
    id: 'zkid-registry',
    name: 'zkID Registry',
    description: 'Decentralized identity verification and profile management',
    icon: Shield,
    enabled: true,
    type: 'subtab',
    category: 'identity',
    size: 'md',
    position: 1
  },
  {
    id: 'airdrop-claim-map',
    name: 'Airdrop Claim Map',
    description: 'Interactive map of token airdrops and claim status',
    icon: Gift,
    enabled: false,
    type: 'overlay',
    category: 'defi',
    size: 'md',
    position: 2
  },
  {
    id: 'validator-tracker',
    name: 'Validator Tracker',
    description: 'Advanced validator performance analytics and alerts',
    icon: Activity,
    enabled: true,
    type: 'drawer',
    category: 'monitoring',
    size: 'sm',
    position: 3
  }
];

const categoryConfig = {
  monitoring: {
    label: 'Monitoring',
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/10',
    borderColor: 'border-neon-blue/30'
  },
  identity: {
    label: 'Identity',
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/10',
    borderColor: 'border-neon-green/30'
  },
  defi: {
    label: 'DeFi',
    color: 'text-neon-magenta',
    bgColor: 'bg-neon-magenta/10',
    borderColor: 'border-neon-magenta/30'
  },
  governance: {
    label: 'Governance',
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
    borderColor: 'border-chart-4/30'
  }
};

const PluginCard = ({ plugin, onToggle, onSettings, onOpenPlugin, isDragging }: {
  plugin: Plugin;
  onToggle: (id: string) => void;
  onSettings: (id: string) => void;
  onOpenPlugin: (id: string) => void;
  isDragging: boolean;
}) => {
  const Icon = plugin.icon;
  const category = categoryConfig[plugin.category];
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card 
      className={`
        group relative transition-all duration-300 cursor-pointer
        ${plugin.enabled ? 'bg-card/80 border-border/50 hover:border-neon-blue/30' : 'bg-muted/20 border-muted/20'}
        ${isDragging ? 'shadow-cyber-lg rotate-2 scale-105' : 'hover:shadow-cyber'}
        ${plugin.enabled ? 'glow-blue' : ''}
      `}
      style={plugin.enabled ? {
        boxShadow: `0 0 ${plugin.size === 'lg' ? '15px' : plugin.size === 'md' ? '10px' : '8px'} rgba(0, 245, 255, 0.3)`
      } : {}}
    >
      {/* Drag Handle */}
      <div className="absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      <CardHeader className="pb-3 pl-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`
              p-2 rounded-lg border transition-all duration-300
              ${plugin.enabled ? category.bgColor + ' ' + category.borderColor : 'bg-muted/20 border-muted/30'}
            `}>
              <Icon className={`w-4 h-4 ${plugin.enabled ? category.color : 'text-muted-foreground'}`} />
            </div>

            <div className="flex-1">
              <CardTitle className="text-sm flex items-center space-x-2">
                <span>{plugin.name}</span>
                <Badge variant="outline" className={`text-xs ${category.color} ${category.borderColor} ${category.bgColor}`}>
                  {plugin.type}
                </Badge>
              </CardTitle>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>

            <Switch
              checked={plugin.enabled}
              onCheckedChange={() => onToggle(plugin.id)}
              className="data-[state=checked]:bg-neon-blue"
            />
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 pl-8">
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {plugin.description}
            </p>

            <div className="flex items-center justify-between text-xs">
              <Badge variant="outline" className="text-xs">
                {category.label}
              </Badge>
              <Badge variant="outline" className={`text-xs ${
                plugin.size === 'lg' ? 'text-chart-3' : 
                plugin.size === 'md' ? 'text-chart-4' : 'text-chart-5'
              }`}>
                {plugin.size.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onSettings(plugin.id);
                }}
              >
                <Settings className="w-3 h-3 mr-1" />
                Configure
              </Button>

              {plugin.enabled && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPlugin(plugin.id);
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Open
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      )}

      {/* Active indicator */}
      {plugin.enabled && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-green animate-pulse" />
      )}
    </Card>
  );
};

const PluginStats = ({ plugins }: { plugins: Plugin[] }) => {
  const enabledCount = plugins.filter(p => p.enabled).length;
  const categoryStats = plugins.reduce((acc, plugin) => {
    acc[plugin.category] = (acc[plugin.category] || 0) + (plugin.enabled ? 1 : 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <Card className="bg-muted/10 border-border/30">
        <CardContent className="p-3 text-center">
          <div className="text-lg font-mono font-bold text-neon-blue">{enabledCount}</div>
          <div className="text-xs text-muted-foreground">Active Plugins</div>
        </CardContent>
      </Card>

      <Card className="bg-muted/10 border-border/30">
        <CardContent className="p-3 text-center">
          <div className="text-lg font-mono font-bold text-neon-green">{plugins.length}</div>
          <div className="text-xs text-muted-foreground">Total Available</div>
        </CardContent>
      </Card>
    </div>
  );
};

export function PluginDrawer({ currentTab, isVisible, onToggle }: PluginDrawerProps) {
  const [plugins, setPlugins] = useState<Plugin[]>(defaultPlugins);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [activePlugin, setActivePlugin] = useState<ActivePlugin | null>(null);

  const handlePluginToggle = (pluginId: string) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === pluginId 
        ? { ...plugin, enabled: !plugin.enabled }
        : plugin
    ));
    
    const plugin = plugins.find(p => p.id === pluginId);
    if (plugin) {
      toast(plugin.enabled ? `${plugin.name} disabled` : `${plugin.name} enabled`);
    }
  };

  const handlePluginSettings = (pluginId: string) => {
    const plugin = plugins.find(p => p.id === pluginId);
    if (plugin) {
      toast(`Opening settings for ${plugin.name}`);
    }
  };

  const handleOpenPlugin = (pluginId: string) => {
    const plugin = plugins.find(p => p.id === pluginId);
    if (!plugin || !plugin.enabled) return;

    let PluginComponent: React.ComponentType<any> | null = null;

    switch (pluginId) {
      case 'ai-watch-logs':
        PluginComponent = AIWatchLogs;
        break;
      case 'zkid-registry':
        PluginComponent = ZkIDRegistry;
        break;
      case 'airdrop-claim-map':
        PluginComponent = AirdropClaimMap;
        break;
      case 'validator-tracker':
        PluginComponent = ValidatorTracker;
        break;
      default:
        toast(`${plugin.name} is not implemented yet`);
        return;
    }

    if (PluginComponent) {
      setActivePlugin({
        id: pluginId,
        component: PluginComponent
      });
      toast(`${plugin.name} opened`);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(plugins);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }));

    setPlugins(updatedItems);
    toast("Plugin order updated");
  };

  const filteredPlugins = plugins
    .filter(plugin => 
      activeCategory === 'all' || plugin.category === activeCategory
    )
    .filter(plugin =>
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.position - b.position);

  const categories = ['all', ...Object.keys(categoryConfig)] as const;

  if (!isVisible) return null;

  // If a plugin is active, show it in a modal/drawer
  if (activePlugin && !isMinimized) {
    const ActivePluginComponent = activePlugin.component;
    const plugin = plugins.find(p => p.id === activePlugin.id);

    return (
      <div className="fixed right-0 top-0 h-full w-80 md:w-96 z-40 bg-card/95 backdrop-blur-xl border-l border-border/50 shadow-cyber-lg">
        {/* Plugin Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div className="flex items-center space-x-2">
            {plugin && (
              <>
                <div className={`p-2 rounded-lg border ${categoryConfig[plugin.category].bgColor} ${categoryConfig[plugin.category].borderColor}`}>
                  <plugin.icon className={`w-4 h-4 ${categoryConfig[plugin.category].color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium">{plugin.name}</h3>
                  <p className="text-xs text-muted-foreground">{plugin.description}</p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setActivePlugin(null)}
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Plugin Content */}
        <div className="h-full">
          <ActivePluginComponent />
        </div>
      </div>
    );
  }

  return (
    <div className={`
      fixed right-0 top-0 h-full z-40 transition-all duration-300 ease-in-out
      ${isMinimized ? 'w-12' : 'w-80 md:w-96'}
      bg-card/95 backdrop-blur-xl border-l border-border/50 shadow-cyber-lg
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        {!isMinimized && (
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/30">
              <Puzzle className="w-4 h-4 text-neon-blue" />
            </div>
            <div>
              <h2 className="text-sm font-medium">Plugin System</h2>
              <p className="text-xs text-muted-foreground">Modular Extensions</p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onToggle}
          >
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col h-full">
          {/* Stats */}
          <div className="p-4 border-b border-border/30">
            <PluginStats plugins={plugins} />

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-muted/20 border border-border/30 rounded-lg focus:border-neon-blue/30 focus:outline-none"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex space-x-1 mb-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "ghost"}
                  size="sm"
                  className={`text-xs ${
                    activeCategory === category 
                      ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/30' 
                      : 'hover:bg-muted/20'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === 'all' ? 'All' : categoryConfig[category as keyof typeof categoryConfig].label}
                </Button>
              ))}
            </div>
          </div>

          {/* Plugin List */}
          <ScrollArea className="flex-1 p-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="plugins">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {filteredPlugins.map((plugin, index) => (
                      <Draggable key={plugin.id} draggableId={plugin.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <PluginCard
                              plugin={plugin}
                              onToggle={handlePluginToggle}
                              onSettings={handlePluginSettings}
                              onOpenPlugin={handleOpenPlugin}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {filteredPlugins.length === 0 && (
              <div className="text-center py-8">
                <Puzzle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No plugins found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Context: {currentTab}</span>
              <Badge variant="outline" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Beta
              </Badge>
            </div>
          </div>
        </div>
      )}

      {isMinimized && (
        <div className="flex flex-col items-center space-y-3 p-2 mt-4">
          {plugins.filter(p => p.enabled).map((plugin) => {
            const Icon = plugin.icon;
            return (
              <Button
                key={plugin.id}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 glow-blue"
                onClick={() => handleOpenPlugin(plugin.id)}
              >
                <Icon className="w-4 h-4 text-neon-blue" />
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Blocks, 
  ArrowRightLeft, 
  Shield, 
  TrendingUp, 
  Bot, 
  Vote,
  ChevronLeft,
  ChevronRight,
  Menu,
  Sparkles,
  BarChart3,
  Users,
  Brain,
  ChevronDown,
  Building2,
  X,
  Home,
  Database,
  FileCheck,
  GitBranch
} from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description?: string;
}

interface BlockchainOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface AIOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface GovernanceOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  enhancedFeatures?: {
    aiAgents?: boolean;
    governanceHeatmap?: boolean;
    socialFeatures?: boolean;
  };
}

const baseTabs: Tab[] = [
  { 
    id: "validators", 
    label: "Validators", 
    icon: Shield, 
    color: "chart-4",
    description: "Validator leaderboard with reputation scores and community endorsements"
  },
  { 
    id: "reputation", 
    label: "Reputation", 
    icon: Users, 
    color: "neon-magenta",
    description: "SBID-backed profiles and civic reputation system"
  }
];

const blockchainOptions: BlockchainOption[] = [
  {
    id: "blocks",
    label: "Blocks",
    icon: Blocks,
    description: "Recent blockchain blocks with social reputation overlays"
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: ArrowRightLeft,
    description: "Transaction feed with AI-powered insights and social context"
  },
  {
    id: "internal-transactions",
    label: "Internal Transactions",
    icon: GitBranch,
    description: "Internal contract calls and state changes"
  },
  {
    id: "verified-contracts",
    label: "Verified Contracts",
    icon: FileCheck,
    description: "Verified smart contracts with source code and ABI"
  }
];

const aiOptions: AIOption[] = [
  {
    id: "ai-agents",
    label: "Agents",
    icon: Brain,
    description: "Explainable AI agents with natural language summaries"
  },
  {
    id: "ai-trends",
    label: "Trends",
    icon: TrendingUp,
    description: "AI-detected ecosystem trends with explainable insights"
  }
];

const governanceOptions: GovernanceOption[] = [
  {
    id: "proposals",
    label: "Proposals",
    icon: Vote,
    description: "DAO governance proposals with voting heatmaps"
  },
  {
    id: "governance-heatmap",
    label: "Heatmap",
    icon: BarChart3,
    description: "Interactive governance participation visualization"
  }
];

export function TabNavigation({ activeTab, onTabChange, enhancedFeatures = {} }: TabNavigationProps) {
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isBlockchainTabActive = blockchainOptions.some(option => option.id === activeTab);
  const isAITabActive = activeTab === 'ai-agents' || activeTab === 'ai-trends';
  const isGovernanceTabActive = activeTab === 'proposals' || activeTab === 'governance-heatmap';

  // Enhanced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = document.getElementById('tab-container');
    if (container) {
      const hasOverflow = container.scrollWidth > container.clientWidth;
      setShowScrollButtons(hasOverflow);
      
      const handleScroll = () => {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
      };
      
      handleScroll();
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('tab-container');
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setIsSheetOpen(false);
  };

  // Handle escape key press to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSheetOpen) {
        setIsSheetOpen(false);
      }
    };

    if (isSheetOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling when menu is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isSheetOpen]);

  const getActiveLabel = () => {
    const currentTab = baseTabs.find(tab => tab.id === activeTab);
    if (currentTab) return currentTab.label;
    
    if (isBlockchainTabActive) {
      const blockchainOption = blockchainOptions.find(option => option.id === activeTab);
      return blockchainOption ? `Blockchain ${blockchainOption.label}` : 'Blockchain';
    }
    
    if (isAITabActive) {
      const aiOption = aiOptions.find(option => option.id === activeTab);
      return aiOption ? `AI ${aiOption.label}` : 'AI';
    }
    
    if (isGovernanceTabActive) {
      const govOption = governanceOptions.find(option => option.id === activeTab);
      return govOption ? `Gov ${govOption.label}` : 'Governance';
    }
    
    return 'Dashboard';
  };

  return (
    <>
      {/* Mobile Navigation */}
      {isMobile ? (
        <div 
          className="flex items-center justify-between py-3 px-4 bg-card/40 backdrop-blur-sm border-b border-border/50 relative z-10 w-full" 
          style={{ 
            paddingLeft: 'max(1rem, env(safe-area-inset-left))', 
            paddingRight: 'max(1rem, env(safe-area-inset-right))', 
            paddingTop: 'max(0.75rem, env(safe-area-inset-top))' 
          }}
        >
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-2 px-3 py-2 h-auto hover:bg-muted/20 touch-optimized rounded-lg"
            onClick={() => setIsSheetOpen(true)}
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium">Menu</span>
          </Button>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Current Tab Indicator - Moved to Right */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 px-3 py-2 bg-muted/20 rounded-lg border border-border/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse flex-shrink-0" />
              <span className="text-sm font-semibold text-foreground truncate">{getActiveLabel()}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Navigation */
        <div className="relative flex items-center py-3 px-4 md:px-6">
          <div className="hidden md:flex items-center w-full">
            {showScrollButtons && (
              <Button variant="ghost" size="sm" onClick={() => scroll('left')}
                className={`mr-2 ${canScrollLeft ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`} disabled={!canScrollLeft}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}

            <div id="tab-container" className="flex items-center space-x-1 overflow-x-auto scrollbar-hide flex-1 mx-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* Blockchain Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" 
                    className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-300 border border-transparent whitespace-nowrap relative overflow-hidden group ${isBlockchainTabActive ? 'text-neon-blue border-neon-blue/30 bg-neon-blue/10' : 'text-muted-foreground hover:text-neon-blue'}`}>
                    <Database className={`w-4 h-4 relative z-10 ${isBlockchainTabActive ? '' : 'group-hover:scale-110 transition-transform duration-200'}`} />
                    <span className="text-xs md:text-sm font-medium relative z-10">Blockchain</span>
                    <ChevronDown className="w-3 h-3 relative z-10" />
                    {isBlockchainTabActive && (
                      <div className="w-1.5 h-1.5 rounded-full relative z-10 bg-neon-blue" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {blockchainOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = activeTab === option.id;
                    return (
                      <DropdownMenuItem key={option.id} onClick={() => onTabChange(option.id)}
                        className={`flex items-start space-x-3 p-3 cursor-pointer ${isActive ? 'bg-neon-blue/10 text-neon-blue' : ''}`}>
                        <Icon className="w-4 h-4 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {baseTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const colorClasses = isActive ? `text-${tab.color} border-${tab.color}/30 bg-${tab.color}/10` : `text-muted-foreground hover:text-${tab.color}`;
                
                return (
                  <Button key={tab.id} variant="ghost" onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-300 border border-transparent whitespace-nowrap relative overflow-hidden group ${colorClasses}`}>
                    <Icon className={`w-4 h-4 relative z-10 ${isActive ? '' : 'group-hover:scale-110 transition-transform duration-200'}`} />
                    <span className="text-xs md:text-sm font-medium relative z-10">{tab.label}</span>
                    {isActive && (
                      <div className={`w-1.5 h-1.5 rounded-full relative z-10 bg-${tab.color}`} />
                    )}
                  </Button>
                );
              })}
              
              {/* AI Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" 
                    className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-300 border border-transparent whitespace-nowrap relative overflow-hidden group ${isAITabActive ? 'text-chart-5 border-chart-5/30 bg-chart-5/10' : 'text-muted-foreground hover:text-chart-5'}`}>
                    <Bot className={`w-4 h-4 relative z-10 ${isAITabActive ? '' : 'group-hover:scale-110 transition-transform duration-200'}`} />
                    <span className="text-xs md:text-sm font-medium relative z-10">AI</span>
                    <ChevronDown className="w-3 h-3 relative z-10" />
                    {isAITabActive && (
                      <div className="w-1.5 h-1.5 rounded-full relative z-10 bg-chart-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {aiOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = activeTab === option.id;
                    return (
                      <DropdownMenuItem key={option.id} onClick={() => onTabChange(option.id)}
                        className={`flex items-start space-x-3 p-3 cursor-pointer ${isActive ? 'bg-chart-5/10 text-chart-5' : ''}`}>
                        <Icon className="w-4 h-4 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Governance Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" 
                    className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-300 border border-transparent whitespace-nowrap relative overflow-hidden group ${isGovernanceTabActive ? 'text-chart-3 border-chart-3/30 bg-chart-3/10' : 'text-muted-foreground hover:text-chart-3'}`}>
                    <Building2 className={`w-4 h-4 relative z-10 ${isGovernanceTabActive ? '' : 'group-hover:scale-110 transition-transform duration-200'}`} />
                    <span className="text-xs md:text-sm font-medium relative z-10">Governance</span>
                    <ChevronDown className="w-3 h-3 relative z-10" />
                    {isGovernanceTabActive && (
                      <div className="w-1.5 h-1.5 rounded-full relative z-10 bg-chart-3" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {governanceOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = activeTab === option.id;
                    return (
                      <DropdownMenuItem key={option.id} onClick={() => onTabChange(option.id)}
                        className={`flex items-start space-x-3 p-3 cursor-pointer ${isActive ? 'bg-chart-3/10 text-chart-3' : ''}`}>
                        <Icon className="w-4 h-4 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {showScrollButtons && (
              <Button variant="ghost" size="sm" onClick={() => scroll('right')}
                className={`ml-2 ${canScrollRight ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`} disabled={!canScrollRight}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay - Rendered as Portal */}
      {isSheetOpen && isMobile && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] bg-background/96 backdrop-blur-xl"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            isolation: 'isolate',
            height: '100vh',
            width: '100vw',
            maxHeight: '100vh',
            maxWidth: '100vw',
            overflow: 'hidden'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSheetOpen(false);
            }
          }}
        >
          <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 border-b border-border/30 bg-background/98 backdrop-blur-xl flex-shrink-0" 
              style={{ 
                paddingTop: `max(1rem, env(safe-area-inset-top))`, 
                paddingLeft: `max(1rem, env(safe-area-inset-left))`, 
                paddingRight: `max(1rem, env(safe-area-inset-right))` 
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-green/20 border border-neon-blue/30 flex items-center justify-center">
                  <Home className="w-4 h-4 text-neon-blue" />
                </div>
                <div>
                  <h2 className="font-bold">Navigation</h2>
                  <p className="text-xs text-muted-foreground">SocialBlock Explorer</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSheetOpen(false)}
                className="w-10 h-10 p-0 rounded-full hover:bg-muted/20 focus:bg-muted/20 touch-optimized"
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            
            {/* Content */}
            <div 
              className="flex-1 overflow-y-auto momentum-scroll"
              style={{ 
                paddingBottom: `max(1rem, env(safe-area-inset-bottom))`,
                paddingLeft: `max(1rem, env(safe-area-inset-left))`, 
                paddingRight: `max(1rem, env(safe-area-inset-right))` 
              }}
            >
              <div className="p-4 space-y-6">
                {/* Blockchain Section */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
                      <Database className="w-3 h-3 text-neon-blue" />
                    </div>
                    <span>Blockchain Data</span>
                  </div>
                  {blockchainOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = activeTab === option.id;
                    return (
                      <Button 
                        key={option.id} 
                        variant="ghost" 
                        onClick={() => handleTabChange(option.id)}
                        className={`w-full justify-start space-x-3 p-3 h-auto rounded-lg transition-all duration-300 touch-optimized ${
                          isActive 
                            ? 'text-neon-blue border-neon-blue/30 bg-neon-blue/10 border' 
                            : 'hover:bg-muted/50 hover:text-foreground border border-transparent'
                        }`}
                      >
                        <div className={`p-2 rounded-lg flex-shrink-0 ${isActive ? 'bg-neon-blue/20' : 'bg-muted/30'} transition-colors`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="font-semibold text-sm mb-0.5">{option.label}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            {option.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse flex-shrink-0" />
                        )}
                      </Button>
                    );
                  })}
                </div>
                
                {/* Main Tabs */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-chart-4/10 border border-chart-4/20 flex items-center justify-center">
                      <Users className="w-3 h-3 text-chart-4" />
                    </div>
                    <span>Main Sections</span>
                  </div>
                  {baseTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <Button 
                        key={tab.id} 
                        variant="ghost" 
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full justify-start space-x-3 p-3 h-auto rounded-lg transition-all duration-300 touch-optimized ${
                          isActive 
                            ? `text-${tab.color} border-${tab.color}/30 bg-${tab.color}/10 border` 
                            : 'hover:bg-muted/50 hover:text-foreground border border-transparent'
                        }`}
                      >
                        <div className={`p-2 rounded-lg flex-shrink-0 ${isActive ? `bg-${tab.color}/20` : 'bg-muted/30'} transition-colors`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="font-semibold text-sm mb-0.5">{tab.label}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            {tab.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className={`w-2 h-2 rounded-full bg-${tab.color} animate-pulse flex-shrink-0`} />
                        )}
                      </Button>
                    );
                  })}
                </div>
                
                {/* AI Section */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-chart-5/10 border border-chart-5/20 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-chart-5" />
                    </div>
                    <span>AI &amp; Analytics</span>
                  </div>
                  {aiOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = activeTab === option.id;
                    return (
                      <Button 
                        key={option.id} 
                        variant="ghost" 
                        onClick={() => handleTabChange(option.id)}
                        className={`w-full justify-start space-x-3 p-3 h-auto rounded-lg transition-all duration-300 touch-optimized ${
                          isActive 
                            ? 'text-chart-5 border-chart-5/30 bg-chart-5/10 border' 
                            : 'hover:bg-muted/50 hover:text-foreground border border-transparent'
                        }`}
                      >
                        <div className={`p-2 rounded-lg flex-shrink-0 ${isActive ? 'bg-chart-5/20' : 'bg-muted/30'} transition-colors`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="font-semibold text-sm mb-0.5">{option.label}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            {option.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-chart-5 animate-pulse flex-shrink-0" />
                        )}
                      </Button>
                    );
                  })}
                </div>

                {/* Governance Section */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-chart-3/10 border border-chart-3/20 flex items-center justify-center">
                      <Building2 className="w-3 h-3 text-chart-3" />
                    </div>
                    <span>Governance</span>
                  </div>
                  {governanceOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = activeTab === option.id;
                    return (
                      <Button 
                        key={option.id} 
                        variant="ghost" 
                        onClick={() => handleTabChange(option.id)}
                        className={`w-full justify-start space-x-3 p-3 h-auto rounded-lg transition-all duration-300 touch-optimized ${
                          isActive 
                            ? 'text-chart-3 border-chart-3/30 bg-chart-3/10 border' 
                            : 'hover:bg-muted/50 hover:text-foreground border border-transparent'
                        }`}
                      >
                        <div className={`p-2 rounded-lg flex-shrink-0 ${isActive ? 'bg-chart-3/20' : 'bg-muted/30'} transition-colors`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="font-semibold text-sm mb-0.5">{option.label}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            {option.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-chart-3 animate-pulse flex-shrink-0" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
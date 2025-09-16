import { useState, useEffect } from "react";
import { TopSearchBar } from "./components/TopSearchBar";
import { TabNavigation } from "./components/TabNavigation";
import { FooterStats } from "./components/FooterStats";
import { SBIDLogin } from "./components/SBIDLogin";
import { NetworkSelector } from "./components/NetworkSelector";
import { BlocksTab } from "./components/tabs/BlocksTab";
import { TransactionsTab } from "./components/tabs/TransactionsTab";
import { InternalTransactionsTab } from "./components/tabs/InternalTransactionsTab";
import { VerifiedContractsTab } from "./components/tabs/VerifiedContractsTab";
import { ValidatorsTab } from "./components/tabs/ValidatorsTab";
import { ReputationTab } from "./components/tabs/ReputationTab";
import { AITrendsTab } from "./components/tabs/AITrendsTab";
import { ProposalsTab } from "./components/tabs/ProposalsTab";
import { AIAgentSummarizer } from "./components/AIAgentSummarizer";
import { GovernanceHeatmap } from "./components/GovernanceHeatmap";
import { BlockDetails } from "./components/BlockDetails";
import { SubscriptionProvider } from "./components/SubscriptionManager";
import { Badge } from "./components/ui/badge";
import { Target } from "lucide-react";
import logoImage from 'figma:asset/c3ff7770c1f0eef69ed48c087579b26eb82adf03.png';

export default function App() {
  const [activeTab, setActiveTab] = useState("blocks");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'blockDetails'>('dashboard');
  const [selectedBlockHeight, setSelectedBlockHeight] = useState<number | null>(null);

  // Enhanced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleBlockNavigation = (blockHeight: number) => {
    setSelectedBlockHeight(blockHeight);
    setCurrentView('blockDetails');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedBlockHeight(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "blocks":
        return <BlocksTab onBlockClick={handleBlockNavigation} />;
      case "transactions":
        return <TransactionsTab />;
      case "internal-transactions":
        return <InternalTransactionsTab />;
      case "verified-contracts":
        return <VerifiedContractsTab />;
      case "validators":
        return <ValidatorsTab />;
      case "reputation":
        return <ReputationTab />;
      case "ai-trends":
        return <AITrendsTab />;
      case "proposals":
        return <ProposalsTab />;
      case "ai-agents":
        return <AIAgentSummarizer />;
      case "governance-heatmap":
        return <GovernanceHeatmap />;
      default:
        return <BlocksTab onBlockClick={handleBlockNavigation} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src={logoImage} 
            alt="SocialBlock Explorer" 
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl animate-pulse"
          />
          <div className="w-8 h-1 bg-neon-blue/20 rounded-full overflow-hidden">
            <div className="w-full h-full bg-neon-blue rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render Block Details view
  if (currentView === 'blockDetails' && selectedBlockHeight !== null) {
    return (
      <SubscriptionProvider>
        <div className="h-screen bg-background text-foreground dark flex flex-col relative overflow-hidden">
          <BlockDetails 
            blockHeight={selectedBlockHeight} 
            onBack={handleBackToDashboard}
          />
        </div>
      </SubscriptionProvider>
    );
  }

  return (
    <SubscriptionProvider>
      <div className="h-screen bg-background text-foreground dark flex flex-col relative overflow-hidden">
        {/* Clean minimal background - responsive */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0 opacity-3"
            style={{
              backgroundImage: `
                linear-gradient(rgba(151, 241, 29, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(151, 241, 29, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: isMobile ? '30px 30px' : '50px 50px'
            }}
          ></div>
        </div>

        {/* Enhanced Header Section - Mobile Optimized */}
        <header className="relative z-30 flex-shrink-0 sticky top-0">
          {/* Top Header with Logo, Search, and Controls */}
          <div className="backdrop-blur-xl border-b border-border/50 bg-card/80">
            <div className="w-full py-3 px-4 md:py-4 md:px-6">
              {/* Grid Layout for Perfect Centering - Responsive */}
              <div className="grid grid-cols-3 items-center gap-2 sm:gap-4 w-full"
                   style={{ 
                     gridTemplateColumns: isMobile 
                       ? 'minmax(auto, 1fr) minmax(0, 2fr) minmax(auto, 1fr)' 
                       : '1fr 2fr 1fr' 
                   }}>
                {/* Left Section - Logo */}
                <div className="flex items-center justify-start">
                  <img 
                    src={logoImage} 
                    alt="SocialBlock Explorer" 
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg"
                  />
                  {!isMobile && (
                    <div className="ml-3">
                      <h1 className="text-lg md:text-xl font-bold text-neon-blue">SocialBlock</h1>
                      <p className="text-xs text-muted-foreground">Explorer</p>
                    </div>
                  )}
                </div>

                {/* Center Section - Search Bar (Perfectly Centered on All Screen Sizes) */}
                <div className="flex items-center justify-center w-full">
                  <div className="w-full max-w-2xl min-w-0">
                    <TopSearchBar />
                  </div>
                </div>

                {/* Right Section - SBID Login & Network Selector */}
                <div className="flex items-center justify-end space-x-2 sm:space-x-3">
                  {/* Network Selector */}
                  <NetworkSelector />
                  
                  {/* SBID Login */}
                  <SBIDLogin />
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Tab Navigation - Mobile First */}
          <div className="backdrop-blur-xl border-b border-border/50 bg-card/80">
            <div className={isMobile ? '' : 'container-cyber'}>
              <TabNavigation 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                enhancedFeatures={{
                  aiAgents: true,
                  governanceHeatmap: true,
                  socialFeatures: true
                }}
              />
            </div>
          </div>
        </header>
        
        {/* Enhanced Main Content Window - Mobile Optimized */}
        <main className="flex-1 relative z-10 overflow-y-auto overflow-x-hidden">
          <div className={`transition-all duration-300 ${
            isMobile 
              ? 'p-3 py-4' 
              : 'p-4 md:p-6'
          }`}>
            <div className={`${isMobile ? '' : 'container-cyber'} ${
              isMobile 
                ? 'py-2' 
                : 'py-4 md:py-6 lg:py-8'
            }`}>
              {/* Tab content with enhanced animations and mobile optimization */}
              <div 
                key={activeTab}
                className="animate-in fade-in-50 duration-300 space-y-4 md:space-y-6"
              >
                {/* Civic Transparency Banner - Mobile Optimized */}
                {(activeTab === 'reputation' || activeTab === 'ai-agents' || activeTab === 'governance-heatmap') && (
                  <div className="p-3 md:p-4 bg-neon-blue/5 border border-neon-blue/20 rounded-lg">
                    <div className="flex items-start space-x-2 mb-2">
                      <Target className="w-4 h-4 text-neon-blue flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-neon-blue">Civic Transparency Notice</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pl-6">
                      {activeTab === 'reputation' && "All reputation scores are calculated using transparent, auditable algorithms. SBID verification ensures authentic identity without compromising privacy."}
                      {activeTab === 'ai-agents' && "AI agent decisions are explainable and auditable. All reasoning and data sources are disclosed for community review and accountability."}
                      {activeTab === 'governance-heatmap' && "Governance data visualization promotes democratic transparency. All voting patterns and participation metrics are public and verifiable."}
                    </p>
                  </div>
                )}

                {renderTabContent()}
              </div>
            </div>
          </div>
        </main>
        
        {/* Enhanced Footer - Mobile Optimized */}
        <footer className="relative z-30 flex-shrink-0">
          <div className="backdrop-blur-xl border-t border-border/50 bg-card/80">
            <FooterStats 
              socialMetrics={{
                activeAIAgents: 156,
                reputationAccounts: 45673,
                governanceParticipation: 72,
                communityEndorsements: 12847
              }}
            />
          </div>
        </footer>

        {/* Enhanced Accessibility Features - Mobile Optimized */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-3 md:px-4 py-2 bg-neon-blue text-background rounded-md font-medium text-sm"
        >
          Skip to main content
        </a>
        
        <a 
          href="#transparency-info"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 z-50 px-3 md:px-4 py-2 bg-neon-green text-background rounded-md font-medium text-sm"
        >
          View transparency info
        </a>
        
        <div id="main-content" className="sr-only">
          Main content area for {activeTab} tab
        </div>
        
        <div id="transparency-info" className="sr-only">
          Civic transparency and accountability information available in settings
        </div>
      </div>
    </SubscriptionProvider>
  );
}
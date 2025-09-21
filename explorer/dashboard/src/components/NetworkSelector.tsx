import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { 
  Globe, 
  Zap, 
  TestTube,
  ChevronDown,
  Check,
  Activity,
  Clock,
  Shield,
  AlertTriangle
} from "lucide-react";

interface Network {
  id: "mainnet" | "testnet";
  name: string;
  displayName: string;
  icon: React.ReactNode;
  status: "online" | "maintenance" | "degraded";
  chainId: string;
  blockHeight: number;
  avgBlockTime: string;
  color: string;
  borderColor: string;
  bgColor: string;
  description: string;
}

export function NetworkSelector() {
  const [selectedNetwork, setSelectedNetwork] = useState<"mainnet" | "testnet">("mainnet");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Enhanced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const networks: Network[] = [
    {
      id: "mainnet",
      name: "SocialBlock",
      displayName: "Mainnet",
      icon: <Globe className="w-4 h-4" />,
      status: "online",
      chainId: "socialblock-1",
      blockHeight: 2847392,
      avgBlockTime: "2.1s",
      color: "text-neon-blue",
      borderColor: "border-neon-blue/30",
      bgColor: "bg-neon-blue/5",
      description: "Production network with real assets and live governance"
    },
    {
      id: "testnet",
      name: "SocialBlock Testnet",
      displayName: "Testnet",
      icon: <TestTube className="w-4 h-4" />,
      status: "online",
      chainId: "socialblock-testnet-1",
      blockHeight: 1492847,
      avgBlockTime: "2.3s",
      color: "text-neon-green",
      borderColor: "border-neon-green/30",
      bgColor: "bg-neon-green/5",
      description: "Safe testing environment with test tokens and features"
    }
  ];

  const currentNetwork = networks.find(n => n.id === selectedNetwork)!;

  const handleNetworkSwitch = (networkId: "mainnet" | "testnet") => {
    setSelectedNetwork(networkId);
    setIsOpen(false);
    
    // Simulate network switch
    console.log(`Switching to ${networkId}`);
    
    // In a real app, this would trigger a full network switch
    // including updating all data sources, API endpoints, etc.
  };

  const getStatusIcon = (status: Network['status']) => {
    switch (status) {
      case "online":
        return <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />;
      case "maintenance":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />;
      case "degraded":
        return <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />;
      default:
        return <div className="w-2 h-2 bg-muted-foreground rounded-full" />;
    }
  };

  const getStatusColor = (status: Network['status']) => {
    switch (status) {
      case "online": return "text-neon-green";
      case "maintenance": return "text-yellow-500";
      case "degraded": return "text-orange-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusText = (status: Network['status']) => {
    switch (status) {
      case "online": return "Operational";
      case "maintenance": return "Maintenance";
      case "degraded": return "Degraded";
      default: return "Unknown";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`
            ${currentNetwork.bgColor} backdrop-blur-sm ${currentNetwork.borderColor} 
            hover:${currentNetwork.borderColor.replace('/30', '/50')} 
            hover:${currentNetwork.bgColor.replace('/5', '/10')} 
            transition-all duration-300 touch-target
            ${isMobile ? 'px-2 py-2' : 'px-3 py-2'}
          `}
        >
          <div className="flex items-center space-x-2">
            <div className={`${currentNetwork.color}`}>
              {currentNetwork.icon}
            </div>
            
            {!isMobile && (
              <span className={`text-sm font-medium ${currentNetwork.color}`}>
                {currentNetwork.displayName}
              </span>
            )}
            
            <div className="flex items-center space-x-1">
              {getStatusIcon(currentNetwork.status)}
              {!isMobile && (
                <span className={`text-xs ${getStatusColor(currentNetwork.status)}`}>
                  {getStatusText(currentNetwork.status)}
                </span>
              )}
            </div>
            
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 bg-card/95 backdrop-blur-sm border border-border/50 shadow-xl"
        side={isMobile ? "bottom" : "bottom"}
        align="end"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-neon-blue" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Network Selection</h3>
              <p className="text-xs text-muted-foreground">Choose your blockchain environment</p>
            </div>
          </div>

          <Separator />

          {/* Network Options */}
          <div className="space-y-3">
            {networks.map((network) => {
              const isSelected = network.id === selectedNetwork;
              
              return (
                <Card
                  key={network.id}
                  className={`cursor-pointer transition-all duration-200 hover:bg-muted/30 ${
                    isSelected 
                      ? `${network.bgColor} ${network.borderColor}` 
                      : 'bg-transparent border-border/30 hover:border-border/50'
                  }`}
                  onClick={() => handleNetworkSwitch(network.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg ${network.bgColor} flex items-center justify-center`}>
                          <div className={network.color}>
                            {network.icon}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-medium text-sm ${isSelected ? network.color : 'text-foreground'}`}>
                              {network.name}
                            </h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-2 py-0.5 ${
                                isSelected 
                                  ? `${network.color} ${network.borderColor}` 
                                  : 'text-muted-foreground border-muted-foreground/30'
                              }`}
                            >
                              {network.displayName}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                            {network.description}
                          </p>
                          
                          {/* Network Stats */}
                          <div className="space-y-1.5">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Activity className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Status:</span>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(network.status)}
                                  <span className={`text-xs ${getStatusColor(network.status)}`}>
                                    {getStatusText(network.status)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Zap className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  Block: #{network.blockHeight.toLocaleString()}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  ~{network.avgBlockTime}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Shield className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground font-mono">
                                {network.chainId}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className={`w-5 h-5 rounded-full ${network.bgColor} flex items-center justify-center`}>
                          <Check className={`w-3 h-3 ${network.color}`} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Separator />

          {/* Warning for Testnet */}
          {selectedNetwork === "testnet" && (
            <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-yellow-500 mb-1">
                    Testnet Environment
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You're using test tokens with no real value. Testnet may be reset periodically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Network Switch Info */}
          <div className="p-2 bg-muted/20 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Switching networks will reload all data and disconnect any active sessions.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
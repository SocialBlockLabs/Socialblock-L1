import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { 
  Shield, 
  User, 
  LogIn, 
  LogOut, 
  Settings, 
  Star, 
  Award, 
  Lock, 
  Unlock,
  ChevronDown,
  Copy,
  Check,
  Zap
} from "lucide-react";

interface SBIDUser {
  id: string;
  address: string;
  reputation: number;
  level: "Citizen" | "Guardian" | "Validator" | "Council";
  verified: boolean;
  endorsements: number;
  joinedDate: string;
}

export function SBIDLogin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [user, setUser] = useState<SBIDUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  // Enhanced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mockUser: SBIDUser = {
    id: "sbid:0x7f3a...8d2e",
    address: "sblk1x9m2k7p4q8w3e6r5t7y1u2i9o0p3a5s8d1f4g7h2j5k8l1n4m7",
    reputation: 8750,
    level: "Guardian",
    verified: true,
    endorsements: 47,
    joinedDate: "2023-03-15"
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate SBID connection process
    setTimeout(() => {
      setUser(mockUser);
      setIsAuthenticated(true);
      setIsConnecting(false);
      setIsOpen(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsOpen(false);
  };

  const copyAddress = async () => {
    if (user) {
      await navigator.clipboard.writeText(user.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    if (isMobile) {
      return `${address.slice(0, 8)}...${address.slice(-6)}`;
    }
    return `${address.slice(0, 12)}...${address.slice(-8)}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Council": return "text-neon-purple border-neon-purple/30 bg-neon-purple/10";
      case "Validator": return "text-neon-blue border-neon-blue/30 bg-neon-blue/10";
      case "Guardian": return "text-neon-green border-neon-green/30 bg-neon-green/10";
      case "Citizen": return "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10";
      default: return "text-muted-foreground border-border/30";
    }
  };

  const getReputationStatus = (reputation: number) => {
    if (reputation >= 9000) return { label: "Exceptional", color: "text-neon-purple" };
    if (reputation >= 7500) return { label: "Excellent", color: "text-neon-blue" };
    if (reputation >= 5000) return { label: "Good", color: "text-neon-green" };
    if (reputation >= 2500) return { label: "Fair", color: "text-neon-cyan" };
    return { label: "New", color: "text-muted-foreground" };
  };

  if (!isAuthenticated) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`
              bg-card/60 backdrop-blur-sm border-border/30 hover:border-neon-blue/50 
              hover:bg-neon-blue/5 transition-all duration-300 touch-target
              ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'}
            `}
          >
            <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
            {isMobile ? 'SBID' : 'Connect SBID'}
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
                <Shield className="w-4 h-4 text-neon-blue" />
              </div>
              <div>
                <h3 className="font-medium text-sm">SocialBlock ID</h3>
                <p className="text-xs text-muted-foreground">Secure Identity Verification</p>
              </div>
            </div>

            <Separator />

            {/* Connection Options */}
            <div className="space-y-3">
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30 hover:border-neon-blue/50"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Connect with SBID
                  </>
                )}
              </Button>

              {/* Info */}
              <div className="p-3 bg-neon-green/5 border border-neon-green/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lock className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-neon-green mb-1">
                      Secure & Private
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      SBID uses zero-knowledge proofs to verify your identity without compromising privacy. 
                      Your reputation and credentials remain fully under your control.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Benefits:</p>
                <div className="space-y-1.5">
                  {[
                    "Access to governance features",
                    "Enhanced reputation tracking",
                    "Priority AI agent interactions",
                    "Exclusive validator insights"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-neon-green rounded-full" />
                      <span className="text-xs text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`
            bg-neon-green/5 backdrop-blur-sm border-neon-green/30 hover:border-neon-green/50 
            hover:bg-neon-green/10 transition-all duration-300 touch-target
            ${isMobile ? 'px-2 py-2' : 'px-3 py-2'}
          `}
        >
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center">
              <User className="w-3 h-3 text-neon-green" />
            </div>
            {!isMobile && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {user.level}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-neon-green" />
                  <span className="text-xs text-neon-green font-medium">
                    {user.reputation.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
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
          {/* User Header */}
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-xl bg-neon-green/20 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-neon-green" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Badge 
                  variant="outline" 
                  className={`${getLevelColor(user.level)} text-xs px-2 py-0.5`}
                >
                  {user.level}
                </Badge>
                {user.verified && (
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 text-neon-blue" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1 mb-2">
                <button
                  onClick={copyAddress}
                  className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span className="font-mono">
                    {formatAddress(user.address)}
                  </span>
                  {copied ? (
                    <Check className="w-3 h-3 text-neon-green" />
                  ) : (
                    <Copy className="w-3 h-3 group-hover:text-neon-green transition-colors" />
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Reputation</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-neon-green" />
                    <span className="text-xs font-medium text-neon-green">
                      {user.reputation.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-border/30 rounded-full h-1.5">
                  <div 
                    className="bg-neon-green h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(user.reputation / 10000) * 100}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${getReputationStatus(user.reputation).color}`}>
                    {getReputationStatus(user.reputation).label}
                  </span>
                  <span className="text-muted-foreground">
                    {user.endorsements} endorsements
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-2 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Award className="w-4 h-4 text-neon-blue" />
              </div>
              <div className="text-xs font-medium text-foreground">Member Since</div>
              <div className="text-xs text-muted-foreground">
                {new Date(user.joinedDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </div>
            </div>
            
            <div className="text-center p-2 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Zap className="w-4 h-4 text-neon-green" />
              </div>
              <div className="text-xs font-medium text-foreground">Activity</div>
              <div className="text-xs text-neon-green">Active</div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs hover:bg-muted/30"
            >
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="w-full justify-start text-xs hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
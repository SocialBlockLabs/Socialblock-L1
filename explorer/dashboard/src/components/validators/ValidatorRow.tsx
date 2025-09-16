import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { FollowButton } from "../FollowButton";
import { useFollowButton } from "../SubscriptionManager";
import { UptimeSparkline } from "./UptimeSparkline";
import { getArpScoreColor } from "./ValidatorUtils";
import { TIER_CONFIGS } from "./ValidatorConstants";
import type { ValidatorData } from "./ValidatorUtils";
import { 
  Coins,
  Eye,
  Flag,
  Star,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface ValidatorRowProps {
  validator: ValidatorData;
  index: number;
  onStake: (validatorId: string) => void;
  onViewNode: (validatorId: string) => void;
  onFlag: (validatorId: string) => void;
}

export function ValidatorRow({ validator, index, onStake, onViewNode, onFlag }: ValidatorRowProps) {
  const followProps = useFollowButton(validator.address, 'validator', validator.name);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getStatusIcon = () => {
    if (validator.status === "active") {
      return <CheckCircle className="w-4 h-4 text-neon-green" />;
    }
    return <AlertTriangle className="w-4 h-4 text-chart-4" />;
  };

  const getTierBadge = () => {
    const tierConfig = TIER_CONFIGS[validator.tier];
    return <Badge variant="outline" className={`text-xs ${tierConfig.color}`}>{tierConfig.label}</Badge>;
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-green/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative p-4 rounded-xl border border-border/50 group-hover:border-neon-blue/30 transition-all duration-300 bg-card/80 backdrop-blur-sm">
          {/* Mobile Header */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex flex-col items-center space-y-1 flex-shrink-0">
              <div className="text-sm font-bold text-neon-blue">#{index + 1}</div>
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-br from-neon-blue via-chart-1 to-neon-green text-black font-medium">
                  {validator.avatar}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-foreground truncate">{validator.name}</span>
                {validator.verified && <CheckCircle className="w-4 h-4 text-neon-blue flex-shrink-0" />}
                {getStatusIcon()}
              </div>
              <div className="text-sm text-muted-foreground truncate mb-2">{validator.alias}</div>
              <div className="flex items-center space-x-2 mb-2">
                {getTierBadge()}
                <Badge variant="outline" className={`text-xs font-mono ${getArpScoreColor(validator.arpScore)}`}>
                  <Star className="w-3 h-3 mr-1" />
                  {validator.arpScore}
                </Badge>
              </div>
            </div>
          </div>

          {/* Mobile Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/10 rounded-lg border border-border/20">
            <div className="text-center">
              <div className="font-mono font-bold text-neon-green text-lg">
                {validator.totalStaked}
              </div>
              <div className="text-xs text-muted-foreground">SBLK Staked</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-neon-blue text-lg">
                {validator.uptime.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-chart-4 text-lg">
                {validator.apy.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">APY</div>
            </div>
            <div className="text-center">
              <div className="font-mono font-bold text-foreground text-lg">
                {validator.stakersCount}
              </div>
              <div className="text-xs text-muted-foreground">Stakers</div>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="default"
                className="bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30 hover:border-neon-blue/50 transition-all h-12 touch-optimized"
                onClick={() => onStake(validator.id)}
              >
                <Coins className="w-4 h-4 mr-2" />
                Stake
              </Button>
              <Button
                size="default"
                variant="outline"
                className="border-muted-foreground/30 hover:bg-muted/50 h-12 touch-optimized"
                onClick={() => onViewNode(validator.id)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <FollowButton
                id={validator.address}
                type="validator"
                name={validator.name}
                isFollowing={followProps.isFollowing}
                onFollowChange={followProps.onFollowChange}
                onOpenSubscriptions={followProps.onOpenSubscriptions}
                size="sm"
              />
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Last: {validator.lastActive}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 p-2 touch-optimized"
                  onClick={() => onFlag(validator.id)}
                >
                  <Flag className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="group relative">
      {/* Hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-card via-card/95 to-card rounded-lg"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-green/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative p-6 rounded-lg border border-border/50 group-hover:border-neon-blue/30 transition-all duration-300">
        <div className="grid grid-cols-12 gap-6 items-center">
          
          {/* Rank & Avatar */}
          <div className="col-span-1 flex flex-col items-center justify-center space-y-2">
            <div className="text-lg font-medium text-muted-foreground">#{index + 1}</div>
          </div>

          {/* Avatar + Details */}
          <div className="col-span-3">
            <div className="flex items-center space-x-4">
              {/* Clean single avatar */}
              <Avatar className="w-12 h-12 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-neon-blue via-chart-1 to-neon-green text-black text-sm font-medium">
                  {validator.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground truncate text-sm">{validator.name}</span>
                  {validator.verified && (
                    <CheckCircle className="w-4 h-4 text-neon-blue flex-shrink-0" />
                  )}
                  {getStatusIcon()}
                </div>
                <div className="text-xs text-muted-foreground truncate">{validator.alias}</div>
                <div className="flex items-center space-x-2">
                  {getTierBadge()}
                  <span className="text-xs text-muted-foreground">{validator.stakersCount} stakers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Staked SBLK */}
          <div className="col-span-2 flex flex-col items-center justify-center space-y-1">
            <div className="text-lg font-mono font-medium text-neon-green">
              {validator.totalStaked}
            </div>
            <div className="text-xs text-muted-foreground font-medium">SBLK</div>
            <div className="text-xs text-neon-blue font-medium">
              {validator.apy.toFixed(1)}% APY
            </div>
          </div>

          {/* ARP Score Badge */}
          <div className="col-span-1 flex justify-center">
            <div className="flex flex-col items-center space-y-1">
              <Badge variant="outline" className={`${getArpScoreColor(validator.arpScore)} font-mono text-xs px-3 py-1`}>
                <Star className="w-3 h-3 mr-1" />
                {validator.arpScore}
              </Badge>
              <div className="text-xs text-muted-foreground font-medium">ARP Score</div>
            </div>
          </div>

          {/* Enhanced Uptime Sparkline */}
          <div className="col-span-2 flex justify-center">
            <div className="w-full max-w-[140px]">
              <UptimeSparkline data={validator.uptimeData} uptime={validator.uptime} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="col-span-3">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <FollowButton
                  id={validator.address}
                  type="validator"
                  name={validator.name}
                  isFollowing={followProps.isFollowing}
                  onFollowChange={followProps.onFollowChange}
                  onOpenSubscriptions={followProps.onOpenSubscriptions}
                  size="sm"
                />
                <Button
                  size="sm"
                  className="bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30 hover:border-neon-blue/50 transition-all px-3"
                  onClick={() => onStake(validator.id)}
                >
                  <Coins className="w-3 h-3 mr-1" />
                  Stake
                </Button>
                <Button
                  size="sm" 
                  variant="outline"
                  className="border-muted-foreground/30 hover:bg-muted/50 px-3"
                  onClick={() => onViewNode(validator.id)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 px-2"
                  onClick={() => onFlag(validator.id)}
                >
                  <Flag className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Last active: {validator.lastActive}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
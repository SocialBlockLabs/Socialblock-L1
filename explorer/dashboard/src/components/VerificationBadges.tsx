import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { 
  Shield, 
  CheckCircle, 
  Verified, 
  Globe, 
  Lock, 
  Eye, 
  Fingerprint,
  Award,
  Star,
  Zap,
  Crown,
  Diamond
} from "lucide-react";

interface VerificationStatus {
  id: string;
  type: 'sbid' | 'civic' | 'ens' | 'ceramic' | 'didx' | 'kyc' | 'biometric' | 'social' | 'developer' | 'validator' | 'premium';
  verified: boolean;
  timestamp?: string;
  provider?: string;
  confidence?: number;
}

interface VerificationBadgesProps {
  verifications: VerificationStatus[];
  layout?: 'horizontal' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

const verificationConfig = {
  sbid: {
    icon: Fingerprint,
    label: 'SBID Proof',
    description: 'Social Block identity verification',
    color: 'text-neon-blue border-neon-blue/30 bg-neon-blue/10',
    unverifiedColor: 'text-muted-foreground border-muted-foreground/30 bg-muted/10'
  },
  civic: {
    icon: Shield,
    label: 'Civic Verified',
    description: 'Civic identity verification',
    color: 'text-neon-green border-neon-green/30 bg-neon-green/10',
    unverifiedColor: 'text-muted-foreground border-muted-foreground/30 bg-muted/10'
  },
  ens: {
    icon: Globe,
    label: 'ENS Domain',
    description: 'Ethereum Name Service verified',
    color: 'text-chart-4 border-chart-4/30 bg-chart-4/10',
    unverifiedColor: 'text-muted-foreground border-muted-foreground/30 bg-muted/10'
  },
  ceramic: {
    icon: Lock,
    label: 'Ceramic DID',
    description: 'Ceramic Network decentralized identity',
    color: 'text-chart-5 border-chart-5/30 bg-chart-5/10',
    unverifiedColor: 'text-muted-foreground border-muted-foreground/30 bg-muted/10'
  },
  didx: {
    icon: Eye,
    label: 'DIDX Profile',
    description: 'Decentralized Identity Exchange verified',
    color: 'text-neon-magenta border-neon-magenta/30 bg-neon-magenta/10',
    unverifiedColor: 'text-muted-foreground border-muted-foreground/30 bg-muted/10'
  },
  kyc: {
    icon: CheckCircle,
    label: 'KYC Verified',
    description: 'Know Your Customer verification completed',
    color: 'text-neon-green border-neon-green/30 bg-neon-green/10',
    unverifiedColor: 'text-muted-foreground border-muted-foreground/30 bg-muted/10'
  },
  biometric: {
    icon: Fingerprint,
    label: 'Biometric ID',
    description: 'Biometric identity verification',
    color: 'text-chart-3 border-chart-3/30 bg-chart-3/10',
    unverifiedColor: 'text-muted-foreground border-muted-foreground/30 bg-muted/10'
  },
  social: {
    icon: Star,
    label: 'Social Proof',
    description: 'Social media account verification',
    color: 'text-neon-blue border-neon-blue/30 bg-neon-blue/10',
    unverifiedColor: 'text-muted-foreground border-muted-foreground/30 bg-muted/10'
  },
  developer: {
    icon: Award,
    label: 'Developer',
    description: 'Verified protocol developer',
    color: 'text-neon-green border-neon-green/30 bg-neon-green/10',
    unverifiedColor: 'text-muted-foreground border-muted-foreground/30 bg-muted/10'
  },
  validator: {
    icon: Zap,
    label: 'Validator',
    description: 'Active network validator',
    color: 'text-chart-4 border-chart-4/30 bg-chart-4/10',
    unverifiedColor: 'text-muted-foreground border-muted-foreground/30 bg-muted/10'
  },
  premium: {
    icon: Crown,
    label: 'Premium',
    description: 'Premium account holder',
    color: 'text-neon-magenta border-neon-magenta/30 bg-neon-magenta/10',
    unverifiedColor: 'text-muted-foreground border-muted-foreground/30 bg-muted/10'
  }
};

export function VerificationBadges({ 
  verifications, 
  layout = 'horizontal', 
  size = 'md',
  showLabels = true,
  className = ''
}: VerificationBadgesProps) {
  const sizeConfig = {
    sm: { badge: 'text-xs px-2 py-1', icon: 'w-3 h-3' },
    md: { badge: 'text-sm px-3 py-1.5', icon: 'w-4 h-4' },
    lg: { badge: 'text-base px-4 py-2', icon: 'w-5 h-5' }
  };

  const config = sizeConfig[size];
  const containerClass = layout === 'grid' 
    ? 'grid grid-cols-2 sm:grid-cols-3 gap-2' 
    : 'flex flex-wrap gap-2';

  return (
    <TooltipProvider>
      <div className={`${containerClass} ${className}`}>
        {verifications.map((verification) => {
          const verConfig = verificationConfig[verification.type];
          const Icon = verConfig.icon;
          const isVerified = verification.verified;
          const badgeColor = isVerified ? verConfig.color : verConfig.unverifiedColor;

          return (
            <Tooltip key={verification.id}>
              <TooltipTrigger asChild>
                <Badge 
                  variant="outline" 
                  className={`
                    ${config.badge} 
                    ${badgeColor} 
                    flex items-center space-x-1.5 
                    cursor-pointer 
                    transition-all duration-300 
                    hover:scale-105
                    ${isVerified ? 'hover:shadow-lg' : ''}
                  `}
                  style={isVerified ? {
                    boxShadow: `0 0 10px ${verConfig.color.includes('neon-blue') ? 'rgba(0, 245, 255, 0.3)' : 
                                            verConfig.color.includes('neon-green') ? 'rgba(0, 255, 65, 0.3)' :
                                            verConfig.color.includes('neon-magenta') ? 'rgba(255, 0, 255, 0.3)' :
                                            'rgba(136, 136, 136, 0.2)'}`
                  } : {}}
                >
                  <Icon className={config.icon} />
                  {showLabels && <span>{verConfig.label}</span>}
                  {isVerified && verification.confidence && verification.confidence >= 95 && (
                    <Diamond className="w-2 h-2 text-neon-green" />
                  )}
                </Badge>
              </TooltipTrigger>
              
              <TooltipContent 
                side="top" 
                className="max-w-64 bg-card/95 backdrop-blur-xl border-border/50"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{verConfig.label}</span>
                    {isVerified ? (
                      <CheckCircle className="w-3 h-3 text-neon-green" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-muted-foreground/50" />
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {verConfig.description}
                  </p>
                  
                  {verification.provider && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">Provider: </span>
                      <span className="font-medium">{verification.provider}</span>
                    </div>
                  )}
                  
                  {verification.confidence && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">Confidence: </span>
                      <span className="font-medium">{verification.confidence}%</span>
                    </div>
                  )}
                  
                  {verification.timestamp && (
                    <div className="text-xs text-muted-foreground">
                      Verified: {verification.timestamp}
                    </div>
                  )}
                  
                  <div className={`text-xs font-medium ${
                    isVerified ? 'text-neon-green' : 'text-muted-foreground'
                  }`}>
                    {isVerified ? '✓ Verified' : '○ Not Verified'}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
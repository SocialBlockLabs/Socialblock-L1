import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Gift, Map, Target, ExternalLink } from "lucide-react";

export function AirdropClaimMap() {
  return (
    <div className="h-full flex flex-col bg-card/95 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-neon-magenta/10 border border-neon-magenta/30">
            <Gift className="w-4 h-4 text-neon-magenta" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Airdrop Claim Map</h3>
            <p className="text-xs text-muted-foreground">Interactive token distribution mapping</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-neon-magenta/10 border border-neon-magenta/30 flex items-center justify-center">
            <Map className="w-8 h-8 text-neon-magenta" />
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Coming Soon</h4>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Interactive airdrop claim mapping with real-time distribution tracking, 
              eligibility verification, and claim status monitoring across multiple protocols.
            </p>
          </div>

          <div className="flex flex-col space-y-3 mt-6">
            <Badge variant="outline" className="text-xs text-neon-magenta border-neon-magenta/30 bg-neon-magenta/10">
              <Target className="w-3 h-3 mr-1" />
              In Development
            </Badge>
            
            <Button variant="outline" size="sm" className="border-neon-magenta/30 text-neon-magenta hover:bg-neon-magenta/10">
              <ExternalLink className="w-3 h-3 mr-2" />
              Request Early Access
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
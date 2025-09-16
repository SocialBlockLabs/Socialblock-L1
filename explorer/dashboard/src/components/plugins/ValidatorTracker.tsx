import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Activity, BarChart3, Target, ExternalLink } from "lucide-react";

export function ValidatorTracker() {
  return (
    <div className="h-full flex flex-col bg-card/95 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/30">
            <Activity className="w-4 h-4 text-neon-blue" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Validator Tracker</h3>
            <p className="text-xs text-muted-foreground">Advanced validator performance analytics</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-neon-blue" />
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Coming Soon</h4>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Comprehensive validator performance tracking with uptime monitoring, 
              reward analytics, slashing alerts, and delegation optimization insights.
            </p>
          </div>

          <div className="flex flex-col space-y-3 mt-6">
            <Badge variant="outline" className="text-xs text-neon-blue border-neon-blue/30 bg-neon-blue/10">
              <Target className="w-3 h-3 mr-1" />
              In Development
            </Badge>
            
            <Button variant="outline" size="sm" className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
              <ExternalLink className="w-3 h-3 mr-2" />
              Request Early Access
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
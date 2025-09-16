import { 
  Blocks, 
  ArrowRightLeft, 
  Shield, 
  Users, 
  Bot, 
  Vote, 
  TrendingUp,
  Activity,
  Zap
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

const navigationItems = [
  { icon: Activity, label: "Dashboard", active: true },
  { icon: Blocks, label: "Blocks", count: "2.1M" },
  { icon: ArrowRightLeft, label: "Transactions", count: "45.2K" },
  { icon: Shield, label: "Validators", count: "1,247" },
];

const socialItems = [
  { icon: Users, label: "ARP Reputation", count: "8.9K" },
  { icon: Bot, label: "AI Agents", count: "156", highlight: true },
  { icon: Vote, label: "DAO Proposals", count: "23" },
  { icon: TrendingUp, label: "Social Metrics" },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card/30 p-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Blockchain</h3>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className="w-full justify-between h-9"
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <Badge variant="outline" className="text-xs">
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Social Layer</h3>
          <div className="space-y-1">
            {socialItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-between h-9"
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <Badge 
                    variant={item.highlight ? "default" : "outline"}
                    className={`text-xs ${item.highlight ? 'bg-chart-1 text-background' : ''}`}
                  >
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="bg-gradient-to-br from-chart-1/10 to-chart-2/10 p-4 rounded-lg border">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-chart-1" />
            <span className="text-sm font-medium">Network Status</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>TPS:</span>
              <span className="text-chart-1">2,847</span>
            </div>
            <div className="flex justify-between">
              <span>Gas Price:</span>
              <span>12 gwei</span>
            </div>
            <div className="flex justify-between">
              <span>Block Time:</span>
              <span>2.1s</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
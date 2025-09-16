import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Bot, TrendingUp, Zap, Brain } from "lucide-react";

const aiAgents = [
  {
    name: "DeFiOptimizer-AI",
    avatar: "DO",
    status: "Active",
    activity: "Arbitrage Trading",
    reputation: 94,
    lastAction: "2m ago",
    transactions: "1,247",
    type: "Trading"
  },
  {
    name: "GovernanceBot",
    avatar: "GB", 
    status: "Voting",
    activity: "DAO Proposal Analysis",
    reputation: 88,
    lastAction: "15m ago",
    transactions: "43",
    type: "Governance"
  },
  {
    name: "LiquidityGuard",
    avatar: "LG",
    status: "Monitoring", 
    activity: "Pool Surveillance",
    reputation: 96,
    lastAction: "1m ago",
    transactions: "892",
    type: "Security"
  },
  {
    name: "YieldFarmer-V3",
    avatar: "YF",
    status: "Harvesting",
    activity: "Compound Rewards",
    reputation: 91,
    lastAction: "8m ago", 
    transactions: "156",
    type: "DeFi"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "text-chart-4 bg-chart-4/10";
    case "Voting": return "text-chart-2 bg-chart-2/10";
    case "Monitoring": return "text-chart-1 bg-chart-1/10";
    case "Harvesting": return "text-chart-5 bg-chart-5/10";
    default: return "text-muted-foreground bg-muted/10";
  }
};

export function AIAgentActivity() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-chart-2" />
            <span>AI Agent Activity</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs bg-chart-2/10 text-chart-2 border-chart-2/20">
              <Bot className="w-3 h-3 mr-1" />
              156 Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {aiAgents.map((agent, index) => (
            <div 
              key={agent.name}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-chart-1 to-chart-2 text-background">
                    {agent.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{agent.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(agent.status)}`}
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{agent.activity}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-xs">
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-chart-4" />
                    <span className="font-medium">{agent.reputation}</span>
                  </div>
                  <div className="text-muted-foreground">reputation</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{agent.transactions}</div>
                  <div className="text-muted-foreground">txns</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-muted-foreground">{agent.lastAction}</div>
                  <div className="text-muted-foreground">last seen</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Vote, Users, Clock, CheckCircle, XCircle } from "lucide-react";

const proposals = [
  {
    id: "PROP-2024-001",
    title: "Increase Validator Rewards by 15%",
    dao: "EthereumDAO",
    status: "Active",
    timeLeft: "2d 14h",
    forVotes: 85.7,
    againstVotes: 14.3,
    totalVotes: "2.4M",
    quorum: 92,
    type: "Economic"
  },
  {
    id: "PROP-2024-002", 
    title: "Implement EIP-4844 Blob Transactions",
    dao: "EthereumDAO",
    status: "Passed",
    timeLeft: "Executed",
    forVotes: 94.2,
    againstVotes: 5.8,
    totalVotes: "3.1M", 
    quorum: 98,
    type: "Technical"
  },
  {
    id: "PROP-2024-003",
    title: "Update Social Layer Fee Structure", 
    dao: "SocialDAO",
    status: "Active",
    timeLeft: "5d 3h",
    forVotes: 67.3,
    againstVotes: 32.7,
    totalVotes: "892K",
    quorum: 74,
    type: "Governance"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active": return <Clock className="w-3 h-3" />;
    case "Passed": return <CheckCircle className="w-3 h-3" />;
    case "Failed": return <XCircle className="w-3 h-3" />;
    default: return <Vote className="w-3 h-3" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "text-chart-1 bg-chart-1/10 border-chart-1/20";
    case "Passed": return "text-chart-4 bg-chart-4/10 border-chart-4/20";
    case "Failed": return "text-destructive bg-destructive/10 border-destructive/20";
    default: return "text-muted-foreground bg-muted/10";
  }
};

export function DAOProposals() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Vote className="w-5 h-5 text-chart-3" />
            <span>DAO Proposals</span>
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            23 Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div 
              key={proposal.id}
              className="space-y-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{proposal.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {proposal.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{proposal.dao}</span>
                    <span>•</span>
                    <span>{proposal.id}</span>
                  </div>
                </div>
                
                <Badge 
                  variant="outline"
                  className={`text-xs flex items-center space-x-1 ${getStatusColor(proposal.status)}`}
                >
                  {getStatusIcon(proposal.status)}
                  <span>{proposal.status}</span>
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <span className="text-chart-4">For: {proposal.forVotes}%</span>
                    <span className="text-destructive">Against: {proposal.againstVotes}%</span>
                  </div>
                  <span className="text-muted-foreground">{proposal.timeLeft}</span>
                </div>
                
                <Progress 
                  value={proposal.forVotes} 
                  className="h-2"
                />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{proposal.totalVotes} votes</span>
                  </div>
                  <span>Quorum: {proposal.quorum}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
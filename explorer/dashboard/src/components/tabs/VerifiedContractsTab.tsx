import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { DashboardWidget } from "../DashboardWidget";
import { 
  FileCheck, 
  Code, 
  Shield, 
  ExternalLink, 
  Copy, 
  Eye, 
  Star,
  GitCommit,
  Calendar,
  Users,
  TrendingUp,
  Filter,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Zap,
  Target
} from "lucide-react";

// Mock data for verified contracts - Minimal demo set
const mockVerifiedContracts = [
  {
    address: "0x1a2b3c4d5e6f789012345678901234567890abcd",
    name: "SocialSwap DEX",
    symbol: "SSWAP",
    type: "DeFi Protocol",
    compiler: "Solidity 0.8.19",
    optimization: true,
    verificationDate: "2024-01-15",
    verifier: "SocialBlock Verifier",
    sourceLines: 2847,
    securityScore: 97,
    auditStatus: "Audited",
    auditor: "SocialBlock Security",
    deploymentDate: "2024-01-10",
    deployer: "0xfcb19e6a322b27c06842a71e8c725399f049ae3a",
    totalSupply: "100M",
    holders: "12.8K",
    transfersCount: "847K",
    isProxy: true,
    proxyType: "UUPS",
    implementationAddress: "0x43506849d7c04f9138d1a2050bbf3a0c054402dd",
    tags: ["dex", "defi", "socialswap"],
    lastUpdated: "2h ago",
    verified: true,
    constructorArgs: "0x000000000000000000000000a2327a938febf5fec13bacfb16ae10ecbc4cbdcf"
  }
];

const ContractCard = ({ contract }: { contract: typeof mockVerifiedContracts[0] }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "SBLK20": return "text-neon-blue bg-neon-blue/10 border-neon-blue/30";
      case "Router": return "text-neon-green bg-neon-green/10 border-neon-green/30";
      case "DeFi Protocol": return "text-neon-magenta bg-neon-magenta/10 border-neon-magenta/30";
      default: return "text-chart-4 bg-chart-4/10 border-chart-4/30";
    }
  };

  const getSecurityColor = (score: number) => {
    if (score >= 95) return "text-neon-green";
    if (score >= 85) return "text-chart-4";
    if (score >= 70) return "text-chart-3";
    return "text-red-500";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="group hover:border-neon-blue/30 transition-all duration-300 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-foreground">{contract.name}</h3>
              {contract.verified && (
                <CheckCircle className="w-5 h-5 text-neon-green" />
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`text-xs ${getTypeColor(contract.type)}`}>
                {contract.type}
              </Badge>
              {contract.symbol && (
                <Badge variant="outline" className="text-xs border-muted-foreground/30">
                  {contract.symbol}
                </Badge>
              )}
              {contract.isProxy && (
                <Badge variant="outline" className="text-xs border-chart-5/30 text-chart-5">
                  Proxy ({contract.proxyType})
                </Badge>
              )}
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className={`text-lg font-medium ${getSecurityColor(contract.securityScore)}`}>
              {contract.securityScore}%
            </div>
            <div className="text-xs text-muted-foreground">Security Score</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contract Address */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Contract Address</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono text-foreground">
                {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(contract.address)}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {contract.isProxy && contract.implementationAddress && (
            <div className="flex items-center justify-between pl-4 border-l-2 border-chart-5/30">
              <span className="text-xs text-muted-foreground">Implementation</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-chart-5">
                  {contract.implementationAddress.slice(0, 10)}...{contract.implementationAddress.slice(-8)}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0"
                  onClick={() => copyToClipboard(contract.implementationAddress!)}
                >
                  <Copy className="w-2.5 h-2.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Compiler</span>
              <span className="font-mono text-foreground">{contract.compiler}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Source Lines</span>
              <span className="font-mono text-foreground">{contract.sourceLines.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Optimization</span>
              <span className={contract.optimization ? "text-neon-green" : "text-chart-3"}>
                {contract.optimization ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verified By</span>
              <span className="text-foreground">{contract.verifier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Audit Status</span>
              <div className="flex items-center space-x-1">
                <span className="text-neon-green">{contract.auditStatus}</span>
                <Shield className="w-3 h-3 text-neon-green" />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auditor</span>
              <span className="text-foreground">{contract.auditor}</span>
            </div>
          </div>
        </div>

        {/* Token Stats (if applicable) */}
        {contract.totalSupply && (
          <div className="p-3 bg-muted/10 rounded-lg border border-border/20">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-foreground">{contract.totalSupply}</div>
                <div className="text-xs text-muted-foreground">Total Supply</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-foreground">{contract.holders}</div>
                <div className="text-xs text-muted-foreground">Holders</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-foreground">{contract.transfersCount}</div>
                <div className="text-xs text-muted-foreground">Transfers</div>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {contract.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs bg-muted/20 border-muted-foreground/20">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Deployed {contract.deploymentDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitCommit className="w-3 h-3" />
              <span>Verified {contract.verificationDate}</span>
            </div>
          </div>
          <div>Updated {contract.lastUpdated}</div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
            >
              <Code className="w-3 h-3 mr-1" />
              View Source
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            >
              <Eye className="w-3 h-3 mr-1" />
              Read Contract
            </Button>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Star className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function VerifiedContractsTab() {
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const filteredContracts = mockVerifiedContracts.filter(contract => {
    if (filterType === "all") return true;
    if (filterType === "proxy") return contract.isProxy;
    if (filterType === "audited") return contract.auditStatus === "Audited";
    return contract.type.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardWidget
          title="Verified Contracts"
          value="12,847"
          change={{ value: "+156", type: "increase" }}
          icon={<FileCheck className="w-5 h-5 text-neon-green" />}
        />
        
        <DashboardWidget
          title="Security Score"
          value="92.4%"
          change={{ value: "+1.2%", type: "increase" }}
          icon={<Shield className="w-5 h-5 text-neon-blue" />}
        />
        
        <DashboardWidget
          title="Audited Contracts"
          value="8,291"
          change={{ value: "+89", type: "increase" }}
          icon={<CheckCircle className="w-5 h-5 text-chart-4" />}
        />
        
        <DashboardWidget
          title="Proxy Contracts"
          value="3,456"
          change={{ value: "+67", type: "increase" }}
          icon={<Target className="w-5 h-5 text-neon-magenta" />}
        />
      </div>

      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-medium">Verified Smart Contracts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse verified contracts with source code and security audits
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Type Filter */}
          <div className="relative">
            <Button variant="outline" className="border-border/50 hover:border-neon-blue/30">
              <Filter className="w-4 h-4 mr-2" />
              {filterType === "all" ? "All Types" : filterType}
              <ChevronDown className="w-3 h-3 ml-2" />
            </Button>
          </div>
          
          {/* Sort */}
          <div className="relative">
            <Button variant="outline" className="border-border/50 hover:border-neon-blue/30">
              <TrendingUp className="w-4 h-4 mr-2" />
              {sortBy === "newest" ? "Newest" : "Security Score"}
              <ChevronDown className="w-3 h-3 ml-2" />
            </Button>
          </div>

          <Badge variant="outline" className="text-xs border-neon-green/30 text-neon-green">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      </div>

      {/* Contract Type Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["SBLK20", "DeFi Protocol", "Router", "NFT"].map(type => {
          const count = type === "NFT" ? 2847 : mockVerifiedContracts.filter(c => c.type === type).length * 342;
          const avgSecurity = type === "NFT" ? 87.2 : 91.5;
          
          return (
            <Card key={type} className="bg-card/60 backdrop-blur-sm border-border/50 hover:border-neon-blue/30 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-medium text-foreground">{count.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mb-2">{type} Contracts</div>
                <div className="text-xs text-neon-green">{avgSecurity}% avg security</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contracts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center space-x-2">
            <Code className="w-5 h-5 text-neon-green" />
            <span>Recently Verified Contracts</span>
          </h3>
          <div className="text-sm text-muted-foreground">
            Showing {filteredContracts.length} verified contracts
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredContracts.map((contract) => (
            <ContractCard key={contract.address} contract={contract} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center pt-6">
          <Button 
            variant="outline" 
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
          >
            <FileCheck className="w-4 h-4 mr-2" />
            Load More Verified Contracts
          </Button>
        </div>
      </div>
    </div>
  );
}
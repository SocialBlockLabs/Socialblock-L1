import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ARPBadge, generateMockARPProfile } from "./ARPBadge";
import { ProfileDrawer } from "./ProfileDrawer";
import { TrustScoreMeter } from "./TrustScoreMeter";
import { 
  ArrowLeft, 
  Clock, 
  Blocks, 
  ExternalLink, 
  Copy, 
  Zap, 
  Bot, 
  Database,
  Hash,
  Gauge,
  Users,
  TrendingUp,
  Shield,
  Activity,
  FileText,
  Fuel,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface BlockDetailsProps {
  blockHeight: number;
  onBack: () => void;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  gasPrice: string;
  status: 'success' | 'failed' | 'pending';
  method: string;
  timestamp: string;
}

interface BlockData {
  height: number;
  hash: string;
  parentHash: string;
  timestamp: string;
  timestampFull: string;
  validator: {
    name: string;
    address: string;
    avatar: string;
    id: string;
  };
  transactions: Transaction[];
  gasUsed: number;
  gasLimit: number;
  gasPrice: string;
  reward: string;
  difficulty: string;
  size: string;
  nonce: string;
  mixHash: string;
  stateRoot: string;
  transactionsRoot: string;
  receiptsRoot: string;
  extraData: string;
}

// Mock block data generator
const generateBlockData = (height: number): BlockData => {
  const transactionCount = Math.floor(Math.random() * 200) + 50;
  const transactions: Transaction[] = Array.from({ length: transactionCount }, (_, i) => ({
    hash: `sblk${Math.random().toString(16).slice(2, 66)}`,
    from: `sblk${Math.random().toString(16).slice(2, 42)}`,
    to: `sblk${Math.random().toString(16).slice(2, 42)}`,
    value: `${(Math.random() * 10).toFixed(4)} SBLK`,
    gasUsed: Math.floor(Math.random() * 200000) + 21000,
    gasPrice: `${Math.floor(Math.random() * 50) + 10} Gwei`,
    status: Math.random() > 0.05 ? 'success' : Math.random() > 0.5 ? 'failed' : 'pending',
    method: ['Transfer', 'Swap', 'Mint', 'Burn', 'Approve', 'Stake'][Math.floor(Math.random() * 6)],
    timestamp: `${Math.floor(Math.random() * 60)} sec ago`
  }));

  return {
    height,
    hash: `sblk${Math.random().toString(16).slice(2, 66)}`,
    parentHash: `sblk${Math.random().toString(16).slice(2, 66)}`,
    timestamp: `${Math.floor(Math.random() * 60)} sec ago`,
    timestampFull: new Date(Date.now() - Math.random() * 300000).toLocaleString(),
    validator: {
      name: `Validator ${Math.floor(Math.random() * 1000)}`,
      address: `sblk${Math.random().toString(16).slice(2, 42)}`,
      avatar: String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)),
      id: `val_${Math.random().toString(36).slice(2, 8)}`
    },
    transactions,
    gasUsed: Math.floor(Math.random() * 25000000) + 5000000,
    gasLimit: 30000000,
    gasPrice: `${Math.floor(Math.random() * 50) + 10} Gwei`,
    reward: `${(Math.random() * 5 + 2).toFixed(4)} SBLK`,
    difficulty: `${(Math.random() * 10 + 5).toFixed(2)} TH`,
    size: `${Math.floor(Math.random() * 50) + 20} KB`,
    nonce: `sblk${Math.random().toString(16).slice(2, 18)}`,
    mixHash: `sblk${Math.random().toString(16).slice(2, 66)}`,
    stateRoot: `sblk${Math.random().toString(16).slice(2, 66)}`,
    transactionsRoot: `sblk${Math.random().toString(16).slice(2, 66)}`,
    receiptsRoot: `sblk${Math.random().toString(16).slice(2, 66)}`,
    extraData: 'sblk'
  };
};

export function BlockDetails({ blockHeight, onBack }: BlockDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [blockData] = useState(() => generateBlockData(blockHeight));
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  };

  const gasUtilization = (blockData.gasUsed / blockData.gasLimit) * 100;
  const successfulTxns = blockData.transactions.filter(tx => tx.status === 'success').length;
  const failedTxns = blockData.transactions.filter(tx => tx.status === 'failed').length;

  const handleExplainWithAI = () => {
    toast("AI explanation coming soon! This will provide detailed insights about this block.");
  };

  const validatorProfile = generateMockARPProfile(blockData.validator.address, {
    ens: blockData.validator.name,
    primaryType: 'validator',
    starLevel: Math.floor(Math.random() * 3) + 3 as 3 | 4 | 5
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl border-b border-border/50 bg-card/80">
        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="default"
                onClick={onBack}
                className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blocks
              </Button>
              
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-bold flex items-center space-x-3">
                  <Blocks className="w-6 h-6 text-neon-blue" />
                  <span>Block #{blockData.height}</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Detailed block information and transactions
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleExplainWithAI}
              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            >
              <Bot className="w-4 h-4 mr-2" />
              Explain with AI
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 py-6 md:py-8 space-y-8">
        {/* Block Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-muted/10 border-border/30">
            <CardContent className="p-6 text-center">
              <div className="text-2xl md:text-3xl font-mono font-bold text-neon-blue mb-2">
                {blockData.transactions.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Transactions</div>
            </CardContent>
          </Card>

          <Card className="bg-muted/10 border-border/30">
            <CardContent className="p-6 text-center">
              <div className="text-2xl md:text-3xl font-mono font-bold text-neon-green mb-2">
                {gasUtilization.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Gas Utilization</div>
            </CardContent>
          </Card>

          <Card className="bg-muted/10 border-border/30">
            <CardContent className="p-6 text-center">
              <div className="text-2xl md:text-3xl font-mono font-bold text-chart-4 mb-2">
                {blockData.reward}
              </div>
              <div className="text-sm text-muted-foreground">Block Reward</div>
            </CardContent>
          </Card>

          <Card className="bg-muted/10 border-border/30">
            <CardContent className="p-6 text-center">
              <div className="text-2xl md:text-3xl font-mono font-bold text-chart-3 mb-2">
                {blockData.size}
              </div>
              <div className="text-sm text-muted-foreground">Block Size</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/20 h-12">
            <TabsTrigger value="overview" className="text-sm md:text-base">Overview</TabsTrigger>
            <TabsTrigger value="transactions" className="text-sm md:text-base">Transactions</TabsTrigger>
            <TabsTrigger value="technical" className="text-sm md:text-base">Technical</TabsTrigger>
            <TabsTrigger value="validator" className="text-sm md:text-base">Validator</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Block Information */}
              <Card className="bg-muted/10 border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-neon-blue" />
                    <span>Block Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Height</span>
                      <span className="font-mono font-bold">#{blockData.height}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Hash</span>
                      <div className="text-right">
                        <div className="font-mono text-sm break-all max-w-[200px]">{blockData.hash}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 mt-1"
                          onClick={() => copyToClipboard(blockData.hash)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Timestamp</span>
                      <div className="text-right">
                        <div className="font-medium">{blockData.timestamp}</div>
                        <div className="text-xs text-muted-foreground">{blockData.timestampFull}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gas Usage */}
              <Card className="bg-muted/10 border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Fuel className="w-5 h-5 text-chart-4" />
                    <span>Gas Usage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Gas Used</span>
                      <span className="font-mono">{blockData.gasUsed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gas Limit</span>
                      <span className="font-mono">{blockData.gasLimit.toLocaleString()}</span>
                    </div>
                    <Progress value={gasUtilization} className="h-3" />
                    <div className="text-center">
                      <span className="text-lg font-bold text-chart-4">{gasUtilization.toFixed(1)}% Utilized</span>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Average Gas Price: {blockData.gasPrice}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction Summary */}
            <Card className="bg-muted/10 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-neon-green" />
                  <span>Transaction Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-neon-green/10 rounded-lg border border-neon-green/20">
                    <div className="text-2xl font-bold text-neon-green">{successfulTxns}</div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                  <div className="text-center p-4 bg-chart-3/10 rounded-lg border border-chart-3/20">
                    <div className="text-2xl font-bold text-chart-3">{failedTxns}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center p-4 bg-chart-1/10 rounded-lg border border-chart-1/20">
                    <div className="text-2xl font-bold text-chart-1">{blockData.transactions.length - successfulTxns - failedTxns}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6 mt-6">
            <Card className="bg-muted/10 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-neon-blue" />
                    <span>All Transactions ({blockData.transactions.length})</span>
                  </div>
                  <Badge variant="outline" className="text-neon-green border-neon-green/30">
                    Live Data
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {blockData.transactions.slice(0, 20).map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/20 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          tx.status === 'success' ? 'bg-neon-green' : 
                          tx.status === 'failed' ? 'bg-chart-3' : 'bg-chart-1'
                        }`}></div>
                        <div>
                          <div className="font-mono text-sm">{tx.hash.slice(0, 22)}...</div>
                          <div className="text-xs text-muted-foreground">{tx.method} • {tx.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm">{tx.value}</div>
                        <div className="text-xs text-muted-foreground">{tx.gasPrice}</div>
                      </div>
                    </div>
                  ))}
                  {blockData.transactions.length > 20 && (
                    <div className="text-center p-4">
                      <Button variant="outline" className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
                        Load More Transactions
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Tab */}
          <TabsContent value="technical" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-muted/10 border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Hash className="w-5 h-5 text-chart-4" />
                    <span>Block Hashes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { label: 'Parent Hash', value: blockData.parentHash },
                      { label: 'State Root', value: blockData.stateRoot },
                      { label: 'Transactions Root', value: blockData.transactionsRoot },
                      { label: 'Receipts Root', value: blockData.receiptsRoot },
                      { label: 'Mix Hash', value: blockData.mixHash }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <div className="text-right">
                          <div className="font-mono text-xs break-all max-w-[200px]">{item.value}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 mt-1"
                            onClick={() => copyToClipboard(item.value)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/10 border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Info className="w-5 h-5 text-neon-green" />
                    <span>Additional Data</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Nonce</span>
                      <span className="font-mono text-sm">{blockData.nonce}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Difficulty</span>
                      <span className="font-mono text-sm">{blockData.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Extra Data</span>
                      <span className="font-mono text-sm">{blockData.extraData || 'Empty'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Validator Tab */}
          <TabsContent value="validator" className="space-y-6 mt-6">
            <Card className="bg-muted/10 border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-neon-blue" />
                  <span>Block Validator</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-2 border-neon-blue/30">
                        <AvatarFallback className="bg-gradient-to-br from-neon-blue via-chart-1 to-neon-green text-black text-lg font-bold">
                          {blockData.validator.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2">
                        <ARPBadge profile={validatorProfile} size="md" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">{blockData.validator.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{blockData.validator.id}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Address:</span>
                        <span className="font-mono text-xs">{blockData.validator.address}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => copyToClipboard(blockData.validator.address)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <TrustScoreMeter score={validatorProfile.totalScore / 100} size="lg" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <ProfileDrawer 
                      profile={validatorProfile}
                      trigger={
                        <Button variant="outline" className="border-neon-green/30 text-neon-green hover:bg-neon-green/10">
                          <Users className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      }
                    />
                    <Button variant="outline" className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View All Blocks
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
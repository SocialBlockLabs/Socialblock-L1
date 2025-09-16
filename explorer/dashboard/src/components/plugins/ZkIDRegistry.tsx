import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Shield, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users,
  Fingerprint,
  Key,
  Globe,
  Lock,
  Eye,
  ExternalLink,
  Filter,
  Star,
  Zap,
  Database
} from "lucide-react";

interface ZkIDProfile {
  id: string;
  address: string;
  zkProof: string;
  username?: string;
  avatar?: string;
  verificationLevel: 'basic' | 'enhanced' | 'premium';
  verificationScore: number;
  proofs: {
    identity: boolean;
    residence: boolean;
    phone: boolean;
    email: boolean;
    social: boolean;
    government: boolean;
  };
  issuedDate: string;
  lastUpdated: string;
  revokedDate?: string;
  status: 'active' | 'pending' | 'revoked' | 'expired';
  reputation: number;
  endorsements: number;
}

const mockProfiles: ZkIDProfile[] = [
  {
    id: 'zkid_001',
    address: 'sblkd8da6bf26964af9d7eed9e03e53415d37aa96045',
    zkProof: 'zkp_a7b3c9d2e1f4g5h6i7j8k9l0',
    username: 'ethereum_dev',
    avatar: 'ED',
    verificationLevel: 'premium',
    verificationScore: 95,
    proofs: {
      identity: true,
      residence: true,
      phone: true,
      email: true,
      social: true,
      government: true
    },
    issuedDate: '2024-01-15T10:00:00Z',
    lastUpdated: '2024-07-18T14:30:00Z',
    status: 'active',
    reputation: 9750,
    endorsements: 47
  },
  {
    id: 'zkid_002',
    address: 'sblk47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503',
    zkProof: 'zkp_m8n9o0p1q2r3s4t5u6v7w8x9',
    username: 'defi_researcher',
    avatar: 'DR',
    verificationLevel: 'enhanced',
    verificationScore: 87,
    proofs: {
      identity: true,
      residence: true,
      phone: true,
      email: true,
      social: false,
      government: false
    },
    issuedDate: '2024-03-22T09:15:00Z',
    lastUpdated: '2024-07-19T11:45:00Z',
    status: 'active',
    reputation: 8320,
    endorsements: 23
  },
  {
    id: 'zkid_003',
    address: 'sblk9876543210fedcba9876543210fedcba98765432',
    zkProof: 'zkp_y9z0a1b2c3d4e5f6g7h8i9j0',
    verificationLevel: 'basic',
    verificationScore: 72,
    proofs: {
      identity: true,
      residence: false,
      phone: true,
      email: true,
      social: false,
      government: false
    },
    issuedDate: '2024-06-10T16:20:00Z',
    lastUpdated: '2024-07-15T08:30:00Z',
    status: 'pending',
    reputation: 6150,
    endorsements: 8
  }
];

export function ZkIDRegistry() {
  const [profiles, setProfiles] = useState<ZkIDProfile[]>(mockProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'revoked'>('all');
  const [selectedProfile, setSelectedProfile] = useState<ZkIDProfile | null>(null);
  const [activeTab, setActiveTab] = useState('registry');

  const filteredProfiles = profiles
    .filter(profile => 
      statusFilter === 'all' || profile.status === statusFilter
    )
    .filter(profile =>
      profile.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.zkProof.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getVerificationLevelColor = (level: ZkIDProfile['verificationLevel']) => {
    switch (level) {
      case 'premium':
        return 'text-neon-magenta border-neon-magenta/30 bg-neon-magenta/10';
      case 'enhanced':
        return 'text-neon-blue border-neon-blue/30 bg-neon-blue/10';
      case 'basic':
        return 'text-neon-green border-neon-green/30 bg-neon-green/10';
    }
  };

  const getStatusIcon = (status: ZkIDProfile['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3 text-neon-green" />;
      case 'pending':
        return <Clock className="w-3 h-3 text-chart-4" />;
      case 'revoked':
        return <AlertTriangle className="w-3 h-3 text-chart-3" />;
      case 'expired':
        return <AlertTriangle className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const registryStats = {
    total: profiles.length,
    active: profiles.filter(p => p.status === 'active').length,
    pending: profiles.filter(p => p.status === 'pending').length,
    revoked: profiles.filter(p => p.status === 'revoked').length
  };

  return (
    <div className="h-full flex flex-col bg-card/95 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-neon-green/10 border border-neon-green/30">
              <Shield className="w-4 h-4 text-neon-green" />
            </div>
            <div>
              <h3 className="text-sm font-medium">zkID Registry</h3>
              <p className="text-xs text-muted-foreground">Decentralized identity verification</p>
            </div>
          </div>

          <Badge variant="outline" className="text-xs">
            <Database className="w-3 h-3 mr-1" />
            {profiles.length} Identities
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/20">
            <TabsTrigger value="registry" className="text-xs">Registry</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="registry" className="flex-1 flex flex-col">
        {/* Search and Filters */}
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input
                placeholder="Search by address, username, or zkProof..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs bg-muted/20 border-border/30"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {(['all', 'active', 'pending', 'revoked'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "ghost"}
                size="sm"
                className={`text-xs ${
                  statusFilter === status 
                    ? 'bg-neon-green/20 text-neon-green border-neon-green/30' 
                    : 'hover:bg-muted/20'
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Profile List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {filteredProfiles.map((profile) => (
              <Card 
                key={profile.id}
                className={`
                  group cursor-pointer transition-all duration-200 
                  ${selectedProfile?.id === profile.id ? 'border-neon-green/50 bg-neon-green/5' : 'hover:border-border/70'}
                `}
                onClick={() => setSelectedProfile(selectedProfile?.id === profile.id ? null : profile)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-neon-green/20 to-neon-blue/20 text-xs">
                          {profile.avatar || profile.address.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {getStatusIcon(profile.status)}
                          <span className="text-sm font-medium">
                            {profile.username || formatAddress(profile.address)}
                          </span>
                          <Badge variant="outline" className={`text-xs ${getVerificationLevelColor(profile.verificationLevel)}`}>
                            {profile.verificationLevel}
                          </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground mb-2">
                          <div className="font-mono">{formatAddress(profile.address)}</div>
                          <div className="truncate">zkProof: {profile.zkProof}</div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs">
                            <div className="flex items-center space-x-1">
                              <Fingerprint className="w-3 h-3 text-neon-green" />
                              <span>{profile.verificationScore}%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-chart-4" />
                              <span>{profile.reputation}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3 text-neon-blue" />
                              <span>{profile.endorsements}</span>
                            </div>
                          </div>

                          <Button variant="ghost" size="sm" className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedProfile?.id === profile.id && (
                    <div className="mt-3 pt-3 border-t border-border/30 animate-in slide-in-from-top-1">
                      <div className="space-y-3">
                        {/* Verification Proofs */}
                        <div>
                          <h4 className="text-xs font-medium mb-2">Verification Proofs</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(profile.proofs).map(([type, verified]) => (
                              <div key={type} className="flex items-center space-x-2">
                                {verified ? (
                                  <CheckCircle className="w-3 h-3 text-neon-green" />
                                ) : (
                                  <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                                )}
                                <span className={verified ? 'text-foreground' : 'text-muted-foreground'}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Verification Score */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-xs font-medium">Verification Score</h4>
                            <span className="text-xs font-mono">{profile.verificationScore}%</span>
                          </div>
                          <Progress value={profile.verificationScore} className="h-2" />
                        </div>

                        {/* Timestamps */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-muted-foreground">Issued:</span>
                            <div>{formatDate(profile.issuedDate)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Updated:</span>
                            <div>{formatDate(profile.lastUpdated)}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Button variant="outline" size="sm" className="text-xs border-neon-green/30 text-neon-green hover:bg-neon-green/10">
                            <Key className="w-3 h-3 mr-1" />
                            Verify Proof
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Full Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-8">
              <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No zkID profiles found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="analytics" className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-muted/10 border-border/30">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-mono font-bold text-neon-green">{registryStats.active}</div>
              <div className="text-xs text-muted-foreground">Active IDs</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/10 border-border/30">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-mono font-bold text-chart-4">{registryStats.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-muted/10 border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Verification Levels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['premium', 'enhanced', 'basic'].map((level) => {
                const count = profiles.filter(p => p.verificationLevel === level).length;
                const percentage = (count / profiles.length) * 100;
                return (
                  <div key={level} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize">{level}</span>
                      <span>{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
}
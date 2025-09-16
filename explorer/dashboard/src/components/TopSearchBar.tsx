import { useState, useEffect } from "react";
import { 
  Search, 
  Command as CommandIcon, 
  Wallet, 
  Hash, 
  Shield, 
  User, 
  UserCheck,
  ExternalLink,
  Zap,
  X,
  Filter,
  ArrowUp
} from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// Mock data for different search types
const mockSearchData = {
  addresses: [
    { id: "sblk1234567890abcdef1234567890abcdef12345678", label: "Whale Address #1", balance: "12,847 SBLK" },
    { id: "sblkabcdef1234567890abcdef1234567890abcdef12", label: "DEX Contract", balance: "8,291 SBLK" },
    { id: "sblk9876543210fedcba9876543210fedcba98765432", label: "Treasury Wallet", balance: "45,672 SBLK" },
    { id: "sblkfedcba9876543210fedcba9876543210fedcba98", label: "Validator Pool", balance: "32,000 SBLK" }
  ],
  transactions: [
    { id: "sblk1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab", label: "Large Transfer", value: "1,500 SBLK" },
    { id: "sblk2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd", label: "DeFi Swap", value: "250 SBLK" },
    { id: "sblk3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", label: "NFT Purchase", value: "12.5 SBLK" },
    { id: "sblk4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12", label: "Contract Deploy", value: "0.5 SBLK" }
  ],
  validators: [
    { id: "prysm-001", label: "Prysm Validator 001", status: "Active", stake: "32,000 SBLK" },
    { id: "lighthouse-42", label: "Lighthouse Node 42", status: "Active", stake: "32,000 SBLK" },
    { id: "teku-007", label: "Teku Validator 007", status: "Active", stake: "32,000 SBLK" },
    { id: "nimbus-15", label: "Nimbus Node 15", status: "Active", stake: "32,000 SBLK" }
  ],
  zkids: [
    { id: "zkid:crypto_whale_92", label: "CryptoWhale92", verified: true, reputation: 9847 },
    { id: "zkid:defi_builder", label: "DeFiBuilder", verified: true, reputation: 8923 },
    { id: "zkid:dao_master", label: "DAOMaster", verified: false, reputation: 8156 },
    { id: "zkid:validator_pro", label: "ValidatorPro", verified: true, reputation: 7834 }
  ],
  arp: [
    { id: "arp:@whale92", label: "@whale92", score: 9847, badges: ["Validator", "Governance"] },
    { id: "arp:@defibuilder", label: "@defibuilder", score: 8923, badges: ["Developer", "Security"] },
    { id: "arp:@daomaster", label: "@daomaster", score: 8156, badges: ["Governance", "Curator"] },
    { id: "arp:@validatorpro", label: "@validatorpro", score: 7834, badges: ["Validator", "Technical"] }
  ]
};

const getSearchIcon = (type: string) => {
  switch (type) {
    case "addresses": return Wallet;
    case "transactions": return Hash;
    case "validators": return Shield;
    case "zkids": return User;
    case "arp": return UserCheck;
    default: return Search;
  }
};

const getSearchColor = (type: string) => {
  switch (type) {
    case "addresses": return "text-neon-blue";
    case "transactions": return "text-neon-green";
    case "validators": return "text-chart-3";
    case "zkids": return "text-chart-4";
    case "arp": return "text-chart-5";
    default: return "text-muted-foreground";
  }
};

export function TopSearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<any>({});
  const [isMobile, setIsMobile] = useState(false);

  // Enhanced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (searchValue.length < 2) {
      setFilteredResults({});
      setIsOpen(false);
      return;
    }

    const results: any = {};
    const searchLower = searchValue.toLowerCase();

    // Filter each category
    Object.entries(mockSearchData).forEach(([category, items]) => {
      const filtered = items.filter(item => 
        item.label.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower)
      );
      if (filtered.length > 0) {
        results[category] = filtered.slice(0, 3); // Limit to 3 results per category
      }
    });

    setFilteredResults(results);
    setIsOpen(Object.keys(results).length > 0);
  }, [searchValue]);

  const handleSelectItem = (item: any, type: string) => {
    setSearchValue(item.id);
    setIsOpen(false);
    // Here you would typically navigate to the selected item
    console.log(`Selected ${type}:`, item);
  };

  const clearSearch = () => {
    setSearchValue("");
    setFilteredResults({});
    setIsOpen(false);
  };

  const renderSearchResult = (item: any, type: string) => {
    const Icon = getSearchIcon(type);
    const colorClass = getSearchColor(type);

    return (
      <CommandItem
        key={item.id}
        value={item.id}
        onSelect={() => handleSelectItem(item, type)}
        className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-muted/50 rounded-lg transition-all duration-200 group border border-transparent hover:border-border/50 touch-optimized"
      >
        <div className="flex items-center space-x-2.5 flex-1 min-w-0">
          <div className={`p-1.5 rounded-lg bg-muted/30 border border-border/30 group-hover:border-${type === 'addresses' ? 'neon-blue' : type === 'transactions' ? 'neon-green' : 'chart-3'}/30 transition-colors`}>
            <Icon className={`w-3.5 h-3.5 ${colorClass} group-hover:animate-pulse`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-xs text-foreground group-hover:text-neon-blue transition-colors truncate">{item.label}</div>
            <div className="text-xs text-muted-foreground font-mono truncate mt-0.5">
              {item.id}
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground flex-shrink-0 ml-1.5">
          {type === "addresses" && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-neon-blue/30 text-neon-blue bg-neon-blue/10">
              {item.balance}
            </Badge>
          )}
          {type === "transactions" && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-neon-green/30 text-neon-green bg-neon-green/10">
              {item.value}
            </Badge>
          )}
          {type === "validators" && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-chart-3/30 text-chart-3 bg-chart-3/10">
              {item.status}
            </Badge>
          )}
          {type === "zkids" && (
            <div className="flex items-center space-x-1.5">
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-chart-4/30 text-chart-4 bg-chart-4/10">
                Rep: {item.reputation}
              </Badge>
              {item.verified && <UserCheck className="w-3 h-3 text-neon-green" />}
            </div>
          )}
          {type === "arp" && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-chart-5/30 text-chart-5 bg-chart-5/10">
              Score: {item.score}
            </Badge>
          )}
        </div>
      </CommandItem>
    );
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      addresses: "Addresses",
      transactions: "Transactions", 
      validators: "Validators",
      zkids: "SBID Identities",
      arp: "ARP Profiles"
    };
    return labels[category as keyof typeof labels] || category;
  };



  return (
    <>
      {/* Unified Search Bar for Both Desktop and Mobile */}
      <div className="relative w-full">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="relative group w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-hover:text-neon-blue transition-colors" />
              <Input 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={isMobile ? "Search everything..." : "Search addresses, transactions, validators, SBIDs, ARP profiles..."} 
                className="pl-12 pr-20 h-12 bg-muted/50 border border-border/50 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 text-base rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-muted/70 w-full"
                style={isMobile ? { fontSize: '16px' } : {}} // Prevent zoom on iOS
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {searchValue.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="p-1 hover:bg-muted/20"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
                {!isMobile && (
                  <div className="flex items-center space-x-1 text-muted-foreground text-xs">
                    <CommandIcon className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          </PopoverTrigger>
          
          <PopoverContent 
            className={`${isMobile ? 'w-[95vw] max-w-md' : 'w-[700px]'} p-0 border border-border/50 bg-card/95 backdrop-blur-xl rounded-xl`}
            align="center"
            sideOffset={8}
          >
            <Command className="rounded-xl">
              <CommandList className={`${isMobile ? 'max-h-80' : 'max-h-96'}`}>
                {Object.keys(filteredResults).length === 0 ? (
                  <CommandEmpty className="py-8 text-center text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <div>No results found</div>
                    <div className="text-xs mt-1">Try searching for addresses, transactions, or validators</div>
                  </CommandEmpty>
                ) : (
                  Object.entries(filteredResults).map(([category, items]) => (
                    <CommandGroup 
                      key={category} 
                      heading={
                        <div className="flex items-center space-x-2 px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {(() => {
                            const Icon = getSearchIcon(category);
                            const colorClass = getSearchColor(category);
                            return <Icon className={`w-4 h-4 ${colorClass}`} />;
                          })()}
                          <span>{getCategoryLabel(category)}</span>
                        </div>
                      }
                    >
                      {(items as any[]).map(item => renderSearchResult(item, category))}
                    </CommandGroup>
                  ))
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { DashboardWidget } from "../DashboardWidget";
import { PaginationAdvanced } from "../ui/pagination-advanced";
import { usePaginatedData } from "../hooks/usePaginatedData";
import { ValidatorRow } from "../validators/ValidatorRow";
import { generateValidators } from "../validators/ValidatorUtils";
import { TOTAL_VALIDATORS } from "../validators/ValidatorConstants";
import { 
  Shield, 
  TrendingUp, 
  Zap, 
  Award, 
  Users, 
  Filter,
  ArrowUpDown
} from "lucide-react";

// Generate validators data once
const allValidators = generateValidators(TOTAL_VALIDATORS);

export function ValidatorsTab() {
  const [sortBy, setSortBy] = useState("stake");
  const [filterTier, setFilterTier] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [pagination, paginationActions] = usePaginatedData({
    totalItems: TOTAL_VALIDATORS,
    initialItemsPerPage: 25
  });

  // Sort and filter validators
  const filteredAndSortedValidators = allValidators
    .filter(validator => filterTier === "all" || validator.tier === filterTier)
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "stake":
          comparison = parseInt(a.totalStaked.replace(/,/g, "")) - parseInt(b.totalStaked.replace(/,/g, ""));
          break;
        case "reputation":
          comparison = a.arpScore - b.arpScore;
          break;
        case "uptime":
          comparison = a.uptime - b.uptime;
          break;
        case "apy":
          comparison = a.apy - b.apy;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

  // Get current page data
  const currentValidators = filteredAndSortedValidators.slice(pagination.startIndex, pagination.endIndex);

  const handleStake = (validatorId: string) => {
    console.log(`Stake to validator: ${validatorId}`);
    // Implement staking logic
  };

  const handleViewNode = (validatorId: string) => {
    console.log(`View node: ${validatorId}`);
    // Navigate to validator detail page
  };

  const handleFlag = (validatorId: string) => {
    console.log(`Flag validator: ${validatorId}`);
    // Open flag/report dialog
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid with Tooltips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardWidget
          title="Active Validators"
          value="1,247"
          change={{ value: "+12", type: "increase" }}
          icon={<Shield className="w-5 h-5 text-neon-blue" />}
          tooltip="Number of validators currently securing the network through proof-of-stake consensus. Active validators are eligible to propose blocks and earn rewards."
        />
        
        <DashboardWidget
          title="Total Staked SBLK"
          value="892.4K"
          change={{ value: "+1.2%", type: "increase" }}
          icon={<TrendingUp className="w-5 h-5 text-neon-green" />}
          tooltip="Total amount of SBLK tokens locked in staking to secure the network. Higher staking amounts increase network security and validator rewards."
        />
        
        <DashboardWidget
          title="Avg APY"
          value="3.8%"
          change={{ value: "+0.1%", type: "increase" }}
          icon={<Award className="w-5 h-5 text-neon-blue" />}
          tooltip="Average Annual Percentage Yield earned by stakers. APY varies based on network conditions, total staked amount, and validator performance."
        />
        
        <DashboardWidget
          title="Network Uptime"
          value="99.7%"
          change={{ value: "+0.1%", type: "increase" }}
          icon={<Zap className="w-5 h-5 text-neon-green" />}
          tooltip="Percentage of time the network has been operational and producing blocks. High uptime indicates excellent network reliability and validator performance."
        />
      </div>

      {/* Validator Leaderboard */}
      <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-neon-blue" />
              <span>Validator Leaderboard</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="flex items-center space-x-6 pt-6">
            <div className="flex items-center space-x-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stake">Total Stake</SelectItem>
                  <SelectItem value="reputation">ARP Score</SelectItem>
                  <SelectItem value="uptime">Uptime</SelectItem>
                  <SelectItem value="apy">APY</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSortOrder}
                className="p-2"
              >
                <ArrowUpDown className="w-3 h-3" />
              </Button>
            </div>

            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="elite">Elite</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="solo">Solo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Column Headers - Hidden on Mobile */}
          <div className="hidden md:grid grid-cols-12 gap-6 pt-6 pb-4 border-b border-border/30 text-xs text-muted-foreground font-medium">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-3">Validator</div>
            <div className="col-span-2 text-center">Total Staked</div>
            <div className="col-span-1 text-center">ARP Score</div>
            <div className="col-span-2 text-center">Uptime</div>
            <div className="col-span-3 text-center">Actions</div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {pagination.isLoading ? (
              // Loading skeleton - responsive
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  {/* Mobile Skeleton */}
                  <div className="md:hidden p-4 rounded-xl border border-border/50 bg-muted/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-8 bg-muted rounded"></div>
                      <div className="h-8 bg-muted rounded"></div>
                    </div>
                  </div>
                  
                  {/* Desktop Skeleton */}
                  <div className="hidden md:block p-6 rounded-lg border border-border/50 bg-muted/20">
                    <div className="grid grid-cols-12 gap-6 items-center">
                      <div className="col-span-1 h-6 bg-muted rounded"></div>
                      <div className="col-span-3 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-full"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="col-span-2 h-6 bg-muted rounded"></div>
                      <div className="col-span-1 h-6 bg-muted rounded"></div>
                      <div className="col-span-2 h-10 bg-muted rounded"></div>
                      <div className="col-span-3 flex space-x-2">
                        <div className="h-8 bg-muted rounded flex-1"></div>
                        <div className="h-8 bg-muted rounded flex-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              currentValidators.map((validator, index) => (
                <ValidatorRow
                  key={validator.id}
                  validator={validator}
                  index={index + pagination.startIndex}
                  onStake={handleStake}
                  onViewNode={handleViewNode}
                  onFlag={handleFlag}
                />
              ))
            )}
          </div>
          
          {/* Advanced Pagination */}
          <div className="pt-8">
            <PaginationAdvanced
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={filteredAndSortedValidators.length}
              itemsPerPage={pagination.itemsPerPage}
              isLoading={pagination.isLoading}
              onPageChange={paginationActions.setPage}
              onItemsPerPageChange={paginationActions.setItemsPerPage}
              onLoadMore={paginationActions.loadMore}
              showLoadMore={true}
              showPageSizeSelector={true}
              showPageJumper={true}
              showItemCount={true}
              loadMoreText="Load More Validators"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
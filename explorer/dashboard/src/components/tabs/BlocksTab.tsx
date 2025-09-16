import { RecentBlocks } from "../RecentBlocks";
import { DashboardWidget } from "../DashboardWidget";
import { Blocks, Clock, Database, TrendingUp } from "lucide-react";

interface BlocksTabProps {
  onBlockClick?: (blockHeight: number) => void;
}

export function BlocksTab({ onBlockClick }: BlocksTabProps) {
  return (
    <div className="space-y-6">
      {/* Stats Grid with Tooltips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardWidget
          title="Total Blocks"
          value="18.95M"
          change={{ value: "+2.1%", type: "increase" }}
          icon={<Blocks className="w-5 h-5 text-neon-blue" />}
          tooltip="Total number of blocks that have been mined and added to the blockchain since genesis. Each block contains a collection of validated transactions."
        />
        
        <DashboardWidget
          title="Avg Block Size"
          value="1.8MB"
          change={{ value: "+0.3%", type: "increase" }}
          icon={<Database className="w-5 h-5 text-neon-green" />}
          tooltip="Average size of blocks in megabytes. Larger blocks can contain more transactions but may increase network propagation time. Size is limited by block gas limits."
        />
        
        <DashboardWidget
          title="Block Time"
          value="2.1s"
          change={{ value: "-0.1s", type: "decrease" }}
          icon={<Clock className="w-5 h-5 text-neon-blue" />}
          tooltip="Average time between consecutive blocks being mined. Shorter block times mean faster transaction confirmation but may increase network overhead."
        />
        
        <DashboardWidget
          title="Block Rewards"
          value="0.034 SBLK"
          change={{ value: "+5.2%", type: "increase" }}
          icon={<TrendingUp className="w-5 h-5 text-neon-green" />}
          tooltip="Average reward earned by validators for successfully mining a block, including base rewards and transaction fees. Higher rewards incentivize network security."
        />
      </div>

      {/* Recent Blocks */}
      <RecentBlocks onBlockClick={onBlockClick} />
    </div>
  );
}
import { VALIDATOR_TIERS, VALIDATOR_NAMES, VALIDATOR_ALIASES, TIER_CONFIGS } from './ValidatorConstants';

export type ValidatorTier = typeof VALIDATOR_TIERS[number];
export type ValidatorStatus = 'active' | 'warning';

export interface ValidatorData {
  id: string;
  name: string;
  alias: string;
  address: string;
  avatar: string;
  totalStaked: string;
  stakersCount: number;
  arpScore: number;
  uptime: number;
  uptimeData: number[];
  status: ValidatorStatus;
  verified: boolean;
  tier: ValidatorTier;
  apy: number;
  commission: number;
  slashingCount: number;
  lastActive: string;
}

// Mock sparkline data for 90-day uptime
export const generateSparklineData = (uptimePercent: number): number[] => {
  const days = 90;
  const data = [];
  const baseUptime = uptimePercent / 100;
  
  for (let i = 0; i < days; i++) {
    // Add some realistic variance
    const variance = (Math.random() - 0.5) * 0.02;
    const uptime = Math.max(0.85, Math.min(1, baseUptime + variance));
    data.push(uptime * 100);
  }
  return data;
};

// Enhanced validator data generator
export const generateValidators = (count: number): ValidatorData[] => {
  const validators: ValidatorData[] = [];

  for (let i = 0; i < count; i++) {
    const tier = i < count * 0.1 ? 'elite' : 
                 i < count * 0.3 ? 'professional' : 
                 i < count * 0.8 ? 'standard' : 'solo';
    const baseStake = TIER_CONFIGS[tier].baseStake;
    const stake = baseStake + Math.floor(Math.random() * 50000);
    const uptime = 96 + Math.random() * 4; // 96-100%
    const arpScore = 5000 + Math.floor(Math.random() * 5000);
    
    validators.push({
      id: `${VALIDATOR_NAMES[Math.floor(Math.random() * VALIDATOR_NAMES.length)].toLowerCase()}-${String(i).padStart(3, '0')}`,
      name: `${VALIDATOR_NAMES[Math.floor(Math.random() * VALIDATOR_NAMES.length)]}Validator${String(i).padStart(3, '0')}`,
      alias: VALIDATOR_ALIASES[Math.floor(Math.random() * VALIDATOR_ALIASES.length)],
      address: `sblk${Math.random().toString(16).slice(2, 42)}`,
      avatar: `${VALIDATOR_NAMES[Math.floor(Math.random() * VALIDATOR_NAMES.length)][0]}${Math.floor(Math.random() * 100)}`,
      totalStaked: stake.toLocaleString(),
      stakersCount: Math.floor(Math.random() * 50) + 1,
      arpScore,
      uptime,
      uptimeData: generateSparklineData(uptime),
      status: Math.random() > 0.9 ? 'warning' : 'active',
      verified: Math.random() > 0.3,
      tier,
      apy: 2.5 + Math.random() * 2, // 2.5-4.5%
      commission: Math.random() * 15, // 0-15%
      slashingCount: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0,
      lastActive: Math.random() > 0.5 ? `${Math.floor(Math.random() * 60)}m ago` : `${Math.floor(Math.random() * 24)}h ago`
    });
  }

  return validators.sort((a, b) => parseInt(b.totalStaked.replace(/,/g, '')) - parseInt(a.totalStaked.replace(/,/g, '')));
};

export const getArpScoreColor = (score: number): string => {
  if (score >= 9000) return "text-neon-green border-neon-green/30 bg-neon-green/10";
  if (score >= 8000) return "text-neon-blue border-neon-blue/30 bg-neon-blue/10";
  if (score >= 7000) return "text-chart-4 border-chart-4/30 bg-chart-4/10";
  return "text-chart-3 border-chart-3/30 bg-chart-3/10";
};
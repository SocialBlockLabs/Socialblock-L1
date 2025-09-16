export const TOTAL_VALIDATORS = 3;

export const VALIDATOR_TIERS = ['elite', 'professional', 'standard', 'solo'] as const;
export const VALIDATOR_STATUSES = ['active', 'warning'] as const;
export const VALIDATOR_NAMES = ['Prysm', 'Lighthouse', 'Teku', 'Nimbus', 'Besu', 'Geth', 'Reth', 'Nethermind'] as const;

export const VALIDATOR_ALIASES = [
  '🏆 Elite Node', '⚡ Speed Demon', '🔒 Fort Knox', '🌟 Rising Star',
  '🛡️ Guardian', '🚀 Rocket Node', '🏠 Home Staker', '⚠️ Risky Business',
  '💎 Diamond Hands', '🔥 Fire Node', '🌊 Wave Rider', '⭐ Star Node',
  '🎯 Target Locked', '🗽 Freedom Node', '🌍 Global Node', '🎪 Circus Node'
] as const;

export const TIER_CONFIGS = {
  elite: { label: "Elite", color: "text-neon-green border-neon-green/30 bg-neon-green/10", baseStake: 100000 },
  professional: { label: "Pro", color: "text-neon-blue border-neon-blue/30 bg-neon-blue/10", baseStake: 70000 },
  standard: { label: "Standard", color: "text-muted-foreground border-muted-foreground/30 bg-muted/10", baseStake: 40000 },
  solo: { label: "Solo", color: "text-chart-4 border-chart-4/30 bg-chart-4/10", baseStake: 32000 }
} as const;

export const ARP_SCORE_COLORS = {
  9000: "text-neon-green border-neon-green/30 bg-neon-green/10",
  8000: "text-neon-blue border-neon-blue/30 bg-neon-blue/10", 
  7000: "text-chart-4 border-chart-4/30 bg-chart-4/10",
  default: "text-chart-3 border-chart-3/30 bg-chart-3/10"
} as const;
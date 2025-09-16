import { cn } from "./ui/utils";

interface TrustScoreMeterProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function TrustScoreMeter({ score, size = 'md', showLabel = true, className }: TrustScoreMeterProps) {
  // Normalize score to 0-100 range
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // Calculate the stroke-dasharray for the progress circle
  const radius = size === 'sm' ? 30 : size === 'md' ? 40 : 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(normalizedScore / 100) * circumference} ${circumference}`;
  
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return { color: '#00ff41', glow: 'rgba(0, 255, 65, 0.4)', label: 'Excellent' };
    if (score >= 75) return { color: '#00f5ff', glow: 'rgba(0, 245, 255, 0.4)', label: 'Very Good' };
    if (score >= 60) return { color: '#f7dc6f', glow: 'rgba(247, 220, 111, 0.4)', label: 'Good' };
    if (score >= 40) return { color: '#ff6b35', glow: 'rgba(255, 107, 53, 0.4)', label: 'Fair' };
    return { color: '#ff4444', glow: 'rgba(255, 68, 68, 0.4)', label: 'Poor' };
  };

  const scoreData = getScoreColor(normalizedScore);
  const size_config = {
    sm: { 
      container: 'w-20 h-20', 
      svg: 'w-20 h-20', 
      text: 'text-sm', 
      label: 'text-xs',
      strokeWidth: 3 
    },
    md: { 
      container: 'w-24 h-24', 
      svg: 'w-24 h-24', 
      text: 'text-base', 
      label: 'text-sm',
      strokeWidth: 4 
    },
    lg: { 
      container: 'w-32 h-32', 
      svg: 'w-32 h-32', 
      text: 'text-lg', 
      label: 'text-base',
      strokeWidth: 5 
    }
  };

  const config = size_config[size];

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {/* Circular Progress Meter */}
      <div className={cn("relative", config.container)}>
        <svg 
          className={cn("transform -rotate-90", config.svg)}
          viewBox={`0 0 ${(radius + 20) * 2} ${(radius + 20) * 2}`}
        >
          {/* Background circle */}
          <circle
            cx={radius + 20}
            cy={radius + 20}
            r={radius}
            stroke="rgba(51, 51, 51, 0.3)"
            strokeWidth={config.strokeWidth}
            fill="transparent"
            className="drop-shadow-sm"
          />
          
          {/* Progress circle with glow effect */}
          <circle
            cx={radius + 20}
            cy={radius + 20}
            r={radius}
            stroke={scoreData.color}
            strokeWidth={config.strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="0"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out drop-shadow-lg"
            style={{
              filter: `drop-shadow(0 0 8px ${scoreData.glow})`
            }}
          />
          
          {/* Inner glow circle */}
          <circle
            cx={radius + 20}
            cy={radius + 20}
            r={radius - 8}
            stroke={scoreData.color}
            strokeWidth="1"
            fill="transparent"
            opacity="0.3"
            className="animate-pulse"
          />
        </svg>
        
        {/* Score text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className={cn("font-mono font-bold", config.text)}
            style={{ color: scoreData.color, textShadow: `0 0 10px ${scoreData.glow}` }}
          >
            {normalizedScore}
          </span>
          <span className="text-xs text-muted-foreground">Trust</span>
        </div>
        
        {/* Pulsing indicator for high scores */}
        {normalizedScore >= 90 && (
          <div 
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: `radial-gradient(circle, ${scoreData.glow} 0%, transparent 70%)`,
              opacity: 0.2
            }}
          />
        )}
      </div>
      
      {/* Score label */}
      {showLabel && (
        <div className="text-center">
          <div 
            className={cn("font-medium", config.label)}
            style={{ color: scoreData.color }}
          >
            {scoreData.label}
          </div>
          <div className="text-xs text-muted-foreground">Trust Level</div>
        </div>
      )}
    </div>
  );
}
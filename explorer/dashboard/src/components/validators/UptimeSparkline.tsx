interface UptimeSparklineProps {
  data: number[];
  uptime: number;
}

export function UptimeSparkline({ data, uptime }: UptimeSparklineProps) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1; // Avoid division by zero
  
  // Create smooth curve path - increased size
  const pathData = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 120; // 120px wide (increased from 80px)
    const y = 40 - ((value - minValue) / range) * 32; // 40px high with more padding (increased from 24px)
    return { x, y, value };
  });

  const smoothPath = pathData.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    
    const prevPoint = pathData[index - 1];
    const cp1x = prevPoint.x + (point.x - prevPoint.x) * 0.3;
    const cp1y = prevPoint.y;
    const cp2x = point.x - (point.x - prevPoint.x) * 0.3;
    const cp2y = point.y;
    
    return `${path} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  }, '');

  const getColors = () => {
    if (uptime >= 99.5) return {
      line: "#00ff41",
      glow: "rgba(0, 255, 65, 0.4)",
      text: "#00ff41"
    };
    if (uptime >= 98) return {
      line: "#f7dc6f", 
      glow: "rgba(247, 220, 111, 0.4)",
      text: "#f7dc6f"
    };
    return {
      line: "#ff6b35",
      glow: "rgba(255, 107, 53, 0.4)", 
      text: "#ff6b35"
    };
  };

  const colors = getColors();

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Uptime percentage - centered above graph */}
      <div className="text-center">
        <span className="text-sm font-mono font-medium" style={{ color: colors.text }}>
          {uptime.toFixed(1)}%
        </span>
      </div>
      
      {/* Enhanced larger graph */}
      <div className="relative">
        <svg width="120" height="40" className="overflow-visible">
          {/* Background grid */}
          <defs>
            <pattern id={`grid-${uptime}`} width="10" height="8" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 8" fill="none" stroke="rgba(136, 136, 136, 0.15)" strokeWidth="0.5"/>
            </pattern>
            <linearGradient id={`gradient-${uptime}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.line} stopOpacity="0.4"/>
              <stop offset="50%" stopColor={colors.line} stopOpacity="0.2"/>
              <stop offset="100%" stopColor={colors.line} stopOpacity="0.05"/>
            </linearGradient>
            <filter id={`glow-${uptime}`}>
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Grid pattern background */}
          <rect width="120" height="40" fill={`url(#grid-${uptime})`} opacity="0.6"/>
          
          {/* Area fill gradient */}
          <path
            d={`${smoothPath} L 120 40 L 0 40 Z`}
            fill={`url(#gradient-${uptime})`}
          />
          
          {/* Main line with enhanced glow */}
          <path
            d={smoothPath}
            fill="none"
            stroke={colors.line}
            strokeWidth="2.5"
            filter={`url(#glow-${uptime})`}
            className="drop-shadow-lg"
          />
          
          {/* Data points - more visible */}
          {pathData.filter((_, i) => i % 12 === 0).map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="2"
              fill={colors.line}
              className="opacity-70"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Enhanced current point indicator */}
          <circle
            cx={pathData[pathData.length - 1]?.x}
            cy={pathData[pathData.length - 1]?.y}
            r="3"
            fill={colors.line}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1.5"
            className="animate-pulse"
          />
          
          {/* Subtle border frame */}
          <rect 
            width="120" 
            height="40" 
            fill="none" 
            stroke="rgba(136, 136, 136, 0.2)" 
            strokeWidth="1" 
            rx="2"
          />
        </svg>
      </div>
    </div>
  );
}
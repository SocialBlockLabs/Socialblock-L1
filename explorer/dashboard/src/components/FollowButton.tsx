import { useState } from "react";
import { Button } from "./ui/button";
import { Heart, Bell } from "lucide-react";

interface FollowButtonProps {
  id: string;
  type: 'validator' | 'wallet' | 'proposal' | 'address';
  name?: string;
  isFollowing?: boolean;
  onFollowChange?: (id: string, isFollowing: boolean) => void;
  onOpenSubscriptions?: (id: string, type: string, name?: string) => void;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function FollowButton({
  id,
  type,
  name,
  isFollowing = false,
  onFollowChange,
  onOpenSubscriptions,
  size = 'sm',
  showText = false,
  className = ''
}: FollowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFollowing) {
      // If already following, open subscription management
      onOpenSubscriptions?.(id, type, name);
    } else {
      // If not following, start following with animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
      onFollowChange?.(id, true);
    }
  };

  const sizeClasses = {
    sm: 'h-6 w-6 p-0',
    md: 'h-8 w-8 p-0',
    lg: 'h-10 w-10 p-0'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <Button
      variant="ghost"
      className={`
        ${sizeClasses[size]} 
        ${showText ? 'px-3 w-auto' : ''}
        relative transition-all duration-300 hover:scale-110
        ${isFollowing 
          ? 'text-neon-magenta hover:text-neon-magenta/80 hover:bg-neon-magenta/10' 
          : 'text-muted-foreground hover:text-neon-magenta hover:bg-neon-magenta/10'
        }
        ${className}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={isFollowing ? {
        boxShadow: '0 0 10px rgba(255, 0, 255, 0.3)'
      } : {}}
    >
      <div className="relative flex items-center space-x-2">
        <Heart
          className={`
            ${iconSizes[size]} 
            transition-all duration-300
            ${isFollowing ? 'fill-current' : ''}
            ${isAnimating ? 'animate-ping' : ''}
            ${isHovered && !isFollowing ? 'scale-110' : ''}
          `}
        />
        
        {showText && (
          <span className="text-xs font-medium">
            {isFollowing ? 'Following' : 'Follow'}
          </span>
        )}

        {isFollowing && (
          <Bell
            className={`
              ${iconSizes[size]} 
              absolute -top-1 -right-1 
              text-neon-blue opacity-60
              ${isHovered ? 'animate-pulse' : ''}
            `}
          />
        )}
      </div>

      {/* Pulse animation effect */}
      {isAnimating && (
        <div className={`
          absolute inset-0 rounded-full border-2 border-neon-magenta 
          animate-ping opacity-75
        `} />
      )}
    </Button>
  );
}
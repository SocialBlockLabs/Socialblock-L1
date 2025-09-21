import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { 
  Heart, 
  Bell, 
  Mail, 
  Webhook, 
  Shield, 
  Vote, 
  Activity,
  User,
  X,
  Check,
  AlertTriangle,
  Settings,
  Trash2
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SubscriptionSettings {
  email: {
    enabled: boolean;
    address: string;
  };
  webhook: {
    enabled: boolean;
    url: string;
  };
  notifications: {
    [key: string]: boolean;
  };
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'validator' | 'wallet' | 'proposal' | 'address';
  targetName?: string;
  currentSettings?: SubscriptionSettings;
  onSave: (settings: SubscriptionSettings) => void;
  onUnfollow: () => void;
}

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'validator':
      return {
        icon: Shield,
        label: 'Validator',
        color: 'text-neon-green',
        bgColor: 'bg-neon-green/10',
        borderColor: 'border-neon-green/30',
        notifications: {
          status_changes: 'Status changes (online/offline)',
          slashing_events: 'Slashing events',
          reward_updates: 'Reward updates',
          delegation_changes: 'Delegation changes',
          uptime_alerts: 'Uptime alerts'
        }
      };
    case 'proposal':
      return {
        icon: Vote,
        label: 'Proposal',
        color: 'text-neon-blue',
        bgColor: 'bg-neon-blue/10',
        borderColor: 'border-neon-blue/30',
        notifications: {
          status_changes: 'Status changes (live/passed/failed)',
          voting_milestones: 'Voting milestones',
          execution_updates: 'Execution updates',
          discussion_activity: 'Discussion activity',
          deadline_reminders: 'Deadline reminders'
        }
      };
    case 'wallet':
    case 'address':
      return {
        icon: User,
        label: 'Address',
        color: 'text-neon-magenta',
        bgColor: 'bg-neon-magenta/10',
        borderColor: 'border-neon-magenta/30',
        notifications: {
          transactions: 'New transactions',
          token_transfers: 'Token transfers',
          nft_activity: 'NFT activity',
          reputation_changes: 'Reputation changes',
          governance_activity: 'Governance participation'
        }
      };
    default:
      return {
        icon: Activity,
        label: 'Item',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted/10',
        borderColor: 'border-muted/30',
        notifications: {}
      };
  }
};

export function SubscriptionModal({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetName,
  currentSettings,
  onSave,
  onUnfollow
}: SubscriptionModalProps) {
  const [settings, setSettings] = useState<SubscriptionSettings>({
    email: {
      enabled: false,
      address: ''
    },
    webhook: {
      enabled: false,
      url: ''
    },
    notifications: {}
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const typeConfig = getTypeConfig(targetType);
  const TypeIcon = typeConfig.icon;

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
    setHasChanges(false);
  }, [currentSettings, isOpen]);

  const handleSettingChange = (path: string[], value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      let current = newSettings;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i] as keyof typeof current] as any;
      }
      
      current[path[path.length - 1] as keyof typeof current] = value;
      return newSettings;
    });
    setHasChanges(true);
  };

  const validateSettings = () => {
    if (settings.email.enabled && !settings.email.address) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    if (settings.webhook.enabled && !settings.webhook.url) {
      toast.error("Please enter a valid webhook URL");
      return false;
    }

    const hasNotifications = Object.values(settings.notifications).some(Boolean);
    const hasDelivery = settings.email.enabled || settings.webhook.enabled;
    
    if (hasNotifications && !hasDelivery) {
      toast.error("Please enable at least one delivery method (email or webhook)");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateSettings()) return;
    
    setIsValidating(true);
    
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSave(settings);
    setHasChanges(false);
    setIsValidating(false);
    toast.success("Subscription settings saved successfully");
    onClose();
  };

  const handleUnfollow = () => {
    onUnfollow();
    toast.success(`Unfollowed ${targetName || targetId}`);
    onClose();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50 shadow-cyber-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg flex items-center space-x-2">
              <Heart className="w-5 h-5 text-neon-magenta fill-current" />
              <span>Subscription Settings</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Target Info */}
          <Card className={`${typeConfig.bgColor} ${typeConfig.borderColor} border`}>
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${typeConfig.bgColor} ${typeConfig.borderColor} border`}>
                  <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={`text-xs ${typeConfig.color} ${typeConfig.borderColor}`}>
                      {typeConfig.label}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium truncate">
                    {targetName || formatAddress(targetId)}
                  </div>
                  {targetName && (
                    <div className="text-xs text-muted-foreground font-mono">
                      {formatAddress(targetId)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Delivery Methods */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <Bell className="w-4 h-4 text-neon-blue" />
              <span>Delivery Methods</span>
            </h4>

            {/* Email Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-chart-4" />
                  <Label htmlFor="email-enabled" className="text-sm">Email Notifications</Label>
                </div>
                <Switch
                  id="email-enabled"
                  checked={settings.email.enabled}
                  onCheckedChange={(checked) => handleSettingChange(['email', 'enabled'], checked)}
                />
              </div>
              
              {settings.email.enabled && (
                <div className="pl-6">
                  <Input
                    type="email"
                    placeholder="your-email@example.com"
                    value={settings.email.address}
                    onChange={(e) => handleSettingChange(['email', 'address'], e.target.value)}
                    className="text-sm bg-muted/20 border-border/30"
                  />
                </div>
              )}
            </div>

            {/* Webhook Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Webhook className="w-4 h-4 text-neon-green" />
                  <Label htmlFor="webhook-enabled" className="text-sm">Webhook Notifications</Label>
                </div>
                <Switch
                  id="webhook-enabled"
                  checked={settings.webhook.enabled}
                  onCheckedChange={(checked) => handleSettingChange(['webhook', 'enabled'], checked)}
                />
              </div>
              
              {settings.webhook.enabled && (
                <div className="pl-6">
                  <Input
                    type="url"
                    placeholder="https://your-webhook-url.com/notifications"
                    value={settings.webhook.url}
                    onChange={(e) => handleSettingChange(['webhook', 'url'], e.target.value)}
                    className="text-sm bg-muted/20 border-border/30"
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Notification Types */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <Settings className="w-4 h-4 text-neon-magenta" />
              <span>Notification Types</span>
            </h4>

            <div className="space-y-3">
              {Object.entries(typeConfig.notifications).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`notification-${key}`} className="text-sm text-muted-foreground">
                    {label}
                  </Label>
                  <Switch
                    id={`notification-${key}`}
                    checked={settings.notifications[key] || false}
                    onCheckedChange={(checked) => handleSettingChange(['notifications', key], checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <Button
            variant="outline"
            size="sm"
            className="text-chart-3 border-chart-3/30 hover:bg-chart-3/10"
            onClick={handleUnfollow}
          >
            <Trash2 className="w-3 h-3 mr-2" />
            Unfollow
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isValidating}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className={`
                ${hasChanges 
                  ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30' 
                  : 'bg-muted/20 text-muted-foreground'
                }
              `}
              onClick={handleSave}
              disabled={!hasChanges || isValidating}
            >
              {isValidating ? (
                <div className="w-3 h-3 border border-current border-t-transparent animate-spin rounded-full mr-2" />
              ) : (
                <Check className="w-3 h-3 mr-2" />
              )}
              {isValidating ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
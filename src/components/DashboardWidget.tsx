import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TrendingUp, TrendingDown, Info } from "lucide-react";

interface DashboardWidgetProps {
  title: string;
  value: string;
  change?: {
    value: string;
    type: "increase" | "decrease";
  };
  icon?: ReactNode;
  children?: ReactNode;
  accent?: string;
  tooltip?: string;
}

export function DashboardWidget({ 
  title, 
  value, 
  change, 
  icon, 
  children, 
  accent = "chart-1",
  tooltip 
}: DashboardWidgetProps) {
  return (
    <TooltipProvider>
      <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-border transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
              {tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm">
                    <p className="text-sm">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            {icon && (
              <div className={`p-2 rounded-lg bg-${accent}/10`}>
                {icon}
              </div>
            )}
          </div>
        </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-medium">{value}</div>
            {change && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className={`text-xs cursor-help ${
                      change.type === 'increase' 
                        ? 'text-chart-4 border-chart-4/20' 
                        : 'text-destructive border-destructive/20'
                    }`}
                  >
                    {change.type === 'increase' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {change.value}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  <p className="text-sm">
                    <span className={`font-semibold ${change.type === 'increase' ? 'text-chart-4' : 'text-destructive'}`}>
                      {change.type === 'increase' ? 'Increase' : 'Decrease'}
                    </span><br />
                    Change from previous period: {change.value}
                    {change.type === 'increase' ? ' (positive trend)' : ' (negative trend)'}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        {children}
      </CardContent>
      </Card>
    </TooltipProvider>
  );
}
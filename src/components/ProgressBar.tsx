import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantConfig = {
  default: 'bg-primary',
  success: 'bg-status-green',
  warning: 'bg-status-yellow', 
  danger: 'bg-status-red'
};

const sizeConfig = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
};

export const ProgressBar = ({ 
  value, 
  max = 100, 
  className, 
  showValue = true,
  size = 'md',
  variant = 'default'
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'bg-muted rounded-full overflow-hidden',
        sizeConfig[size]
      )}>
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            variantConfig[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground mt-1 block">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};
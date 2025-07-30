import { cn } from '@/lib/utils';
import { Status } from '@/types/report';

interface StatusBadgeProps {
  status: Status;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  green: {
    className: 'bg-status-green text-status-green-foreground border-status-green',
    label: 'OK'
  },
  yellow: {
    className: 'bg-status-yellow text-status-yellow-foreground border-status-yellow',
    label: 'Atenção'
  },
  red: {
    className: 'bg-status-red text-status-red-foreground border-status-red',
    label: 'Crítico'
  }
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export const StatusBadge = ({ status, className, size = 'md' }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold border-2 transition-all duration-200',
        config.className,
        sizeConfig[size],
        className
      )}
    >
      <div className={cn('w-2 h-2 rounded-full mr-2', 
        status === 'green' && 'bg-status-green-foreground',
        status === 'yellow' && 'bg-status-yellow-foreground', 
        status === 'red' && 'bg-status-red-foreground'
      )} />
      {config.label}
    </span>
  );
};
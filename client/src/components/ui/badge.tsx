import React from 'react';
import cn from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
}

const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-transparent';

  const variants = {
    default: 'bg-primary-muted text-primary',
    secondary: 'bg-neutral/10 text-text-secondary',
    destructive: 'bg-danger/10 text-danger',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
    outline: 'border-border text-text-secondary bg-transparent',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      <span className="w-1 h-1 rounded-full bg-current shrink-0" />
      {props.children}
    </div>
  );
};

export default Badge;

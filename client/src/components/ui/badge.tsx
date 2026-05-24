import React from 'react';
import cn from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500';

  const variants = {
    default: 'border-transparent bg-purple-500 text-white dark:bg-purple-600',
    secondary: 'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    destructive: 'border-transparent bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400',
    success: 'border-transparent bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400',
    warning: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
    outline: 'border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-300',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  );
};

export default Badge;

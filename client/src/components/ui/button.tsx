import React from 'react';
import cn from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button: React.FC<ButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-30 cursor-pointer active:scale-95';

  const variants = {
    // Primary - main CTA (orange)
    default: 'bg-primary hover:bg-primary-hover text-canvas border border-transparent shadow-sm',
    // Danger - delete
    destructive: 'bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20',
    // Secondary - edit, view
    outline: 'bg-elevated border border-border text-text-primary hover:bg-hover',
    // Fallback/Standard Secondary
    secondary: 'bg-hover border border-border text-text-primary hover:bg-elevated',
    // Ghost - cancel, close
    ghost: 'text-text-secondary hover:bg-hover hover:text-text-primary',
    // Link text
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-10 px-4 py-2 text-sm rounded-lg',
    sm: 'h-8 px-3 text-xs rounded-md',
    lg: 'h-12 px-6 text-base rounded-lg',
    icon: 'h-9 w-9 rounded-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
};

export default Button;

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
  const baseStyles = 'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-98 duration-200';

  const variants = {
    default: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:brightness-105 shadow-purple-500/20 dark:from-purple-500 dark:to-indigo-500',
    destructive: 'bg-red-500 text-white shadow-sm hover:bg-red-600 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900',
    outline: 'border border-gray-200/60 bg-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    ghost: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
    link: 'text-purple-600 underline-offset-4 hover:underline dark:text-purple-400',
  };

  const sizes = {
    default: 'h-10 px-5 py-2.5',
    sm: 'h-9 px-3.5 text-xs',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
};

export default Button;

import React from 'react';
import cn from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, type = 'text', ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-border bg-elevated px-4 py-2 text-base text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-30',
        className
      )}
      {...props}
    />
  );
};

export default Input;

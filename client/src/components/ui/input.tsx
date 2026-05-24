import React from 'react';
import cn from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, type = 'text', ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-xl border border-gray-200/80 bg-white/50 px-4 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-purple-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950/20 dark:text-gray-100 dark:focus:border-purple-400 dark:focus:bg-gray-950',
        className
      )}
      {...props}
    />
  );
};

export default Input;

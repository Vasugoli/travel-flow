import React from 'react';
import cn from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ className, children, ...props }) => {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          'flex h-10 w-full rounded-xl border border-gray-200/80 bg-white/50 px-4 py-2 text-sm outline-none transition-all focus:border-purple-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950/20 dark:text-gray-100 dark:focus:border-purple-400 dark:focus:bg-gray-950 appearance-none cursor-pointer pr-10',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg
          className="h-4.5 w-4.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default Select;

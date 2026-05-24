import React from 'react';
import cn from '@/lib/utils';

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardBase: React.FC<DivProps> = ({ className, ...props }) => (
  <div
    className={cn(
      'rounded-2xl border border-gray-200/50 bg-white/70 shadow-sm text-gray-950 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70 dark:text-gray-50',
      className
    )}
    {...props}
  />
);

const CardHeader: React.FC<DivProps> = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3
    className={cn('font-bold leading-none tracking-tight text-gray-900 dark:text-white my-0', className)}
    {...props}
  />
);

const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-sm text-gray-500 dark:text-gray-400', className)} {...props} />
);

const CardContent: React.FC<DivProps> = ({ className, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
);

const CardFooter: React.FC<DivProps> = ({ className, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
);

// Compound Component Assignment to satisfy 'One export per file'
const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

export default Card;

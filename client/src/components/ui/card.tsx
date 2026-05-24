import React from 'react';
import cn from '@/lib/utils';

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardBase: React.FC<DivProps> = ({ className, ...props }) => (
  <div
    className={cn(
      'rounded-xl border border-border bg-surface shadow-sm text-text-primary hover:border-border/80 transition-colors duration-200',
      className
    )}
    {...props}
  />
);

const CardHeader: React.FC<DivProps> = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6 border-b border-border', className)} {...props} />
);

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3
    className={cn('font-display font-semibold text-lg text-text-primary my-0', className)}
    {...props}
  />
);

const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-xs text-text-secondary mt-1', className)} {...props} />
);

const CardContent: React.FC<DivProps> = ({ className, ...props }) => (
  <div className={cn('p-6', className)} {...props} />
);

const CardFooter: React.FC<DivProps> = ({ className, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0 border-t border-border mt-auto', className)} {...props} />
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

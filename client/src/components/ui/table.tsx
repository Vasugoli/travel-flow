import React from 'react';
import cn from '@/lib/utils';

const TableBase: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({ className, ...props }) => (
  <div className="relative w-full overflow-x-auto rounded-xl border border-border bg-surface">
    <table className={cn('w-full caption-bottom text-sm border-collapse', className)} {...props} />
  </div>
);

const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, ...props }) => (
  <thead className={cn('bg-elevated border-b border-border', className)} {...props} />
);

const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, ...props }) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
);

const TableFooter: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, ...props }) => (
  <tfoot className={cn('bg-elevated border-t border-border font-semibold text-text-primary', className)} {...props} />
);

const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className, ...props }) => (
  <tr
    className={cn(
      'border-b border-border transition-colors duration-100 hover:bg-hover cursor-pointer group',
      className
    )}
    {...props}
  />
);

const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className, ...props }) => (
  <th
    className={cn(
      'h-11 px-4 text-left align-middle font-display font-semibold text-text-secondary tracking-widest text-xs uppercase whitespace-nowrap',
      className
    )}
    {...props}
  />
);

const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className, ...props }) => (
  <td className={cn('px-4 py-4 align-middle text-sm text-text-primary', className)} {...props} />
);

const TableCaption: React.FC<React.HTMLAttributes<HTMLTableCaptionElement>> = ({ className, ...props }) => (
  <caption className={cn('mt-4 text-xs text-text-secondary', className)} {...props} />
);

// Compound Component Assignment to satisfy 'One export per file'
const Table = Object.assign(TableBase, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
});

export default Table;

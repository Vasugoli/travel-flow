import React from 'react';
import cn from '@/lib/utils';

const TableBase: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({ className, ...props }) => (
  <div className="relative w-full overflow-auto rounded-2xl border border-gray-200/50 bg-white/50 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/30">
    <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
);

const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, ...props }) => (
  <thead className={cn('[&_tr]:border-b dark:[&_tr]:border-gray-800', className)} {...props} />
);

const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, ...props }) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
);

const TableFooter: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, ...props }) => (
  <tfoot className={cn('bg-gray-50/50 font-medium dark:bg-gray-800/50', className)} {...props} />
);

const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className, ...props }) => (
  <tr
    className={cn(
      'border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/20 data-[state=selected]:bg-gray-100 dark:data-[state=selected]:bg-gray-800',
      className
    )}
    {...props}
  />
);

const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className, ...props }) => (
  <th
    className={cn(
      'h-12 px-6 text-left align-middle font-bold text-gray-500 tracking-wider text-xs uppercase dark:text-gray-400',
      className
    )}
    {...props}
  />
);

const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className, ...props }) => (
  <td className={cn('p-6 align-middle text-gray-700 dark:text-gray-300', className)} {...props} />
);

const TableCaption: React.FC<React.HTMLAttributes<HTMLTableCaptionElement>> = ({ className, ...props }) => (
  <caption className={cn('mt-4 text-xs text-gray-500 dark:text-gray-400', className)} {...props} />
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

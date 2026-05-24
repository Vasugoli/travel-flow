import React from 'react';

const statusMap: Record<string, { label: string; classes: string }> = {
  // Vehicle statuses
  available:          { label: 'Available',         classes: 'bg-green-500/10  text-green-400' },
  'in-transit':       { label: 'In Transit',         classes: 'bg-amber-500/10  text-amber-400' },
  maintenance:        { label: 'Maintenance',        classes: 'bg-red-500/10    text-red-400'   },
  retired:            { label: 'Retired',            classes: 'bg-zinc-500/10   text-zinc-400'  },
  // Driver statuses
  'on-trip':          { label: 'On Trip',            classes: 'bg-amber-500/10  text-amber-400' },
  'off-duty':         { label: 'Off Duty',           classes: 'bg-zinc-500/10   text-zinc-400'  },
  suspended:          { label: 'Suspended',          classes: 'bg-red-500/10    text-red-400'   },
  // Trip statuses
  scheduled:          { label: 'Scheduled',          classes: 'bg-blue-500/10   text-blue-400'  },
  loading:            { label: 'Loading',            classes: 'bg-cyan-500/10   text-cyan-400'  },
  delivered:          { label: 'Delivered',          classes: 'bg-green-500/10  text-green-400' },
  completed:          { label: 'Completed',          classes: 'bg-green-500/10  text-green-400' },
  cancelled:          { label: 'Cancelled',          classes: 'bg-zinc-500/10   text-zinc-400'  },
  // Delivery statuses
  pending:            { label: 'Pending',            classes: 'bg-amber-500/10  text-amber-400' },
  dispatched:         { label: 'Dispatched',         classes: 'bg-blue-500/10   text-blue-400'  },
  'out-for-delivery': { label: 'Out for Delivery',   classes: 'bg-cyan-500/10   text-cyan-400'  },
  failed:             { label: 'Failed',             classes: 'bg-red-500/10    text-red-400'   },
  // Priority levels
  urgent:             { label: 'Urgent',             classes: 'bg-red-500/10    text-red-400'   },
  high:               { label: 'High',               classes: 'bg-amber-500/10  text-amber-400' },
  medium:             { label: 'Medium',             classes: 'bg-blue-500/10   text-blue-400'  },
  low:                { label: 'Low',                classes: 'bg-zinc-500/10   text-zinc-400'  },
};

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusMap[status.toLowerCase()] ?? { label: status, classes: 'bg-zinc-500/10 text-zinc-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${config.classes} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
};

export default StatusBadge;

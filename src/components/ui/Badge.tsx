import React from 'react';
import { cn, getStatusColor, getStatusLabel } from '../../lib/utils';
import { CheckCircle2, XCircle, AlertCircle, Info, Circle } from 'lucide-react';

interface BadgeProps {
  status: string;
  label?: string;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, label, showDot = true, className }: BadgeProps) {
  const colorClass = getStatusColor(status);
  const displayLabel = label || getStatusLabel(status);

  return (
    <span className={cn(colorClass, className)}>
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 inline-block" />}
      {displayLabel}
    </span>
  );
}

interface SimpleBadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'orange' | 'gray';
  className?: string;
}

export function Badge({ children, variant = 'gray', className }: SimpleBadgeProps) {
  return (
    <span className={cn(`badge-${variant}`, className)}>
      {children}
    </span>
  );
}

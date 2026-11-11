import { type ClassValue, clsx } from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy, HH:mm');
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function generateAssetId(existingIds: string[]): string {
  const nums = existingIds
    .map(id => parseInt(id.replace('AST-', ''), 10))
    .filter(n => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `AST-${String(next).padStart(4, '0')}`;
}

export function generateEmployeeId(existingIds: string[]): string {
  const nums = existingIds
    .map(id => parseInt(id.replace('GS1-', ''), 10))
    .filter(n => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `GS1-${String(next).padStart(3, '0')}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    available: 'badge-green',
    assigned: 'badge-blue',
    maintenance: 'badge-orange',
    retired: 'badge-gray',
    damaged: 'badge-red',
    active: 'badge-green',
    inactive: 'badge-gray',
    on_leave: 'badge-orange',
    pending: 'badge-orange',
    in_progress: 'badge-blue',
    completed: 'badge-green',
    cancelled: 'badge-gray',
    overdue: 'badge-red',
    returned: 'badge-gray',
    excellent: 'badge-green',
    good: 'badge-blue',
    fair: 'badge-orange',
    poor: 'badge-orange',
  };
  return colors[status] || 'badge-gray';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    available: 'Available',
    assigned: 'Assigned',
    maintenance: 'Maintenance',
    retired: 'Retired',
    damaged: 'Damaged',
    active: 'Active',
    inactive: 'Inactive',
    on_leave: 'On Leave',
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    overdue: 'Overdue',
    returned: 'Returned',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  };
  return labels[status] || status;
}

export function exportToCSV<T extends object>(data: T[], filename: string): void {
  if (data.length === 0) return;
  const rows = data as Record<string, unknown>[];
  const headers = Array.from(new Set(rows.flatMap(row => Object.keys(row))));
  const csvContent = [
    headers.join(','),
    ...rows.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadPDF(tableId: string, title: string): void {
  window.print();
  console.log(`Export PDF: ${title} from ${tableId}`);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str;
}

export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export function avatarColor(name: string): string {
  const colors = [
    'bg-blue-500', 'bg-blue-500', 'bg-blue-500', 'bg-orange-500',
    'bg-orange-500', 'bg-blue-500', 'bg-blue-500', 'bg-orange-500',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

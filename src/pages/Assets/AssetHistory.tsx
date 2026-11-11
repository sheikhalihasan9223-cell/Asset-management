import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/ui/Badge';
import { formatDate, getInitials, avatarColor } from '../../lib/utils';
import Pagination from '../../components/ui/Pagination';
import SearchSelect from '../../components/ui/SearchSelect';

export default function AssetHistory() {
  const { assignments, returns } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Merge assignments and returns into unified history
  const history = useMemo(() => {
    const rows = assignments.map(a => ({
      id: a.id,
      asset_id: a.asset?.asset_id || '—',
      asset_name: a.asset?.name || '—',
      serial_number: a.asset?.serial_number || '—',
      employee_name: a.employee?.full_name || '—',
      assignment_date: a.assignment_date,
      return_date: a.actual_return_date || '—',
      assigned_by: a.assigned_by || 'Admin',
      status: a.status,
      condition: a.condition_at_assignment,
    }));

    return rows.filter(r => {
      const q = search.toLowerCase();
      return (!q || r.asset_name.toLowerCase().includes(q) || r.employee_name.toLowerCase().includes(q) || r.asset_id.toLowerCase().includes(q))
        && (!statusFilter || r.status === statusFilter);
    });
  }, [assignments, search, statusFilter]);

  const paged = history.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Asset History</h1>
        <p className="page-subtitle">Complete audit trail of all asset assignments and returns</p>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="form-input pl-9" placeholder="Search by asset, employee..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <SearchSelect className="w-40" value={statusFilter} placeholder="All Statuses"
            onValueChange={value => { setStatusFilter(value); setPage(1); }}
            options={[{ value: 'active', label: 'Active' }, { value: 'returned', label: 'Returned' }, { value: 'overdue', label: 'Overdue' }]} />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="table-th">Asset ID</th>
                <th className="table-th">Asset Name</th>
                <th className="table-th">Serial Number</th>
                <th className="table-th">Employee Name</th>
                <th className="table-th">Assignment Date</th>
                <th className="table-th">Return Date</th>
                <th className="table-th">Assigned By</th>
                <th className="table-th">Status</th>
                <th className="table-th">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr><td colSpan={9} className="table-td text-center py-12 text-gray-400">No history records found</td></tr>
              ) : paged.map(r => (
                <tr key={r.id} className="table-row">
                  <td className="table-td font-mono text-xs text-primary-600 font-semibold">{r.asset_id}</td>
                  <td className="table-td font-medium text-gray-800">{r.asset_name}</td>
                  <td className="table-td font-mono text-xs text-gray-500">{r.serial_number}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${avatarColor(r.employee_name)} flex items-center justify-center text-white text-xs font-bold`}>
                        {getInitials(r.employee_name)}
                      </div>
                      <span className="font-medium text-gray-700">{r.employee_name}</span>
                    </div>
                  </td>
                  <td className="table-td text-gray-500">{formatDate(r.assignment_date)}</td>
                  <td className="table-td text-gray-500">{r.return_date !== '—' ? formatDate(r.return_date) : '—'}</td>
                  <td className="table-td text-gray-500">{r.assigned_by}</td>
                  <td className="table-td"><StatusBadge status={r.status} /></td>
                  <td className="table-td"><StatusBadge status={r.condition} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={Math.max(1, Math.ceil(history.length / pageSize))}
          totalItems={history.length} pageSize={pageSize} onPageChange={setPage} />
      </div>
    </div>
  );
}

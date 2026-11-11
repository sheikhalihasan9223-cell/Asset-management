import React, { useState, useMemo } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, Printer } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { getInitials, avatarColor } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import EmployeeFormModal from './EmployeeFormModal';
import { Employee } from '../../types';
import SearchSelect from '../../components/ui/SearchSelect';

export default function AllEmployees() {
  const { employees, assignments, deleteEmployee } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const pageSize = 10;
  const { departments } = useApp();

  const filtered = useMemo(() => employees.filter(e => {
    const q = search.toLowerCase();
    return (!q || e.full_name.toLowerCase().includes(q) || (e.employee_id || '').toLowerCase().includes(q) || e.email.toLowerCase().includes(q))
      && (!deptFilter || e.department_id === deptFilter)
      && (!statusFilter || e.status === statusFilter);
  }), [employees, search, deptFilter, statusFilter]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const getAssetCount = (empId: string) =>
    assignments.filter(a => a.employee_id === empId && a.status === 'active').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">All Employees</h1>
          <p className="page-subtitle">{employees.length} employees in system</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary btn-sm flex items-center gap-1.5">
          <Plus size={14} /> Add Employee
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="form-input pl-9" placeholder="Search by name, ID, email..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <SearchSelect className="w-44" value={deptFilter} placeholder="All Departments"
            onValueChange={value => { setDeptFilter(value); setPage(1); }}
            options={departments.map(d => ({ value: d.id, label: d.name }))} />
          <SearchSelect className="w-36" value={statusFilter} placeholder="All Statuses"
            onValueChange={value => { setStatusFilter(value); setPage(1); }}
            options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'on_leave', label: 'On Leave' }]} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="table-th">Employee</th>
                <th className="table-th">ID</th>
                <th className="table-th">Department</th>
                <th className="table-th">Designation</th>
                <th className="table-th">Email</th>
                <th className="table-th">Phone</th>
                <th className="table-th text-center">Assets</th>
                <th className="table-th">Status</th>
                <th className="table-th text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr><td colSpan={9} className="table-td text-center py-12 text-gray-400">No employees found</td></tr>
              ) : paged.map(emp => (
                <tr key={emp.id} className="table-row cursor-pointer" onClick={() => navigate(`/employees/${emp.id}`)}>
                  <td className="table-td" onClick={e => e.stopPropagation()}>
                    <div
                      className="flex items-center gap-3 cursor-pointer hover:text-primary-600"
                      onClick={() => navigate(`/employees/${emp.id}`)}
                    >
                      <div className={`w-9 h-9 rounded-full ${avatarColor(emp.full_name)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                        {getInitials(emp.full_name)}
                      </div>
                      <span className="font-semibold text-gray-800">{emp.full_name}</span>
                    </div>
                  </td>
                  <td className="table-td font-mono text-xs text-primary-600 font-semibold">{emp.employee_id || '—'}</td>
                  <td className="table-td text-gray-600">{emp.department?.name}</td>
                  <td className="table-td text-gray-500 text-xs">{emp.designation}</td>
                  <td className="table-td text-xs text-gray-500">{emp.email}</td>
                  <td className="table-td text-xs text-gray-500">{emp.phone}</td>
                  <td className="table-td text-center">
                    <span className="badge-blue">{getAssetCount(emp.id)}</span>
                  </td>
                  <td className="table-td"><StatusBadge status={emp.status} /></td>
                  <td className="table-td" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => navigate(`/employees/${emp.id}`)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => setEditEmp(emp)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(emp.id)}
                        className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={Math.max(1, Math.ceil(filtered.length / pageSize))}
          totalItems={filtered.length} pageSize={pageSize} onPageChange={setPage} />
      </div>

      <EmployeeFormModal
        isOpen={addOpen || !!editEmp}
        onClose={() => { setAddOpen(false); setEditEmp(null); }}
        editEmployee={editEmp}
      />

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Deactivate Employee" size="sm"
        footer={
          <>
            <button className="btn-secondary btn-sm" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn-danger btn-sm" onClick={() => { deleteEmployee(deleteId!); setDeleteId(null); }}>Deactivate</button>
          </>
        }
      >
        <p className="text-sm text-gray-600">Are you sure you want to deactivate this employee? Their records will be preserved.</p>
      </Modal>
    </div>
  );
}

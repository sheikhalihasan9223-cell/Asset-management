import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getInitials, avatarColor, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/ui/Badge';
import SearchSelect from '../../components/ui/SearchSelect';

export default function ReturnAsset() {
  const { employees, assignments, returnAsset } = useApp();
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [condition, setCondition] = useState<'available' | 'maintenance' | 'damaged'>('available');
  const [accessories, setAccessories] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const employee = employees.find(e => e.id === selectedEmployee);
  const employeeAssignments = assignments.filter(
    a => a.employee_id === selectedEmployee && a.status === 'active'
  );
  const assignment = employeeAssignments.find(a => a.id === selectedAssignment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedAssignment || !assignment) return;
    const returned = returnAsset({
      assignment_id: selectedAssignment,
      asset_id: assignment.asset_id,
      employee_id: selectedEmployee,
      return_date: returnDate,
      returned_condition: condition,
      accessories_returned: accessories,
      inspection_notes: notes,
    });
    if (!returned) return;
    setSubmitted(true);
    setTimeout(() => navigate('/assets/history'), 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Return Processed!</h2>
        <p className="text-gray-500">Asset has been returned and records updated. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/assets')} className="btn-ghost btn-sm flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h1 className="page-title">Return Asset</h1>
          <p className="page-subtitle">Process equipment return from an employee</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Employee Selection */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Select Employee</h3>
            <div>
              <label className="form-label">Employee *</label>
              <SearchSelect
                value={selectedEmployee}
                onValueChange={value => { setSelectedEmployee(value); setSelectedAssignment(''); }}
                placeholder="Choose employee..."
                required
                options={employees.filter(e => assignments.some(a => a.employee_id === e.id && a.status === 'active')).map(e => ({
                  value: e.id,
                  label: e.full_name,
                  description: [e.employee_id, e.department?.name].filter(Boolean).join(' · '),
                }))}
              />
            </div>

            {employee && (
              <div className="bg-primary-50 rounded-xl p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${avatarColor(employee.full_name)} flex items-center justify-center text-white text-base font-bold flex-shrink-0`}>
                  {getInitials(employee.full_name)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{employee.full_name}</div>
                  <div className="text-sm text-gray-600">{employee.designation} · {employee.department?.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{[employee.employee_id, employee.email].filter(Boolean).join(' · ')}</div>
                </div>
              </div>
            )}

            {selectedEmployee && (
              <div>
                <label className="form-label">Select Asset to Return *</label>
                {employeeAssignments.length === 0 ? (
                  <div className="text-sm text-gray-400 py-3 text-center">No active assignments for this employee</div>
                ) : (
                  <div className="space-y-2 mt-2">
                    {employeeAssignments.map(a => (
                      <label
                        key={a.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedAssignment === a.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="assignment"
                          value={a.id}
                          checked={selectedAssignment === a.id}
                          onChange={e => setSelectedAssignment(e.target.value)}
                          className="text-primary-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 text-sm">{a.asset?.name}</div>
                          <div className="text-xs text-gray-500">
                            {a.asset?.asset_id} · SN: {a.asset?.serial_number}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            Assigned: {formatDate(a.assignment_date)}
                          </div>
                        </div>
                        <StatusBadge status={a.status} />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Return Details */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Return Details</h3>

            <div>
              <label className="form-label">Return Date *</label>
              <input type="date" className="form-input" value={returnDate}
                onChange={e => setReturnDate(e.target.value)} required />
            </div>

            <div>
              <label className="form-label">Returned Condition *</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(['available', 'maintenance', 'damaged'] as const).map(c => (
                  <label
                    key={c}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                      condition === c
                        ? c === 'available' ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : c === 'maintenance' ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <input type="radio" name="condition" value={c} checked={condition === c}
                      onChange={() => setCondition(c)} className="sr-only" />
                    <span className="text-xs font-semibold capitalize">{c === 'available' ? 'Good / Available' : c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Accessories Returned</label>
              <input className="form-input" value={accessories} onChange={e => setAccessories(e.target.value)}
                placeholder="e.g. Charger, Bag returned" />
            </div>

            <div>
              <label className="form-label">Inspection Notes</label>
              <textarea className="form-textarea" rows={4} value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Describe the condition of the returned equipment..." />
            </div>

            {assignment && (
              <div className="bg-amber-50 rounded-xl p-4 text-sm">
                <div className="font-semibold text-amber-800 mb-2">Returning:</div>
                <div className="text-amber-700">{assignment.asset?.name}</div>
                <div className="text-amber-600 text-xs mt-1">
                  {assignment.asset?.asset_id} · SN: {assignment.asset?.serial_number}
                </div>
                <div className="text-amber-600 text-xs mt-0.5">
                  Originally assigned in: {assignment.condition_at_assignment} condition
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button type="button" className="btn-secondary" onClick={() => navigate('/assets')}>Cancel</button>
          <button
            type="submit"
            className="btn-success flex items-center gap-2"
            disabled={!selectedEmployee || !selectedAssignment}
          >
            <Save size={16} /> Confirm Return
          </button>
        </div>
      </form>
    </div>
  );
}

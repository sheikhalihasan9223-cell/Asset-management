import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';
import SearchSelect from '../../components/ui/SearchSelect';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editEmployee?: Employee | null;
}

export default function EmployeeFormModal({ isOpen, onClose, editEmployee }: Props) {
  const { addEmployee, updateEmployee, departments } = useApp();
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editEmployee ? {
      full_name: editEmployee.full_name,
      employee_id: editEmployee.employee_id || '',
      email: editEmployee.email,
      phone: editEmployee.phone,
      department_id: editEmployee.department_id,
      designation: editEmployee.designation,
      status: editEmployee.status,
      join_date: editEmployee.join_date,
    } : { status: 'active', join_date: new Date().toISOString().split('T')[0] },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(editEmployee ? {
        full_name: editEmployee.full_name, email: editEmployee.email, phone: editEmployee.phone,
        employee_id: editEmployee.employee_id || '',
        department_id: editEmployee.department_id, designation: editEmployee.designation,
        status: editEmployee.status, join_date: editEmployee.join_date,
      } : { status: 'active', join_date: new Date().toISOString().split('T')[0] });
    }
  }, [isOpen, editEmployee, reset]);

  const onSubmit = (data: any) => {
    if (editEmployee) updateEmployee(editEmployee.id, data);
    else addEmployee(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editEmployee ? 'Edit Employee' : 'Add Employee'} size="lg"
      footer={
        <>
          <button className="btn-secondary btn-sm" onClick={onClose}>Cancel</button>
          <button type="submit" form="emp-form" className="btn-primary btn-sm">
            {editEmployee ? 'Save Changes' : 'Add Employee'}
          </button>
        </>
      }
    >
      <form id="emp-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="form-label">Full Name *</label>
            <input className="form-input" {...register('full_name', { required: true })} placeholder="e.g. Ahmed Khan" />
          </div>
          <div>
            <label className="form-label">Employee ID <span className="text-gray-400 font-normal">(optional)</span></label>
            <input className="form-input" {...register('employee_id')} placeholder="Add an ID now or later" />
          </div>
          <div>
            <label className="form-label">Email *</label>
            <input type="email" className="form-input" {...register('email', { required: true })} placeholder="email@gs1sa.org" />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input className="form-input" {...register('phone')} placeholder="+966-50-XXXXXXX" />
          </div>
          <div>
            <label className="form-label">Department *</label>
            <Controller control={control} name="department_id" rules={{ required: true }} render={({ field }) => <SearchSelect value={String(field.value || '')} onValueChange={field.onChange} placeholder="Select department" required options={departments.map(d => ({ value: d.id, label: d.name }))} />} />
          </div>
          <div>
            <label className="form-label">Designation *</label>
            <input className="form-input" {...register('designation', { required: true })} placeholder="e.g. IT Manager" />
          </div>
          <div>
            <label className="form-label">Join Date</label>
            <input type="date" className="form-input" {...register('join_date')} />
          </div>
          <div>
            <label className="form-label">Status</label>
            <Controller control={control} name="status" render={({ field }) => <SearchSelect value={String(field.value || '')} onValueChange={field.onChange} options={[
              { value: 'active', label: 'Active' }, { value: 'on_leave', label: 'On Leave' }, { value: 'inactive', label: 'Inactive' },
            ]} />} />
          </div>
        </div>
      </form>
    </Modal>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchSelect from '../../components/ui/SearchSelect';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  category_id: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  serial_number: z.string().min(1, 'Serial number is required'),
  asset_tag: z.string().optional(),
  purchase_date: z.string().min(1, 'Purchase date is required'),
  purchase_cost: z.coerce.number().min(0),
  supplier_id: z.string().optional(),
  warranty_expiry: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  condition: z.enum(['excellent', 'good', 'fair', 'poor', 'damaged']),
  status: z.enum(['available', 'assigned', 'maintenance', 'retired', 'damaged']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddAsset() {
  const { addAsset, categories, suppliers } = useApp();
  const navigate = useNavigate();
  const { register, control, handleSubmit, formState: { errors } } = useForm<z.input<typeof schema>, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: { condition: 'excellent', status: 'available', purchase_cost: 0 },
  });

  const onSubmit = (data: FormData) => {
    addAsset(data as any);
    navigate('/assets');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/assets')} className="btn-ghost btn-sm flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h1 className="page-title">Add New Asset</h1>
          <p className="page-subtitle">Register a new asset in the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Asset Name *</label>
                <input className="form-input" {...register('name')} placeholder="e.g. Dell Latitude 5540" />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>
              <div>
                <label className="form-label">Category *</label>
                <Controller control={control} name="category_id" render={({ field }) => <SearchSelect value={String(field.value || '')} onValueChange={field.onChange} placeholder="Select category" required options={categories.map(c => ({ value: c.id, label: c.name }))} />} />
                {errors.category_id && <p className="form-error">{errors.category_id.message}</p>}
              </div>
              <div>
                <label className="form-label">Brand *</label>
                <input className="form-input" {...register('brand')} placeholder="e.g. Dell" />
                {errors.brand && <p className="form-error">{errors.brand.message}</p>}
              </div>
              <div>
                <label className="form-label">Model *</label>
                <input className="form-input" {...register('model')} placeholder="e.g. Latitude 5540" />
                {errors.model && <p className="form-error">{errors.model.message}</p>}
              </div>
              <div>
                <label className="form-label">Serial Number *</label>
                <input className="form-input" {...register('serial_number')} placeholder="e.g. SN123456" />
                {errors.serial_number && <p className="form-error">{errors.serial_number.message}</p>}
              </div>
              <div>
                <label className="form-label">Asset Tag / Barcode</label>
                <input className="form-input" {...register('asset_tag')} placeholder="e.g. GS1-LAP-001" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Purchase Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Purchase Date *</label>
                <input type="date" className="form-input" {...register('purchase_date')} />
                {errors.purchase_date && <p className="form-error">{errors.purchase_date.message}</p>}
              </div>
              <div>
                <label className="form-label">Purchase Cost (SAR)</label>
                <input type="number" step="0.01" className="form-input" {...register('purchase_cost')} />
              </div>
              <div>
                <label className="form-label">Supplier</label>
                <Controller control={control} name="supplier_id" render={({ field }) => <SearchSelect value={String(field.value || '')} onValueChange={field.onChange} placeholder="Select supplier" options={suppliers.map(s => ({ value: s.id, label: s.name, description: s.contact_person }))} />} />
              </div>
              <div>
                <label className="form-label">Warranty Expiry Date</label>
                <input type="date" className="form-input" {...register('warranty_expiry')} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Condition & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Location *</label>
                <input className="form-input" {...register('location')} placeholder="e.g. IT Department" />
                {errors.location && <p className="form-error">{errors.location.message}</p>}
              </div>
              <div>
                <label className="form-label">Asset Condition *</label>
                <Controller control={control} name="condition" render={({ field }) => <SearchSelect value={field.value} onValueChange={field.onChange} required options={[
                  { value: 'excellent', label: 'Excellent' }, { value: 'good', label: 'Good' }, { value: 'fair', label: 'Fair' }, { value: 'poor', label: 'Poor' }, { value: 'damaged', label: 'Damaged' },
                ]} />} />
              </div>
              <div>
                <label className="form-label">Initial Status</label>
                <Controller control={control} name="status" render={({ field }) => <SearchSelect value={field.value} onValueChange={field.onChange} required options={[
                  { value: 'available', label: 'Available' }, { value: 'maintenance', label: 'Maintenance' },
                ]} />} />
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" rows={3} {...register('notes')} placeholder="Any additional notes about this asset..." />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => navigate('/assets')}>Cancel</button>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Save size={16} /> Save Asset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

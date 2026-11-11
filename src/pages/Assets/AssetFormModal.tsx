import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { Asset } from '../../types';
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editAsset?: Asset | null;
}

export default function AssetFormModal({ isOpen, onClose, editAsset }: Props) {
  const { addAsset, updateAsset, categories, suppliers } = useApp();
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<z.input<typeof schema>, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: editAsset ? {
      name: editAsset.name,
      category_id: editAsset.category_id,
      brand: editAsset.brand,
      model: editAsset.model,
      serial_number: editAsset.serial_number,
      asset_tag: editAsset.asset_tag || '',
      purchase_date: editAsset.purchase_date,
      purchase_cost: editAsset.purchase_cost,
      supplier_id: editAsset.supplier_id || '',
      warranty_expiry: editAsset.warranty_expiry || '',
      location: editAsset.location,
      condition: editAsset.condition,
      status: editAsset.status,
      notes: editAsset.notes || '',
    } : {
      condition: 'excellent',
      status: 'available',
      purchase_cost: 0,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(editAsset ? {
        name: editAsset.name, category_id: editAsset.category_id, brand: editAsset.brand,
        model: editAsset.model, serial_number: editAsset.serial_number, asset_tag: editAsset.asset_tag || '',
        purchase_date: editAsset.purchase_date, purchase_cost: editAsset.purchase_cost,
        supplier_id: editAsset.supplier_id || '', warranty_expiry: editAsset.warranty_expiry || '',
        location: editAsset.location, condition: editAsset.condition, status: editAsset.status,
        notes: editAsset.notes || '',
      } : { condition: 'excellent', status: 'available', purchase_cost: 0 });
    }
  }, [isOpen, editAsset, reset]);

  const onSubmit = (data: FormData) => {
    if (editAsset) {
      updateAsset(editAsset.id, data);
    } else {
      addAsset(data as any);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editAsset ? 'Edit Asset' : 'Add New Asset'}
      size="2xl"
      footer={
        <>
          <button type="button" className="btn-secondary btn-sm" onClick={onClose}>Cancel</button>
          <button type="submit" form="asset-form" className="btn-primary btn-sm">
            {editAsset ? 'Save Changes' : 'Add Asset'}
          </button>
        </>
      }
    >
      <form id="asset-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <label className="form-label">Purchase Date *</label>
            <input type="date" className="form-input" {...register('purchase_date')} />
            {errors.purchase_date && <p className="form-error">{errors.purchase_date.message}</p>}
          </div>
          <div>
            <label className="form-label">Purchase Cost (SAR)</label>
            <input type="number" className="form-input" {...register('purchase_cost')} />
          </div>
          <div>
            <label className="form-label">Supplier</label>
            <Controller control={control} name="supplier_id" render={({ field }) => <SearchSelect value={String(field.value || '')} onValueChange={field.onChange} placeholder="Select supplier" options={suppliers.map(s => ({ value: s.id, label: s.name, description: s.contact_person }))} />} />
          </div>
          <div>
            <label className="form-label">Warranty Expiry</label>
            <input type="date" className="form-input" {...register('warranty_expiry')} />
          </div>
          <div>
            <label className="form-label">Location *</label>
            <input className="form-input" {...register('location')} placeholder="e.g. IT Department" />
            {errors.location && <p className="form-error">{errors.location.message}</p>}
          </div>
          <div>
            <label className="form-label">Condition *</label>
            <Controller control={control} name="condition" render={({ field }) => <SearchSelect value={field.value} onValueChange={field.onChange} required options={[
              { value: 'excellent', label: 'Excellent' }, { value: 'good', label: 'Good' }, { value: 'fair', label: 'Fair' }, { value: 'poor', label: 'Poor' }, { value: 'damaged', label: 'Damaged' },
            ]} />} />
          </div>
          <div>
            <label className="form-label">Status</label>
            <Controller control={control} name="status" render={({ field }) => <SearchSelect value={field.value} onValueChange={field.onChange} required options={[
              { value: 'available', label: 'Available' }, { value: 'assigned', label: 'Assigned' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'damaged', label: 'Damaged' },
            ]} />} />
          </div>
        </div>
        <div>
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" rows={2} {...register('notes')} placeholder="Any additional notes..." />
        </div>
      </form>
    </Modal>
  );
}

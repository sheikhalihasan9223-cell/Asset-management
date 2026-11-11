import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, TrendingDown, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import SearchSelect from '../../components/ui/SearchSelect';

export default function InventoryItems() {
  const { inventory, categories, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const pageSize = 10;

  const filtered = useMemo(() => inventory.filter(item => {
    const q = search.toLowerCase();
    return (!q || item.name.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q))
      && (!categoryFilter || item.category_id === categoryFilter);
  }), [inventory, search, categoryFilter]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Inventory Items</h1>
          <p className="page-subtitle">{inventory.length} items in inventory</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary btn-sm flex items-center gap-1.5">
          <Plus size={14} /> Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: inventory.reduce((s, i) => s + (Number(i.total_quantity) || 0), 0), color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Available', value: inventory.reduce((s, i) => s + (Number(i.available_quantity) || 0), 0), color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Assigned', value: inventory.reduce((s, i) => s + (Number(i.assigned_quantity) || 0), 0), color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Low Stock', value: inventory.filter(i => Number(i.available_quantity) <= Number(i.min_stock_level)).length, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="form-input pl-9" placeholder="Search items..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <SearchSelect className="w-40" value={categoryFilter} placeholder="All Categories"
            onValueChange={value => { setCategoryFilter(value); setPage(1); }}
            options={categories.map(c => ({ value: c.id, label: c.name }))} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="table-th">Item Name</th>
                <th className="table-th">Category</th>
                <th className="table-th">Brand / Model</th>
                <th className="table-th text-center">Total</th>
                <th className="table-th text-center">Assigned</th>
                <th className="table-th text-center">Available</th>
                <th className="table-th text-center">Maintenance</th>
                <th className="table-th text-center">Damaged</th>
                <th className="table-th text-center">Min Stock</th>
                <th className="table-th text-center">Status</th>
                <th className="table-th text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr><td colSpan={11} className="table-td text-center py-12 text-gray-400">No items found</td></tr>
              ) : paged.map(item => {
                const isLow = item.available_quantity <= item.min_stock_level;
                return (
                  <tr key={item.id} className={`table-row ${isLow ? 'bg-orange-50/30' : ''}`}>
                    <td className="table-td font-medium text-gray-800">{item.name}</td>
                    <td className="table-td"><span className="badge-blue">{item.category?.name}</span></td>
                    <td className="table-td text-xs text-gray-500">{item.brand} · {item.model}</td>
                    <td className="table-td text-center font-semibold text-gray-800">{item.total_quantity}</td>
                    <td className="table-td text-center text-blue-600 font-medium">{item.assigned_quantity}</td>
                    <td className="table-td text-center text-blue-600 font-semibold">{item.available_quantity}</td>
                    <td className="table-td text-center text-orange-600">{item.under_maintenance}</td>
                    <td className="table-td text-center text-orange-600">{item.damaged_quantity}</td>
                    <td className="table-td text-center text-gray-500">{item.min_stock_level}</td>
                    <td className="table-td text-center">
                      {isLow ? (
                        <div className="flex items-center justify-center gap-1 text-orange-500 text-xs">
                          <AlertTriangle size={12} /> Low Stock
                        </div>
                      ) : (
                        <span className="badge-blue">OK</span>
                      )}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setEditItem(item)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteId(item.id)}
                          className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={Math.max(1, Math.ceil(filtered.length / pageSize))}
          totalItems={filtered.length} pageSize={pageSize} onPageChange={setPage} />
      </div>

      {/* Add/Edit Modal */}
      <InventoryFormModal
        isOpen={addOpen || !!editItem}
        onClose={() => { setAddOpen(false); setEditItem(null); }}
        editItem={editItem}
        onAdd={addInventoryItem}
        onUpdate={updateInventoryItem}
        categories={categories}
      />

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Item" size="sm"
        footer={
          <>
            <button className="btn-secondary btn-sm" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn-danger btn-sm" onClick={() => { deleteInventoryItem(deleteId!); setDeleteId(null); }}>Delete</button>
          </>
        }
      >
        <p className="text-sm text-gray-600">Are you sure you want to delete this inventory item?</p>
      </Modal>
    </div>
  );
}

function InventoryFormModal({ isOpen, onClose, editItem, onAdd, onUpdate, categories }: any) {
  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: editItem || { total_quantity: 0, assigned_quantity: 0, available_quantity: 0, under_maintenance: 0, damaged_quantity: 0, min_stock_level: 10 },
  });

  React.useEffect(() => {
    reset(editItem || { total_quantity: 0, assigned_quantity: 0, available_quantity: 0, under_maintenance: 0, damaged_quantity: 0, min_stock_level: 10 });
  }, [isOpen, editItem, reset]);

  const totalQuantity = watch('total_quantity');
  React.useEffect(() => {
    if (!editItem) setValue('available_quantity', Math.max(Number(totalQuantity) || 0, 0));
  }, [editItem, totalQuantity, setValue]);

  const onSubmit = (data: any) => {
    if (editItem) onUpdate(editItem.id, { ...data, category: categories.find((c: any) => c.id === data.category_id) });
    else onAdd({ ...data, category: categories.find((c: any) => c.id === data.category_id) });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editItem ? 'Edit Inventory Item' : 'Add Inventory Item'} size="lg"
      footer={
        <>
          <button className="btn-secondary btn-sm" onClick={onClose}>Cancel</button>
          <button type="submit" form="inv-form" className="btn-primary btn-sm">Save</button>
        </>
      }
    >
      <form id="inv-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="form-label">Item Name *</label>
            <input className="form-input" {...register('name', { required: true })} />
          </div>
          <div>
            <label className="form-label">Category *</label>
            <Controller control={control} name="category_id" rules={{ required: true }} render={({ field }) => <SearchSelect value={String(field.value || '')} onValueChange={field.onChange} placeholder="Select category" required options={categories.map((c: any) => ({ value: c.id, label: c.name }))} />} />
          </div>
          <div>
            <label className="form-label">Brand</label>
            <input className="form-input" {...register('brand')} />
          </div>
          <div>
            <label className="form-label">Model</label>
            <input className="form-input" {...register('model')} />
          </div>
          <div>
            <label className="form-label">Total Quantity</label>
            <input type="number" className="form-input" {...register('total_quantity')} />
          </div>
          <div>
            <label className="form-label">Available Quantity</label>
            <input type="number" className="form-input" {...register('available_quantity')} />
          </div>
          <div>
            <label className="form-label">Minimum Stock Level</label>
            <input type="number" className="form-input" {...register('min_stock_level')} />
          </div>
        </div>
      </form>
    </Modal>
  );
}

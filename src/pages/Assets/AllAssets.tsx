import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit2, Trash2, ChevronUp, ChevronDown, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { formatDate, formatCurrency, getInitials, avatarColor, exportToCSV } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { Asset } from '../../types';
import AssetFormModal from './AssetFormModal';
import AssetDetailModal from './AssetDetailModal';
import SearchSelect from '../../components/ui/SearchSelect';

type SortKey = keyof Asset;
type SortDir = 'asc' | 'desc';

export default function AllAssets() {
  const { assets, deleteAsset, categories, globalSearch } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState(globalSearch);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>('asset_id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [addOpen, setAddOpen] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [viewAsset, setViewAsset] = useState<Asset | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return assets
      .filter(a => a.status !== 'retired')
      .filter(a => {
        const q = search.toLowerCase();
        return !q || a.name.toLowerCase().includes(q) || a.asset_id.toLowerCase().includes(q) ||
          a.serial_number.toLowerCase().includes(q) || a.brand.toLowerCase().includes(q);
      })
      .filter(a => !categoryFilter || a.category_id === categoryFilter)
      .filter(a => !statusFilter || a.status === statusFilter)
      .sort((a, b) => {
        const av = String(a[sortKey] || '');
        const bv = String(b[sortKey] || '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
  }, [assets, search, categoryFilter, statusFilter, sortKey, sortDir]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const sort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp size={10} className={sortKey === k && sortDir === 'asc' ? 'text-primary-600' : 'text-gray-300'} />
      <ChevronDown size={10} className={sortKey === k && sortDir === 'desc' ? 'text-primary-600' : 'text-gray-300'} />
    </span>
  );

  const handleExport = () => {
    exportToCSV(filtered.map(a => ({
      'Asset ID': a.asset_id,
      'Name': a.name,
      'Category': a.category?.name || '',
      'Brand': a.brand,
      'Model': a.model,
      'Serial Number': a.serial_number,
      'Purchase Date': a.purchase_date,
      'Purchase Cost': a.purchase_cost,
      'Location': a.location,
      'Status': a.status,
    })), 'assets_export');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">All Assets</h1>
          <p className="page-subtitle">{assets.filter(a => a.status !== 'retired').length} total assets in system</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary btn-sm flex items-center gap-1.5">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => navigate('/assets/add')} className="btn-primary btn-sm flex items-center gap-1.5">
            <Plus size={14} /> Add Asset
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="form-input pl-9"
              placeholder="Search by name, ID, serial number..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <SearchSelect className="w-40" value={categoryFilter} placeholder="All Categories"
            onValueChange={value => { setCategoryFilter(value); setPage(1); }}
            options={categories.map(c => ({ value: c.id, label: c.name }))} />
          <SearchSelect className="w-40" value={statusFilter} placeholder="All Statuses"
            onValueChange={value => { setStatusFilter(value); setPage(1); }}
            options={[{ value: 'available', label: 'Available' }, { value: 'assigned', label: 'Assigned' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'damaged', label: 'Damaged' }]} />
          {(search || categoryFilter || statusFilter) && (
            <button
              onClick={() => { setSearch(''); setCategoryFilter(''); setStatusFilter(''); setPage(1); }}
              className="btn-ghost btn-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="table-th cursor-pointer select-none" onClick={() => sort('asset_id')}>
                  Asset ID <SortIcon k="asset_id" />
                </th>
                <th className="table-th cursor-pointer select-none" onClick={() => sort('name')}>
                  Asset Name <SortIcon k="name" />
                </th>
                <th className="table-th">Category</th>
                <th className="table-th cursor-pointer select-none" onClick={() => sort('brand')}>
                  Brand <SortIcon k="brand" />
                </th>
                <th className="table-th">Model</th>
                <th className="table-th">Serial Number</th>
                <th className="table-th cursor-pointer select-none" onClick={() => sort('purchase_date')}>
                  Purchase Date <SortIcon k="purchase_date" />
                </th>
                <th className="table-th">Cost</th>
                <th className="table-th">Location</th>
                <th className="table-th cursor-pointer select-none" onClick={() => sort('status')}>
                  Status <SortIcon k="status" />
                </th>
                <th className="table-th text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={11} className="table-td text-center py-12 text-gray-400">
                    No assets found
                  </td>
                </tr>
              ) : paged.map(a => (
                <tr key={a.id} className="table-row">
                  <td className="table-td font-mono text-xs text-primary-600 font-semibold">{a.asset_id}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-gray-500">{a.brand.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="font-medium text-gray-800">{a.name}</span>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="badge-blue">{a.category?.name}</span>
                  </td>
                  <td className="table-td text-gray-600">{a.brand}</td>
                  <td className="table-td text-gray-500 text-xs">{a.model}</td>
                  <td className="table-td font-mono text-xs text-gray-600">{a.serial_number}</td>
                  <td className="table-td text-gray-500">{formatDate(a.purchase_date)}</td>
                  <td className="table-td font-medium text-gray-700">{formatCurrency(a.purchase_cost)}</td>
                  <td className="table-td text-gray-500 text-xs">{a.location}</td>
                  <td className="table-td"><StatusBadge status={a.status} /></td>
                  <td className="table-td">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setViewAsset(a)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => setEditAsset(a)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(a.id)}
                        className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={Math.max(1, Math.ceil(filtered.length / pageSize))}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>

      {/* Add/Edit Modal */}
      <AssetFormModal
        isOpen={addOpen || !!editAsset}
        onClose={() => { setAddOpen(false); setEditAsset(null); }}
        editAsset={editAsset}
      />

      {/* View Detail Modal */}
      {viewAsset && (
        <AssetDetailModal asset={viewAsset} onClose={() => setViewAsset(null)} />
      )}

      {/* Delete Confirm */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Retire Asset"
        size="sm"
        footer={
          <>
            <button className="btn-secondary btn-sm" onClick={() => setDeleteId(null)}>Cancel</button>
            <button
              className="btn-danger btn-sm"
              onClick={() => { deleteAsset(deleteId!); setDeleteId(null); }}
            >
              Confirm Retire
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to retire this asset? Its historical records will be preserved.
        </p>
      </Modal>
    </div>
  );
}

import React from 'react';
import Modal from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/Badge';
import { Asset } from '../../types';
import { formatDate, formatCurrency } from '../../lib/utils';
import { Package, Calendar, DollarSign, MapPin, Tag, Hash, Building, Shield } from 'lucide-react';

interface Props {
  asset: Asset;
  onClose: () => void;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium text-gray-800 mt-0.5">{value || '—'}</div>
      </div>
    </div>
  );
}

export default function AssetDetailModal({ asset, onClose }: Props) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Asset Details" size="lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center">
            <Package size={28} className="text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{asset.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-mono text-sm text-primary-600 font-semibold">{asset.asset_id}</span>
              <StatusBadge status={asset.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div>
            <InfoRow icon={<Tag size={15} />} label="Asset Tag" value={asset.asset_tag || '—'} />
            <InfoRow icon={<Package size={15} />} label="Category" value={asset.category?.name || '—'} />
            <InfoRow icon={<Building size={15} />} label="Brand" value={asset.brand} />
            <InfoRow icon={<Hash size={15} />} label="Model" value={asset.model} />
            <InfoRow icon={<Hash size={15} />} label="Serial Number" value={asset.serial_number} />
          </div>
          <div>
            <InfoRow icon={<Calendar size={15} />} label="Purchase Date" value={formatDate(asset.purchase_date)} />
            <InfoRow icon={<DollarSign size={15} />} label="Purchase Cost" value={formatCurrency(asset.purchase_cost)} />
            <InfoRow icon={<Shield size={15} />} label="Warranty Expiry" value={asset.warranty_expiry ? formatDate(asset.warranty_expiry) : '—'} />
            <InfoRow icon={<MapPin size={15} />} label="Location" value={asset.location} />
            <InfoRow icon={<Package size={15} />} label="Condition" value={asset.condition} />
          </div>
        </div>

        {asset.notes && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Notes</div>
            <div className="text-sm text-gray-700">{asset.notes}</div>
          </div>
        )}

        {asset.supplier && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-primary-600 font-semibold mb-1">Supplier Information</div>
            <div className="text-sm text-gray-700">{asset.supplier.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">{asset.supplier.email} · {asset.supplier.phone}</div>
          </div>
        )}
      </div>
    </Modal>
  );
}

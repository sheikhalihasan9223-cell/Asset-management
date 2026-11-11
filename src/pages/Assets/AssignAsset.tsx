import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, User, Printer } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getInitials, avatarColor } from '../../lib/utils';
import SearchSelect from '../../components/ui/SearchSelect';
import MultiSearchSelect from '../../components/ui/MultiSearchSelect';
import CustodyPaperPreview from '../../components/assets/CustodyPaperPreview';

export default function AssignAsset() {
  const { employees, assets, inventory, assignAsset } = useApp();
  const navigate = useNavigate();

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [assignmentDate, setAssignmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedReturn, setExpectedReturn] = useState('');
  const [condition, setCondition] = useState('good');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const employee = employees.find(e => e.id === selectedEmployee);
  const availableAssets = assets.filter(a => a.status === 'available');
  const serializedAssetsByInventoryId = useMemo(() => {
    const normalize = (value: string | undefined) => (value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const reservedAssetIds = new Set(selectedAssets.filter(Boolean));
    const matched: Record<string, string> = {};

    for (const inventoryId of selectedAccessories) {
      const item = inventory.find(entry => entry.id === inventoryId);
      if (!item) continue;
      const itemName = normalize(item.name);
      const itemBrand = normalize(item.brand);
      const itemModel = normalize(item.model);
      const modelIsGenericOrSerial = !itemModel || itemModel === 'various' || /^(sn|serial)/i.test(item.model ?? '');
      const candidates = availableAssets
        .filter(asset => asset.category_id === item.category_id && !reservedAssetIds.has(asset.id))
        .map(asset => {
          const name = normalize(asset.name);
          const brand = normalize(asset.brand);
          const model = normalize(asset.model);
          const serial = normalize(asset.serial_number);
          const exactModel = itemModel && (model === itemModel || model.includes(itemModel) || itemModel.includes(model));
          const exactSerial = itemModel && serial === itemModel;
          const nameMatch = itemName.length >= 5 && (name.includes(itemName) || itemName.includes(name));
          const brandMatch = !itemBrand || itemBrand === 'various' || brand === itemBrand;
          if (exactSerial) return { asset, score: 4 };
          if (exactModel && brandMatch) return { asset, score: 3 };
          if (nameMatch && brandMatch) return { asset, score: 2 };
          if (modelIsGenericOrSerial && brandMatch) return { asset, score: 1 };
          return null;
        })
        .filter((candidate): candidate is { asset: typeof availableAssets[number]; score: number } => candidate !== null)
        .sort((a, b) => b.score - a.score);

      const asset = candidates[0]?.asset;
      if (asset) {
        matched[inventoryId] = asset.id;
        reservedAssetIds.add(asset.id);
      }
    }
    return matched;
  }, [assets, inventory, selectedAccessories, selectedAssets]);
  const automaticAssetIds = Object.values(serializedAssetsByInventoryId);
  const allAssignedAssetIds = [...automaticAssetIds, ...selectedAssets.filter(Boolean)];
  const accessoryItems = inventory.filter(item => item.available_quantity > 0);
  const accessoryOptions = accessoryItems.map(item => ({
    value: item.id,
    label: item.name,
    description: `${item.category?.name ?? 'Inventory'} - ${item.available_quantity} available`,
  }));

  const addAssetSlot = () => {
    setSelectedAssets(prev => [...prev, '']);
  };

  const updateAsset = (index: number, id: string) => {
    setSelectedAssets(prev => prev.map((a, i) => i === index ? id : a));
  };

  const removeAsset = (index: number) => {
    setSelectedAssets(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || allAssignedAssetIds.length === 0) return;
    const serializedInventoryIdsByAsset = Object.fromEntries(
      Object.entries(serializedAssetsByInventoryId).map(([inventoryId, assetId]) => [assetId, inventoryId]),
    );
    const assigned = assignAsset({
      employee_id: selectedEmployee,
      asset_ids: allAssignedAssetIds,
      assignment_date: assignmentDate,
      expected_return_date: expectedReturn || undefined,
      condition,
      accessories: inventory.filter(item => selectedAccessories.includes(item.id)).map(item => item.name).join(', '),
      accessory_inventory_ids: selectedAccessories.filter(id => !serializedAssetsByInventoryId[id]),
      serialized_inventory_ids_by_asset: serializedInventoryIdsByAsset,
      remarks,
    });
    if (!assigned) return;
    setSubmitted(true);
    setTimeout(() => navigate('/assets'), 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <Save size={28} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Assignment Successful!</h2>
        <p className="text-gray-500">Assets have been assigned successfully. Redirecting...</p>
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
          <h1 className="page-title">Assign Asset</h1>
          <p className="page-subtitle">Assign equipment to an employee</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Employee Section */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100 flex items-center gap-2">
              <User size={16} className="text-primary-600" /> Employee Information
            </h3>
            <div>
              <label className="form-label">Select Employee *</label>
              <SearchSelect
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
                placeholder="Choose employee..."
                required
                options={employees.filter(e => e.status === 'active').map(e => ({
                  value: e.id,
                  label: e.full_name,
                  description: [e.employee_id, e.department?.name].filter(Boolean).join(' · '),
                }))}
              />
            </div>

            {employee && (
              <div className="bg-primary-50 rounded-xl p-4 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full ${avatarColor(employee.full_name)} flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}>
                  {getInitials(employee.full_name)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{employee.full_name}</div>
                  <div className="text-sm text-gray-600">{employee.designation}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{[employee.department?.name, employee.employee_id].filter(Boolean).join(' · ')}</div>
                  <div className="text-xs text-gray-500">{employee.email}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Assignment Date *</label>
                <input type="date" className="form-input" value={assignmentDate}
                  onChange={e => setAssignmentDate(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Expected Return Date</label>
                <input type="date" className="form-input" value={expectedReturn}
                  onChange={e => setExpectedReturn(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="form-label">Equipment Condition at Assignment</label>
              <SearchSelect value={condition} onValueChange={setCondition} options={[
                { value: 'excellent', label: 'Excellent' }, { value: 'good', label: 'Good' },
                { value: 'fair', label: 'Fair' }, { value: 'poor', label: 'Poor' },
              ]} />
            </div>

            <div>
              <label className="form-label">Inventory Equipment Provided</label>
              <MultiSearchSelect
                values={selectedAccessories}
                onValuesChange={setSelectedAccessories}
                placeholder="Select inventory equipment..."
                options={accessoryOptions}
              />
              {selectedAccessories.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {selectedAccessories.map(id => {
                    const item = inventory.find(entry => entry.id === id);
                    const asset = assets.find(entry => entry.id === serializedAssetsByInventoryId[id]);
                    if (!item) return null;
                    return (
                      <p key={id} className={`text-xs ${asset ? 'text-orange-700' : 'text-gray-500'}`}>
                        {item.name}: {asset
                          ? `serial ${asset.serial_number} will be assigned automatically`
                          : 'no unused serialized asset matched; this will be issued as stock equipment'}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Remarks</label>
              <textarea className="form-textarea" rows={2} value={remarks}
                onChange={e => setRemarks(e.target.value)} placeholder="Any additional remarks..." />
            </div>
          </div>

          {/* Live custody form preview replaces the old empty asset panel. */}
          <div className="space-y-3 min-w-0">
            <div className="flex justify-end custody-no-print">
              <button type="button" className="btn-secondary btn-sm flex items-center gap-2" onClick={() => window.print()} disabled={!employee || allAssignedAssetIds.length === 0}>
                <Printer size={14} /> Print Custody Form
              </button>
            </div>
            <CustodyPaperPreview
              employee={employee}
              inventory={inventory}
              selectedInventoryIds={selectedAccessories}
              serializedAssetsByInventoryId={serializedAssetsByInventoryId}
              assets={assets}
              manualAssetIds={selectedAssets}
              condition={condition}
            />
            <details className="card p-4 custody-no-print">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">Add another serialized asset manually</summary>
              <div className="mt-4 space-y-3">
                <button type="button" onClick={addAssetSlot} className="btn-primary btn-sm flex items-center gap-1">
                  <Plus size={13} /> Add Asset
                </button>
                {selectedAssets.map((assetId, idx) => {
                  const asset = assets.find(entry => entry.id === assetId);
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <SearchSelect
                          value={assetId}
                          onValueChange={value => updateAsset(idx, value)}
                          placeholder="Select asset..."
                          options={availableAssets
                            .filter(entry => (!selectedAssets.includes(entry.id) || entry.id === assetId) && !automaticAssetIds.includes(entry.id))
                            .map(entry => ({ value: entry.id, label: entry.name, description: entry.asset_id + ' - SN: ' + entry.serial_number }))}
                        />
                        {asset && <p className="mt-1 text-xs text-gray-500">{asset.brand} {asset.model} - Serial {asset.serial_number}</p>}
                      </div>
                      <button type="button" onClick={() => removeAsset(idx)} className="rounded-lg p-2 text-orange-500 hover:bg-orange-50" aria-label="Remove asset">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </details>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={() => navigate('/assets')}>Cancel</button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={!selectedEmployee || allAssignedAssetIds.length === 0}
          >
            <Save size={16} /> Confirm Assignment
          </button>
        </div>
      </form>

    </div>
  );
}

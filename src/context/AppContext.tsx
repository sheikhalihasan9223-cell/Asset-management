import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ActivityLog, Asset, AssetAssignment, AssetReturn, Employee, InventoryItem, MaintenanceRecord } from '../types';
import {
  activityLogs as initLogs,
  categories,
  departments,
  suppliers,
} from '../data/sampleData';
import { importedEmployeeRows } from '../data/importedEmployees';
import { generateAssetId, generateEmployeeId } from '../lib/utils';
import toast from 'react-hot-toast';

interface AppContextType {
  // Data
  assets: Asset[];
  employees: Employee[];
  assignments: AssetAssignment[];
  inventory: InventoryItem[];
  maintenance: MaintenanceRecord[];
  returns: AssetReturn[];
  activityLogs: ActivityLog[];
  categories: typeof categories;
  departments: typeof departments;
  suppliers: typeof suppliers;

  // Asset actions
  addAsset: (asset: Omit<Asset, 'id' | 'asset_id' | 'created_at' | 'updated_at'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;

  // Employee actions
  addEmployee: (emp: Omit<Employee, 'id' | 'created_at' | 'total_assets'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Assignment actions
  assignAsset: (data: {
    employee_id: string;
    asset_ids: string[];
    assignment_date: string;
    expected_return_date?: string;
    condition: string;
    accessories?: string;
    accessory_inventory_ids?: string[];
    serialized_inventory_ids_by_asset?: Record<string, string>;
    remarks?: string;
    signature?: string;
  }) => boolean;

  // Return actions
  returnAsset: (data: {
    assignment_id: string;
    asset_id: string;
    employee_id: string;
    return_date: string;
    returned_condition: 'available' | 'maintenance' | 'damaged';
    accessories_returned?: string;
    inspection_notes?: string;
  }) => boolean;

  // Inventory actions
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  // Maintenance actions
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id' | 'created_at'>) => void;
  updateMaintenanceRecord: (id: string, updates: Partial<MaintenanceRecord>) => void;

  // Search
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const cleanWorkspaceMarker = 'gs1_workspace_clean_v1';
const employeeImportMarker = 'gs1_employee_import_book1_v1';
const workspaceDataKeys = ['assets', 'employees', 'assignments', 'inventory', 'maintenance', 'returns', 'activity'];

const importedEmployees: Employee[] = importedEmployeeRows.map((row, index) => {
  const department = departments.find(entry => entry.name === row.department) ?? departments.find(entry => entry.name === 'Unassigned')!;
  return {
    id: `import-${String(index + 1).padStart(3, '0')}`,
    employee_id: `GS1-${String(index + 1).padStart(3, '0')}`,
    full_name: row.full_name,
    email: row.email,
    phone: '',
    department_id: department.id,
    department,
    designation: '',
    status: 'active',
    join_date: '',
    total_assets: 0,
    created_at: new Date().toISOString(),
  };
});

function ensureCleanWorkspace() {
  if (localStorage.getItem(cleanWorkspaceMarker) === 'done') return;
  workspaceDataKeys.forEach(key => localStorage.removeItem(`gs1_${key}`));
  localStorage.setItem(cleanWorkspaceMarker, 'done');
}

function ensureEmployeeImport() {
  if (localStorage.getItem(employeeImportMarker) === 'done') return;
  let current: Employee[] = [];
  try {
    const saved = localStorage.getItem('gs1_employees');
    if (saved) current = JSON.parse(saved) as Employee[];
  } catch { /* replace an unreadable employee cache with the spreadsheet list */ }

  const emails = new Set(current.map(employee => employee.email.trim().toLowerCase()));
  const ids = new Set(current.map(employee => employee.employee_id).filter((id): id is string => Boolean(id)));
  const merged = [...current];
  for (const employee of importedEmployees) {
    if (emails.has(employee.email.trim().toLowerCase())) continue;
    const importedId = employee.employee_id || generateEmployeeId([...ids]);
    const employeeId = ids.has(importedId)
      ? generateEmployeeId([...ids])
      : importedId;
    merged.push({ ...employee, employee_id: employeeId });
    emails.add(employee.email.trim().toLowerCase());
    ids.add(employeeId);
  }
  localStorage.setItem('gs1_employees', JSON.stringify(merged));
  localStorage.setItem(employeeImportMarker, 'done');
}

function normalizeInventoryItem(item: InventoryItem): InventoryItem {
  const total_quantity = Math.max(Number(item.total_quantity) || 0, 0);
  const assigned_quantity = Math.max(Number(item.assigned_quantity) || 0, 0);
  const under_maintenance = Math.max(Number(item.under_maintenance) || 0, 0);
  const damaged_quantity = Math.max(Number(item.damaged_quantity) || 0, 0);
  return {
    ...item,
    total_quantity,
    assigned_quantity,
    under_maintenance,
    damaged_quantity,
    min_stock_level: Math.max(Number(item.min_stock_level) || 0, 0),
    available_quantity: Math.max(total_quantity - assigned_quantity - under_maintenance - damaged_quantity, 0),
  };
}

function normalizeInventory(items: InventoryItem[]): InventoryItem[] {
  return items.map(normalizeInventoryItem);
}

function findInventoryMatchForAsset(asset: Asset, items: InventoryItem[]): InventoryItem | undefined {
  const normalize = (value: string | undefined) => (value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const assetName = normalize(asset.name);
  const assetBrand = normalize(asset.brand);
  const assetModel = normalize(asset.model);
  return items
    .filter(item => item.category_id === asset.category_id)
    .map(item => {
      const itemName = normalize(item.name);
      const itemBrand = normalize(item.brand);
      const itemModel = normalize(item.model);
      const brandMatches = !itemBrand || itemBrand === 'various' || itemBrand === assetBrand;
      if (!brandMatches) return { item, score: 0 };
      const nameMatches = itemName === assetName || itemName.includes(assetName) || assetName.includes(itemName);
      const modelsMatch = itemModel && assetModel &&
        (itemModel === assetModel || itemModel.includes(assetModel) || assetModel.includes(itemModel));
      if (nameMatches && itemName.length >= 4) return { item, score: 8 };
      if (modelsMatch) return { item, score: itemModel === assetModel ? 7 : 6 };
      if (itemModel === 'various' || !itemModel) return { item, score: 2 };
      return { item, score: 0 };
    })
    .filter(candidate => candidate.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.item;
}

function useSavedState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const storageKey = `gs1_${key}`;
  const [value, setValue] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined') ensureCleanWorkspace();
      if (typeof window !== 'undefined') ensureEmployeeImport();
      const saved = localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) as T : initial;
      return key === 'inventory' && Array.isArray(parsed) ? normalizeInventory(parsed as InventoryItem[]) as T : parsed;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch { /* storage may be unavailable */ }
  }, [storageKey, value]);
  useEffect(() => {
    const syncFromOtherTab = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      try {
        const parsed = event.newValue ? JSON.parse(event.newValue) as T : initial;
        setValue(key === 'inventory' && Array.isArray(parsed) ? normalizeInventory(parsed as InventoryItem[]) as T : parsed);
      }
      catch { /* ignore malformed storage written by another tab */ }
    };
    window.addEventListener('storage', syncFromOtherTab);
    return () => window.removeEventListener('storage', syncFromOtherTab);
  }, [storageKey, initial]);
  return [value, setValue];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useSavedState<Asset[]>('assets', []);
  const [employees, setEmployees] = useSavedState<Employee[]>('employees', importedEmployees);
  const [assignments, setAssignments] = useSavedState<AssetAssignment[]>('assignments', []);
  const [inventory, setInventory] = useSavedState<InventoryItem[]>('inventory', []);
  const [maintenance, setMaintenance] = useSavedState<MaintenanceRecord[]>('maintenance', []);
  const [returns, setReturns] = useSavedState<AssetReturn[]>('returns', []);
  const [logs, setLogs] = useSavedState<ActivityLog[]>('activity', []);
  const [globalSearch, setGlobalSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const addLog = useCallback((description: string, action: string, entityType: string, entityId: string) => {
    setLogs(prev => [{
      id: `act${Date.now()}`,
      action,
      entity_type: entityType,
      entity_id: entityId,
      description,
      performed_by: 'Admin',
      created_at: new Date().toISOString(),
    }, ...prev]);
  }, []);

  const addAsset = useCallback((asset: Omit<Asset, 'id' | 'asset_id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newId = generateAssetId(assets.map(existing => existing.asset_id));
    const newAsset: Asset = {
      ...asset,
      id: `a${Date.now()}`,
      asset_id: newId,
      category: categories.find(category => category.id === asset.category_id),
      supplier: suppliers.find(supplier => supplier.id === asset.supplier_id),
      created_at: now,
      updated_at: now,
    };
    setAssets(prev => [newAsset, ...prev]);

    const quantityChange = {
      total_quantity: 1,
      assigned_quantity: asset.status === 'assigned' ? 1 : 0,
      available_quantity: asset.status === 'available' ? 1 : 0,
      under_maintenance: asset.status === 'maintenance' ? 1 : 0,
      damaged_quantity: asset.status === 'damaged' ? 1 : 0,
    };
    setInventory(prev => {
      const match = findInventoryMatchForAsset(newAsset, prev);
      if (match) {
        return prev.map(item => item.id === match.id
          ? normalizeInventoryItem({
            ...item,
            total_quantity: item.total_quantity + quantityChange.total_quantity,
            assigned_quantity: item.assigned_quantity + quantityChange.assigned_quantity,
            available_quantity: item.available_quantity + quantityChange.available_quantity,
            under_maintenance: item.under_maintenance + quantityChange.under_maintenance,
            damaged_quantity: item.damaged_quantity + quantityChange.damaged_quantity,
            updated_at: now,
          })
          : item);
      }
      const newItem: InventoryItem = {
        id: `inv${Date.now()}-${newAsset.id}`,
        name: newAsset.name,
        category_id: newAsset.category_id,
        category: newAsset.category,
        brand: newAsset.brand,
        model: newAsset.model,
        total_quantity: quantityChange.total_quantity,
        assigned_quantity: quantityChange.assigned_quantity,
        available_quantity: quantityChange.available_quantity,
        under_maintenance: quantityChange.under_maintenance,
        damaged_quantity: quantityChange.damaged_quantity,
        min_stock_level: 0,
        created_at: now,
        updated_at: now,
      };
      return [newItem, ...prev];
    });

    addLog(`${newAsset.name} (${newId}) added to assets and inventory`, 'ADD', 'asset', newAsset.id);
    toast.success(`Asset ${newId} added and inventory stock updated`);
  }, [assets, addLog]);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a));
    toast.success('Asset updated successfully');
  }, []);

  const deleteAsset = useCallback((id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status: 'retired' } : a));
    addLog('Asset retired from system', 'DELETE', 'asset', id);
    toast.success('Asset retired successfully');
  }, [addLog]);

  const addEmployee = useCallback((emp: Omit<Employee, 'id' | 'created_at' | 'total_assets'>) => {
    setEmployees(prev => {
      const empId = emp.employee_id?.trim() || undefined;
      const dept = departments.find(d => d.id === emp.department_id);
      const newEmp: Employee = {
        ...emp,
        id: `e${Date.now()}`,
        employee_id: empId,
        department: dept,
        total_assets: 0,
        created_at: new Date().toISOString(),
      };
      addLog(`New employee ${newEmp.full_name}${empId ? ` (${empId})` : ''} added`, 'ADD', 'employee', newEmp.id);
      toast.success('Employee added successfully');
      return [newEmp, ...prev];
    });
  }, [addLog]);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => {
      if (e.id !== id) return e;
      const dept = updates.department_id ? departments.find(d => d.id === updates.department_id) : e.department;
      return { ...e, ...updates, department: dept };
    }));
    toast.success('Employee updated successfully');
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: 'inactive' as const } : e));
    toast.success('Employee deactivated successfully');
  }, []);

  const assignAsset = useCallback((data: {
    employee_id: string;
    asset_ids: string[];
    assignment_date: string;
    expected_return_date?: string;
    condition: string;
    accessories?: string;
    accessory_inventory_ids?: string[];
    serialized_inventory_ids_by_asset?: Record<string, string>;
    remarks?: string;
    signature?: string;
  }) => {
    const employee = employees.find(e => e.id === data.employee_id);
    const targetAssets = [...new Set(data.asset_ids)];
    if (!employee || targetAssets.length === 0) return false;
    const accessoryIds = [...new Set(data.accessory_inventory_ids ?? [])];
    const serializedInventoryIds = data.serialized_inventory_ids_by_asset ?? {};
    const inventoryReservations = new Map<string, number>();
    accessoryIds.forEach(id => inventoryReservations.set(id, targetAssets.length));
    targetAssets.forEach(assetId => {
      const inventoryId = serializedInventoryIds[assetId];
      if (inventoryId) inventoryReservations.set(inventoryId, (inventoryReservations.get(inventoryId) ?? 0) + 1);
    });
    const unavailableAccessory = inventory.find(item =>
      inventoryReservations.has(item.id) && item.available_quantity < (inventoryReservations.get(item.id) ?? 0)
    );
    if (unavailableAccessory) {
      toast.error(`Not enough ${unavailableAccessory.name} in stock for this assignment`);
      return false;
    }
    if (targetAssets.some(id => !assets.some(asset => asset.id === id && asset.status === 'available'))) {
      toast.error('One or more selected assets are no longer available');
      return false;
    }

    const newAssignments: AssetAssignment[] = targetAssets.map(assetId => {
      const asset = assets.find(a => a.id === assetId);
      return {
        id: `asgn${Date.now()}_${assetId}`,
        asset_id: assetId,
        asset,
        employee_id: data.employee_id,
        employee,
        assigned_by: 'admin',
        assignment_date: data.assignment_date,
        expected_return_date: data.expected_return_date,
        condition_at_assignment: data.condition,
        accessories: data.accessories,
        accessory_inventory_ids: [...new Set([
          ...accessoryIds,
          ...(serializedInventoryIds[assetId] ? [serializedInventoryIds[assetId]] : []),
        ])],
        remarks: data.remarks,
        signature: data.signature,
        status: 'active',
        created_at: new Date().toISOString(),
      };
    });

    setAssignments(prev => [...newAssignments, ...prev]);

    // Update asset statuses
    setAssets(prev => prev.map(a =>
      targetAssets.includes(a.id) ? { ...a, status: 'assigned', updated_at: new Date().toISOString() } : a
    ));

    // Reserve one of each selected inventory item for every asset in this assignment.
    if (inventoryReservations.size) {
      setInventory(prev => prev.map(item => inventoryReservations.has(item.id) ? {
        ...item,
        available_quantity: item.available_quantity - (inventoryReservations.get(item.id) ?? 0),
        assigned_quantity: item.assigned_quantity + (inventoryReservations.get(item.id) ?? 0),
        updated_at: new Date().toISOString(),
      } : item));
    }

    // Update employee asset count
    setEmployees(prev => prev.map(e =>
      e.id === data.employee_id ? { ...e, total_assets: (e.total_assets || 0) + targetAssets.length } : e
    ));

    addLog(`${targetAssets.length} asset(s) assigned to ${employee.full_name}`, 'ASSIGN', 'asset', targetAssets[0]);
    toast.success(`${targetAssets.length} asset(s) assigned to ${employee.full_name}`);
    return true;
  }, [employees, assets, inventory, addLog]);

  const returnAsset = useCallback((data: {
    assignment_id: string;
    asset_id: string;
    employee_id: string;
    return_date: string;
    returned_condition: 'available' | 'maintenance' | 'damaged';
    accessories_returned?: string;
    inspection_notes?: string;
  }) => {
    const employee = employees.find(e => e.id === data.employee_id);
    const asset = assets.find(a => a.id === data.asset_id);
    const currentAssignment = assignments.find(a => a.id === data.assignment_id);
    if (
      !currentAssignment || currentAssignment.status !== 'active' ||
      currentAssignment.asset_id !== data.asset_id || currentAssignment.employee_id !== data.employee_id
    ) {
      toast.error('This assignment has already been returned');
      return false;
    }

    // Create return record
    const returnRecord: AssetReturn = {
      id: `r${Date.now()}`,
      assignment_id: data.assignment_id,
      asset_id: data.asset_id,
      asset,
      employee_id: data.employee_id,
      employee,
      processed_by: 'Admin',
      return_date: data.return_date,
      returned_condition: data.returned_condition,
      accessories_returned: data.accessories_returned,
      inspection_notes: data.inspection_notes,
      created_at: new Date().toISOString(),
    };
    setReturns(prev => [returnRecord, ...prev]);

    // Update assignment status
    setAssignments(prev => prev.map(a =>
      a.id === data.assignment_id
        ? { ...a, status: 'returned', actual_return_date: data.return_date, condition_at_return: data.returned_condition }
        : a
    ));

    // Return accessories issued with this asset to available inventory.
    if (currentAssignment.accessory_inventory_ids?.length) {
      setInventory(prev => prev.map(item => currentAssignment.accessory_inventory_ids!.includes(item.id) ? {
        ...item,
        available_quantity: item.available_quantity + 1,
        assigned_quantity: Math.max(item.assigned_quantity - 1, 0),
        updated_at: new Date().toISOString(),
      } : item));
    }

    // Update asset status based on condition
    setAssets(prev => prev.map(a =>
      a.id === data.asset_id ? { ...a, status: data.returned_condition, updated_at: new Date().toISOString() } : a
    ));

    // Update employee asset count
    setEmployees(prev => prev.map(e =>
      e.id === data.employee_id ? { ...e, total_assets: Math.max((e.total_assets || 1) - 1, 0) } : e
    ));

    addLog(`Asset returned by ${employee?.full_name || 'Unknown'}`, 'RETURN', 'asset', data.asset_id);
    toast.success('Asset returned successfully');
    return true;
  }, [employees, assets, assignments, addLog]);

  const addInventoryItem = useCallback((item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setInventory(prev => [normalizeInventoryItem(newItem), ...prev]);
    toast.success('Inventory item added successfully');
  }, []);

  const updateInventoryItem = useCallback((id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => i.id === id
      ? normalizeInventoryItem({ ...i, ...updates, updated_at: new Date().toISOString() })
      : i));
    toast.success('Inventory item updated');
  }, []);

  const deleteInventoryItem = useCallback((id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
    toast.success('Inventory item deleted');
  }, []);

  const addMaintenanceRecord = useCallback((record: Omit<MaintenanceRecord, 'id' | 'created_at'>) => {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: `m${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setMaintenance(prev => [newRecord, ...prev]);
    setAssets(prev => prev.map(a => a.id === record.asset_id ? { ...a, status: 'maintenance' } : a));
    addLog(`Maintenance scheduled for asset`, 'MAINTENANCE', 'asset', record.asset_id);
    toast.success('Maintenance record created');
  }, [addLog]);

  const updateMaintenanceRecord = useCallback((id: string, updates: Partial<MaintenanceRecord>) => {
    setMaintenance(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    if (updates.status === 'completed') {
      const record = maintenance.find(m => m.id === id);
      if (record) {
        setAssets(prev => prev.map(a => a.id === record.asset_id ? { ...a, status: 'available' } : a));
      }
    }
    toast.success('Maintenance record updated');
  }, [maintenance]);

  return (
    <AppContext.Provider value={{
      assets, employees, assignments, inventory, maintenance, returns,
      activityLogs: logs, categories, departments, suppliers,
      addAsset, updateAsset, deleteAsset,
      addEmployee, updateEmployee, deleteEmployee,
      assignAsset, returnAsset,
      addInventoryItem, updateInventoryItem, deleteInventoryItem,
      addMaintenanceRecord, updateMaintenanceRecord,
      globalSearch, setGlobalSearch,
      sidebarOpen, setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

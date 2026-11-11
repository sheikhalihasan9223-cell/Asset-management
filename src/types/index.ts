export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'asset_manager' | 'it_support' | 'read_only';
  avatar?: string;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  manager_id?: string;
  employee_count?: number;
  created_at: string;
}

export interface Employee {
  id: string;
  employee_id?: string;
  full_name: string;
  email: string;
  phone: string;
  department_id: string;
  department?: Department;
  designation: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'on_leave';
  join_date: string;
  total_assets?: number;
  created_at: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address?: string;
  created_at: string;
}

export interface Asset {
  id: string;
  asset_id: string;
  name: string;
  category_id: string;
  category?: AssetCategory;
  brand: string;
  model: string;
  serial_number: string;
  asset_tag?: string;
  purchase_date: string;
  purchase_cost: number;
  supplier_id?: string;
  supplier?: Supplier;
  warranty_expiry?: string;
  location: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  status: 'available' | 'assigned' | 'maintenance' | 'retired' | 'damaged';
  image?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category_id: string;
  category?: AssetCategory;
  brand: string;
  model: string;
  total_quantity: number;
  assigned_quantity: number;
  available_quantity: number;
  under_maintenance: number;
  damaged_quantity: number;
  min_stock_level: number;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetAssignment {
  id: string;
  asset_id: string;
  asset?: Asset;
  employee_id: string;
  employee?: Employee;
  assigned_by: string;
  assigned_by_user?: User;
  assignment_date: string;
  expected_return_date?: string;
  actual_return_date?: string;
  condition_at_assignment: string;
  condition_at_return?: string;
  accessories?: string;
  /** Inventory records issued with this assignment, used to restore stock on return. */
  accessory_inventory_ids?: string[];
  remarks?: string;
  signature?: string;
  status: 'active' | 'returned' | 'overdue';
  created_at: string;
}

export interface AssetReturn {
  id: string;
  assignment_id: string;
  assignment?: AssetAssignment;
  asset_id: string;
  asset?: Asset;
  employee_id: string;
  employee?: Employee;
  processed_by: string;
  return_date: string;
  returned_condition: 'available' | 'maintenance' | 'damaged';
  accessories_returned?: string;
  inspection_notes?: string;
  photos?: string[];
  created_at: string;
}

export interface MaintenanceRecord {
  id: string;
  asset_id: string;
  asset?: Asset;
  reported_by: string;
  reported_by_user?: User;
  issue_description: string;
  service_provider?: string;
  start_date: string;
  expected_completion?: string;
  actual_completion?: string;
  repair_cost?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  description: string;
  performed_by: string;
  performed_by_user?: User;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  user_id: string;
  created_at: string;
}

export interface DashboardStats {
  total_assets: number;
  available_in_inventory: number;
  assigned_assets: number;
  pending_returns: number;
  total_assets_trend: number;
  inventory_trend: number;
  assigned_trend: number;
  returns_trend: number;
}

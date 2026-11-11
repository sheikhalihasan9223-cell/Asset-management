import { Asset, AssetAssignment, AssetCategory, AssetReturn, Department, Employee, InventoryItem, MaintenanceRecord, Supplier } from '../types';

export const departments: Department[] = [
  { id: 'd1', name: 'Information Technology', code: 'IT', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd2', name: 'Finance', code: 'FIN', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd3', name: 'Operations', code: 'OPS', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd4', name: 'Human Resources', code: 'HR', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd5', name: 'Marketing', code: 'MKT', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd6', name: 'Sales', code: 'SAL', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd7', name: 'Legal', code: 'LEG', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd8', name: 'Executive', code: 'EXE', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd9', name: 'Business Development', code: 'BD', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd10', name: 'CEO', code: 'CEO', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd11', name: 'Collection', code: 'COL', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd12', name: 'Cyber Security', code: 'CYB', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd13', name: 'IT Department', code: 'ITD', employee_count: 0, created_at: '2024-01-01' },
  { id: 'd14', name: 'Unassigned', code: 'UN', employee_count: 0, created_at: '2024-01-01' },
];

export const categories: AssetCategory[] = [
  { id: 'c1', name: 'Laptop', code: 'LAP', description: 'Portable computers', created_at: '2024-01-01' },
  { id: 'c2', name: 'Desktop', code: 'DSK', description: 'Desktop computers', created_at: '2024-01-01' },
  { id: 'c3', name: 'Monitor', code: 'MON', description: 'Display monitors', created_at: '2024-01-01' },
  { id: 'c4', name: 'Printer', code: 'PRT', description: 'Printers and scanners', created_at: '2024-01-01' },
  { id: 'c5', name: 'Accessories', code: 'ACC', description: 'Keyboards, mice, headsets', created_at: '2024-01-01' },
  { id: 'c6', name: 'Network', code: 'NET', description: 'Routers, switches, cables', created_at: '2024-01-01' },
  { id: 'c7', name: 'Server', code: 'SRV', description: 'Servers and storage', created_at: '2024-01-01' },
  { id: 'c8', name: 'Phone', code: 'PHN', description: 'Mobile phones and tablets', created_at: '2024-01-01' },
];

export const suppliers: Supplier[] = [
  { id: 's1', name: 'Dell Technologies KSA', contact_person: 'Ahmed Nasser', email: 'ahmed@dell.sa', phone: '+966-11-2345678', created_at: '2024-01-01' },
  { id: 's2', name: 'HP Saudi Arabia', contact_person: 'Sara Mohammed', email: 'sara@hp.sa', phone: '+966-11-3456789', created_at: '2024-01-01' },
  { id: 's3', name: 'Lenovo Arabia', contact_person: 'Khalid Al-Rashid', email: 'khalid@lenovo.sa', phone: '+966-11-4567890', created_at: '2024-01-01' },
  { id: 's4', name: 'Samsung Gulf', contact_person: 'Fatima Al-Zahrani', email: 'fatima@samsung.sa', phone: '+966-11-5678901', created_at: '2024-01-01' },
];

export const employees: Employee[] = [
  { id: 'e1', employee_id: 'GS1-001', full_name: 'Ahmed Khan', email: 'ahmed.khan@gs1sa.org', phone: '+966-50-1234567', department_id: 'd1', department: departments[0], designation: 'IT Manager', status: 'active', join_date: '2022-03-15', total_assets: 5, created_at: '2022-03-15' },
  { id: 'e2', employee_id: 'GS1-002', full_name: 'Sara Alenzi', email: 'sara.alenzi@gs1sa.org', phone: '+966-55-2345678', department_id: 'd2', department: departments[1], designation: 'Finance Analyst', status: 'active', join_date: '2021-07-20', total_assets: 2, created_at: '2021-07-20' },
  { id: 'e3', employee_id: 'GS1-003', full_name: 'Mohammed Al Qahtani', email: 'mohammed.q@gs1sa.org', phone: '+966-56-3456789', department_id: 'd3', department: departments[2], designation: 'Operations Coordinator', status: 'active', join_date: '2023-01-10', total_assets: 3, created_at: '2023-01-10' },
  { id: 'e4', employee_id: 'GS1-004', full_name: 'Fatima Al Dosari', email: 'fatima.dosari@gs1sa.org', phone: '+966-54-4567890', department_id: 'd4', department: departments[3], designation: 'HR Specialist', status: 'active', join_date: '2022-09-01', total_assets: 2, created_at: '2022-09-01' },
  { id: 'e5', employee_id: 'GS1-005', full_name: 'Khalid Al Harbi', email: 'khalid.harbi@gs1sa.org', phone: '+966-58-5678901', department_id: 'd5', department: departments[4], designation: 'Marketing Executive', status: 'active', join_date: '2023-05-15', total_assets: 1, created_at: '2023-05-15' },
  { id: 'e6', employee_id: 'GS1-006', full_name: 'Noura Al Shehri', email: 'noura.shehri@gs1sa.org', phone: '+966-50-6789012', department_id: 'd6', department: departments[5], designation: 'Sales Manager', status: 'active', join_date: '2021-11-20', total_assets: 3, created_at: '2021-11-20' },
  { id: 'e7', employee_id: 'GS1-007', full_name: 'Omar Al Ghamdi', email: 'omar.ghamdi@gs1sa.org', phone: '+966-55-7890123', department_id: 'd1', department: departments[0], designation: 'Network Engineer', status: 'active', join_date: '2022-06-01', total_assets: 4, created_at: '2022-06-01' },
  { id: 'e8', employee_id: 'GS1-008', full_name: 'Lina Al Otaibi', email: 'lina.otaibi@gs1sa.org', phone: '+966-56-8901234', department_id: 'd7', department: departments[6], designation: 'Legal Counsel', status: 'active', join_date: '2023-02-14', total_assets: 2, created_at: '2023-02-14' },
  { id: 'e9', employee_id: 'GS1-009', full_name: 'Abdulrahman Al Zahrani', email: 'ar.zahrani@gs1sa.org', phone: '+966-54-9012345', department_id: 'd3', department: departments[2], designation: 'Senior Analyst', status: 'active', join_date: '2020-08-10', total_assets: 3, created_at: '2020-08-10' },
  { id: 'e10', employee_id: 'GS1-010', full_name: 'Maha Al Rashidi', email: 'maha.rashidi@gs1sa.org', phone: '+966-58-0123456', department_id: 'd8', department: departments[7], designation: 'Executive Assistant', status: 'on_leave', join_date: '2021-04-05', total_assets: 2, created_at: '2021-04-05' },
  { id: 'e11', employee_id: 'GS1-011', full_name: 'Tariq Al Malki', email: 'tariq.malki@gs1sa.org', phone: '+966-50-1122334', department_id: 'd1', department: departments[0], designation: 'IT Support Specialist', status: 'active', join_date: '2023-08-21', total_assets: 2, created_at: '2023-08-21' },
  { id: 'e12', employee_id: 'GS1-012', full_name: 'Hessa Al Dossary', email: 'hessa.dossary@gs1sa.org', phone: '+966-55-2233445', department_id: 'd2', department: departments[1], designation: 'Senior Accountant', status: 'active', join_date: '2022-01-17', total_assets: 2, created_at: '2022-01-17' },
];

export const assets: Asset[] = [
  { id: 'a1', asset_id: 'AST-0001', name: 'Dell Latitude 5540', category_id: 'c1', category: categories[0], brand: 'Dell', model: 'Latitude 5540', serial_number: 'LP12345', asset_tag: 'GS1-LAP-001', purchase_date: '2023-06-15', purchase_cost: 4500, supplier_id: 's1', supplier: suppliers[0], warranty_expiry: '2026-06-15', location: 'IT Department', condition: 'excellent', status: 'assigned', notes: 'Assigned to IT Manager', created_at: '2023-06-15', updated_at: '2025-10-15' },
  { id: 'a2', asset_id: 'AST-0002', name: 'HP EliteBook 850 G9', category_id: 'c1', category: categories[0], brand: 'HP', model: 'EliteBook 850 G9', serial_number: 'LP12346', asset_tag: 'GS1-LAP-002', purchase_date: '2023-07-20', purchase_cost: 5200, supplier_id: 's2', supplier: suppliers[1], warranty_expiry: '2026-07-20', location: 'Finance Department', condition: 'good', status: 'assigned', created_at: '2023-07-20', updated_at: '2025-10-12' },
  { id: 'a3', asset_id: 'AST-0003', name: 'HP Monitor 27"', category_id: 'c3', category: categories[2], brand: 'HP', model: 'Z27k G3', serial_number: 'MN67890', asset_tag: 'GS1-MON-001', purchase_date: '2023-08-10', purchase_cost: 1800, supplier_id: 's2', supplier: suppliers[1], warranty_expiry: '2026-08-10', location: 'Operations', condition: 'good', status: 'assigned', created_at: '2023-08-10', updated_at: '2025-10-10' },
  { id: 'a4', asset_id: 'AST-0004', name: 'Dell Keyboard KB216', category_id: 'c5', category: categories[4], brand: 'Dell', model: 'KB216', serial_number: 'KB78901', asset_tag: 'GS1-ACC-001', purchase_date: '2023-09-01', purchase_cost: 150, supplier_id: 's1', supplier: suppliers[0], location: 'HR Department', condition: 'excellent', status: 'assigned', created_at: '2023-09-01', updated_at: '2025-10-08' },
  { id: 'a5', asset_id: 'AST-0005', name: 'Logitech Wireless Headset', category_id: 'c5', category: categories[4], brand: 'Logitech', model: 'H390', serial_number: 'HS56789', asset_tag: 'GS1-ACC-002', purchase_date: '2023-09-15', purchase_cost: 350, location: 'Marketing', condition: 'good', status: 'assigned', created_at: '2023-09-15', updated_at: '2025-10-05' },
  { id: 'a6', asset_id: 'AST-0006', name: 'Dell Laptop Latitude 5420', category_id: 'c1', category: categories[0], brand: 'Dell', model: 'Latitude 5420', serial_number: 'LP11223', asset_tag: 'GS1-LAP-003', purchase_date: '2023-10-01', purchase_cost: 4200, supplier_id: 's1', supplier: suppliers[0], warranty_expiry: '2026-10-01', location: 'IT Store', condition: 'excellent', status: 'available', created_at: '2023-10-01', updated_at: '2023-10-01' },
  { id: 'a7', asset_id: 'AST-0007', name: 'HP LaserJet Pro M428', category_id: 'c4', category: categories[3], brand: 'HP', model: 'LaserJet Pro M428', serial_number: 'PR44556', asset_tag: 'GS1-PRT-001', purchase_date: '2022-11-20', purchase_cost: 2800, supplier_id: 's2', supplier: suppliers[1], warranty_expiry: '2025-11-20', location: 'IT Store', condition: 'fair', status: 'maintenance', created_at: '2022-11-20', updated_at: '2025-10-18' },
  { id: 'a8', asset_id: 'AST-0008', name: 'Samsung Monitor 24"', category_id: 'c3', category: categories[2], brand: 'Samsung', model: 'LS24R356', serial_number: 'MN67891', asset_tag: 'GS1-MON-002', purchase_date: '2023-05-10', purchase_cost: 1200, supplier_id: 's4', supplier: suppliers[3], warranty_expiry: '2026-05-10', location: 'IT Store', condition: 'excellent', status: 'available', created_at: '2023-05-10', updated_at: '2023-05-10' },
  { id: 'a9', asset_id: 'AST-0009', name: 'Lenovo ThinkPad E14', category_id: 'c1', category: categories[0], brand: 'Lenovo', model: 'ThinkPad E14', serial_number: 'LP33456', asset_tag: 'GS1-LAP-004', purchase_date: '2024-01-15', purchase_cost: 3800, supplier_id: 's3', supplier: suppliers[2], warranty_expiry: '2027-01-15', location: 'IT Store', condition: 'excellent', status: 'available', created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: 'a10', asset_id: 'AST-0010', name: 'HP Desktop ProDesk 400', category_id: 'c2', category: categories[1], brand: 'HP', model: 'ProDesk 400 G7', serial_number: 'DK98765', asset_tag: 'GS1-DSK-001', purchase_date: '2022-08-20', purchase_cost: 3200, supplier_id: 's2', supplier: suppliers[1], warranty_expiry: '2025-08-20', location: 'IT Department', condition: 'good', status: 'assigned', created_at: '2022-08-20', updated_at: '2025-09-01' },
  { id: 'a11', asset_id: 'AST-0011', name: 'Cisco IP Phone 8841', category_id: 'c8', category: categories[7], brand: 'Cisco', model: '8841', serial_number: 'PH12345', asset_tag: 'GS1-PHN-001', purchase_date: '2022-06-10', purchase_cost: 1500, location: 'Executive Office', condition: 'good', status: 'assigned', created_at: '2022-06-10', updated_at: '2025-07-01' },
  { id: 'a12', asset_id: 'AST-0012', name: 'Dell Wireless Mouse MS3320W', category_id: 'c5', category: categories[4], brand: 'Dell', model: 'MS3320W', serial_number: 'MS11122', asset_tag: 'GS1-ACC-003', purchase_date: '2024-02-01', purchase_cost: 120, supplier_id: 's1', location: 'IT Store', condition: 'excellent', status: 'available', created_at: '2024-02-01', updated_at: '2024-02-01' },
  { id: 'a13', asset_id: 'AST-0013', name: 'HP UPS R1500G4', category_id: 'c6', category: categories[5], brand: 'HP', model: 'R1500G4', serial_number: 'UP99001', asset_tag: 'GS1-NET-001', purchase_date: '2022-03-15', purchase_cost: 2200, supplier_id: 's2', location: 'Server Room', condition: 'good', status: 'available', created_at: '2022-03-15', updated_at: '2022-03-15' },
  { id: 'a14', asset_id: 'AST-0014', name: 'Logitech MX Keys Keyboard', category_id: 'c5', category: categories[4], brand: 'Logitech', model: 'MX Keys', serial_number: 'KB22233', asset_tag: 'GS1-ACC-004', purchase_date: '2024-03-10', purchase_cost: 450, location: 'IT Store', condition: 'excellent', status: 'available', created_at: '2024-03-10', updated_at: '2024-03-10' },
  { id: 'a15', asset_id: 'AST-0015', name: 'Dell Monitor 32" 4K', category_id: 'c3', category: categories[2], brand: 'Dell', model: 'U3223QE', serial_number: 'MN88990', asset_tag: 'GS1-MON-003', purchase_date: '2023-11-05', purchase_cost: 3500, supplier_id: 's1', warranty_expiry: '2026-11-05', location: 'IT Store', condition: 'excellent', status: 'available', created_at: '2023-11-05', updated_at: '2023-11-05' },
];

export const assignments: AssetAssignment[] = [
  { id: 'asgn1', asset_id: 'a1', asset: assets[0], employee_id: 'e1', employee: employees[0], assigned_by: 'admin', assignment_date: '2025-10-15', expected_return_date: '2026-10-15', condition_at_assignment: 'excellent', accessories: 'Charger, Bag', status: 'active', created_at: '2025-10-15' },
  { id: 'asgn2', asset_id: 'a2', asset: assets[1], employee_id: 'e2', employee: employees[1], assigned_by: 'admin', assignment_date: '2025-10-12', expected_return_date: '2026-10-12', condition_at_assignment: 'good', accessories: 'Charger', status: 'active', created_at: '2025-10-12' },
  { id: 'asgn3', asset_id: 'a3', asset: assets[2], employee_id: 'e3', employee: employees[2], assigned_by: 'admin', assignment_date: '2025-10-10', condition_at_assignment: 'good', status: 'active', created_at: '2025-10-10' },
  { id: 'asgn4', asset_id: 'a4', asset: assets[3], employee_id: 'e4', employee: employees[3], assigned_by: 'admin', assignment_date: '2025-10-08', condition_at_assignment: 'excellent', status: 'active', created_at: '2025-10-08' },
  { id: 'asgn5', asset_id: 'a5', asset: assets[4], employee_id: 'e5', employee: employees[4], assigned_by: 'admin', assignment_date: '2025-10-05', condition_at_assignment: 'good', status: 'active', created_at: '2025-10-05' },
  { id: 'asgn6', asset_id: 'a10', asset: assets[9], employee_id: 'e7', employee: employees[6], assigned_by: 'admin', assignment_date: '2025-09-01', condition_at_assignment: 'good', status: 'active', created_at: '2025-09-01' },
];

export const inventoryItems: InventoryItem[] = [
  { id: 'inv1', name: 'Dell Laptop', category_id: 'c1', category: categories[0], brand: 'Dell', model: 'Various', total_quantity: 180, assigned_quantity: 60, available_quantity: 120, under_maintenance: 0, damaged_quantity: 0, min_stock_level: 20, created_at: '2024-01-01', updated_at: '2025-10-15' },
  { id: 'inv2', name: 'HP Monitor 24"', category_id: 'c3', category: categories[2], brand: 'HP', model: 'Z24q G3', total_quantity: 100, assigned_quantity: 20, available_quantity: 80, under_maintenance: 0, damaged_quantity: 0, min_stock_level: 15, created_at: '2024-01-01', updated_at: '2025-10-15' },
  { id: 'inv3', name: 'Wireless Mouse', category_id: 'c5', category: categories[4], brand: 'Various', model: 'Various', total_quantity: 220, assigned_quantity: 20, available_quantity: 200, under_maintenance: 0, damaged_quantity: 0, min_stock_level: 30, created_at: '2024-01-01', updated_at: '2025-10-15' },
  { id: 'inv4', name: 'Keyboard', category_id: 'c5', category: categories[4], brand: 'Various', model: 'Various', total_quantity: 200, assigned_quantity: 20, available_quantity: 180, under_maintenance: 0, damaged_quantity: 0, min_stock_level: 30, created_at: '2024-01-01', updated_at: '2025-10-15' },
  { id: 'inv5', name: 'Printer HP LaserJet', category_id: 'c4', category: categories[3], brand: 'HP', model: 'LaserJet Pro', total_quantity: 50, assigned_quantity: 8, available_quantity: 40, under_maintenance: 2, damaged_quantity: 0, min_stock_level: 50, created_at: '2024-01-01', updated_at: '2025-10-18' },
  { id: 'inv6', name: 'HP EliteBook', category_id: 'c1', category: categories[0], brand: 'HP', model: 'EliteBook 850', total_quantity: 90, assigned_quantity: 45, available_quantity: 45, under_maintenance: 0, damaged_quantity: 0, min_stock_level: 10, created_at: '2024-01-01', updated_at: '2025-10-15' },
  { id: 'inv7', name: 'USB-C Docking Station', category_id: 'c5', category: categories[4], brand: 'Dell', model: 'WD19S', total_quantity: 30, assigned_quantity: 15, available_quantity: 15, under_maintenance: 0, damaged_quantity: 0, min_stock_level: 10, created_at: '2024-01-01', updated_at: '2025-10-15' },
  { id: 'inv8', name: 'Network Switch 24-Port', category_id: 'c6', category: categories[5], brand: 'Cisco', model: 'SG350-28', total_quantity: 8, assigned_quantity: 0, available_quantity: 8, under_maintenance: 0, damaged_quantity: 0, min_stock_level: 10, created_at: '2024-01-01', updated_at: '2025-10-15' },
];

export const maintenanceRecords: MaintenanceRecord[] = [
  { id: 'm1', asset_id: 'a7', asset: assets[6], reported_by: 'admin', issue_description: 'Paper jam issue, needs roller replacement', service_provider: 'HP Service Center Riyadh', start_date: '2025-10-18', expected_completion: '2025-10-25', status: 'in_progress', created_at: '2025-10-18' },
  { id: 'm2', asset_id: 'a3', asset: assets[2], reported_by: 'admin', issue_description: 'Display flickering at startup', service_provider: 'HP Authorized Service', start_date: '2025-09-10', expected_completion: '2025-09-20', actual_completion: '2025-09-18', repair_cost: 350, status: 'completed', created_at: '2025-09-10' },
  { id: 'm3', asset_id: 'a2', asset: assets[1], reported_by: 'admin', issue_description: 'Battery not charging properly', service_provider: 'HP Service Center', start_date: '2025-08-05', expected_completion: '2025-08-12', actual_completion: '2025-08-10', repair_cost: 850, status: 'completed', created_at: '2025-08-05' },
  { id: 'm4', asset_id: 'a13', asset: assets[12], reported_by: 'admin', issue_description: 'UPS battery replacement required', service_provider: 'HP Service Partner', start_date: '2025-10-20', expected_completion: '2025-10-28', status: 'pending', created_at: '2025-10-20' },
];

export const returns: AssetReturn[] = [
  { id: 'r1', assignment_id: 'asgn-old-1', asset_id: 'a3', asset: assets[2], employee_id: 'e2', employee: employees[1], processed_by: 'admin', return_date: '2025-10-15', returned_condition: 'available', accessories_returned: 'None', inspection_notes: 'Monitor in good condition', created_at: '2025-10-15' },
];

export const activityLogs = [
  { id: 'act1', action: 'ASSIGN', entity_type: 'asset', entity_id: 'a1', description: 'Laptop (SN: LP12345) assigned to Ahmed Khan', performed_by: 'Admin', created_at: '2025-10-15T10:30:00' },
  { id: 'act2', action: 'RETURN', entity_type: 'asset', entity_id: 'a3', description: 'Monitor (SN: MN67890) returned by Sara Alenzi', performed_by: 'Admin', created_at: '2025-10-15T09:00:00' },
  { id: 'act3', action: 'ADD', entity_type: 'asset', entity_id: 'a6', description: 'Dell Laptop (SN: LP11223) added to inventory', performed_by: 'Admin', created_at: '2025-10-15T07:00:00' },
  { id: 'act4', action: 'MAINTENANCE', entity_type: 'asset', entity_id: 'a7', description: 'Printer (SN: PR44556) scheduled for maintenance', performed_by: 'Admin', created_at: '2025-10-14T14:00:00' },
  { id: 'act5', action: 'ASSIGN', entity_type: 'asset', entity_id: 'a2', description: 'HP EliteBook assigned to Sara Alenzi', performed_by: 'Admin', created_at: '2025-10-12T11:00:00' },
  { id: 'act6', action: 'ADD', entity_type: 'employee', entity_id: 'e11', description: 'New employee Tariq Al Malki added to system', performed_by: 'Admin', created_at: '2025-10-11T09:00:00' },
];

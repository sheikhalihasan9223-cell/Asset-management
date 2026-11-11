import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Download, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { exportToCSV, formatDate } from '../lib/utils'
import { StatusBadge } from '../components/ui/Badge'
import SearchSelect from '../components/ui/SearchSelect'

type ReportRecord = Record<string, string | number>

export default function WorkspacePage() {
  const { pathname } = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  const { assets, employees, assignments, inventory, maintenance, returns, activityLogs, categories, departments, addMaintenanceRecord, updateMaintenanceRecord } = useApp()
  const [selectedAsset, setSelectedAsset] = useState('')
  const [issue, setIssue] = useState('')
  const [showForm, setShowForm] = useState(false)
  const employee = employees.find(item => item.id === params.id)
  const report = pathname.startsWith('/reports/')
  const maintenancePage = pathname.startsWith('/maintenance')
  const title = pathname === '/employees/departments' ? 'Departments'
    : pathname === '/employees/assets' ? 'Employee Asset Details'
    : pathname.startsWith('/employees/') ? (employee?.full_name ?? 'Employee Details')
    : pathname.startsWith('/maintenance') ? (pathname.endsWith('/history') ? 'Service History' : 'Maintenance Requests')
    : report ? `${pathname.split('/').pop()?.replace(/^./, c => c.toUpperCase())} Report`
    : pathname === '/settings/categories' ? 'Categories'
    : pathname === '/settings/notifications' ? 'Notifications'
    : pathname === '/settings/users' ? 'User Management' : 'General Settings'

  const assignmentsForEmployee = useMemo(() => assignments.filter(row => !employee || row.employee_id === employee.id), [assignments, employee])

  const reportData: Record<string, ReportRecord[]> = {
    assets: assets.map(asset => ({
      'Report Type': 'Asset', 'Record ID': asset.id, 'Asset ID': asset.asset_id, 'Asset Name': asset.name,
      'Category ID': asset.category_id,
      Category: asset.category?.name ?? categories.find(category => category.id === asset.category_id)?.name ?? '',
      Brand: asset.brand, Model: asset.model, 'Serial Number': asset.serial_number, 'Asset Tag': asset.asset_tag ?? '',
      'Purchase Date': asset.purchase_date, 'Purchase Cost': asset.purchase_cost,
      'Supplier ID': asset.supplier_id ?? '', Supplier: asset.supplier?.name ?? '', 'Warranty Expiry': asset.warranty_expiry ?? '',
      Location: asset.location, Condition: asset.condition, Status: asset.status, Image: asset.image ?? '', Notes: asset.notes ?? '',
      'Created At': asset.created_at, 'Updated At': asset.updated_at,
    })),
    employees: employees.map(emp => ({
      'Report Type': 'Employee', 'Record ID': emp.id, 'Employee ID': emp.employee_id ?? '',
      'Employee Name': emp.full_name, Email: emp.email, Phone: emp.phone,
      'Department ID': emp.department_id,
      Department: emp.department?.name ?? departments.find(department => department.id === emp.department_id)?.name ?? '',
      Designation: emp.designation, Status: emp.status, 'Join Date': emp.join_date, Avatar: emp.avatar ?? '',
      'Assets Assigned': emp.total_assets ?? 0, 'Created At': emp.created_at,
    })),
    inventory: inventory.map(item => ({
      'Report Type': 'Inventory', 'Record ID': item.id, 'Item Name': item.name,
      'Category ID': item.category_id,
      Category: item.category?.name ?? categories.find(category => category.id === item.category_id)?.name ?? '',
      Brand: item.brand, Model: item.model, 'Total Quantity': item.total_quantity,
      'Assigned Quantity': item.assigned_quantity, 'Available Quantity': item.available_quantity,
      'Under Maintenance': item.under_maintenance, 'Damaged Quantity': item.damaged_quantity,
      'Minimum Stock Level': item.min_stock_level, Image: item.image ?? '', 'Created At': item.created_at, 'Updated At': item.updated_at,
    })),
    assignments: assignments.map(record => {
      const asset = assets.find(item => item.id === record.asset_id)
      const employeeRecord = employees.find(item => item.id === record.employee_id)
      return {
        'Report Type': 'Assignment', 'Record ID': record.id, 'Asset ID': asset?.asset_id ?? record.asset_id,
        'Asset Record ID': record.asset_id, 'Asset Name': asset?.name ?? record.asset?.name ?? '', 'Serial Number': asset?.serial_number ?? record.asset?.serial_number ?? '',
        'Employee Record ID': record.employee_id, 'Employee ID': employeeRecord?.employee_id ?? '', 'Employee Name': employeeRecord?.full_name ?? record.employee?.full_name ?? '',
        'Assigned By': record.assigned_by, 'Assigned By User': record.assigned_by_user?.full_name ?? '', 'Assignment Date': record.assignment_date,
        'Expected Return Date': record.expected_return_date ?? '', 'Actual Return Date': record.actual_return_date ?? '',
        'Condition At Assignment': record.condition_at_assignment, 'Condition At Return': record.condition_at_return ?? '',
        Accessories: record.accessories ?? '', 'Accessory Inventory IDs': (record.accessory_inventory_ids ?? []).join('; '),
        Remarks: record.remarks ?? '', Signature: record.signature ?? '', Status: record.status, 'Created At': record.created_at,
      }
    }),
    returns: returns.map(record => {
      const asset = assets.find(item => item.id === record.asset_id)
      const employeeRecord = employees.find(item => item.id === record.employee_id)
      return {
        'Report Type': 'Return', 'Record ID': record.id, 'Assignment ID': record.assignment_id,
        'Asset Record ID': record.asset_id, 'Asset ID': asset?.asset_id ?? record.asset_id, 'Asset Name': asset?.name ?? record.asset?.name ?? '',
        'Serial Number': asset?.serial_number ?? record.asset?.serial_number ?? '',
        'Employee Record ID': record.employee_id, 'Employee ID': employeeRecord?.employee_id ?? '', 'Employee Name': employeeRecord?.full_name ?? record.employee?.full_name ?? '',
        'Processed By': record.processed_by, 'Return Date': record.return_date,
        'Returned Condition': record.returned_condition, 'Accessories Returned': record.accessories_returned ?? '',
        'Inspection Notes': record.inspection_notes ?? '', Photos: (record.photos ?? []).join('; '), 'Created At': record.created_at,
      }
    }),
    maintenance: maintenance.map(record => {
      const asset = assets.find(item => item.id === record.asset_id)
      return {
        'Report Type': 'Maintenance', 'Record ID': record.id, 'Asset ID': asset?.asset_id ?? record.asset_id,
        'Asset Name': asset?.name ?? record.asset?.name ?? '', 'Serial Number': asset?.serial_number ?? record.asset?.serial_number ?? '',
        'Reported By': record.reported_by, 'Reported By User': record.reported_by_user?.full_name ?? '', 'Issue Description': record.issue_description,
        'Service Provider': record.service_provider ?? '', 'Start Date': record.start_date,
        'Expected Completion': record.expected_completion ?? '', 'Actual Completion': record.actual_completion ?? '',
        'Repair Cost': record.repair_cost ?? '', Status: record.status, Notes: record.notes ?? '', 'Created At': record.created_at,
      }
    }),
    activity: activityLogs.map(log => ({
      'Report Type': 'Activity', 'Record ID': log.id, Action: log.action, 'Entity Type': log.entity_type,
      'Entity ID': log.entity_id, Description: log.description, 'Performed By': log.performed_by,
      'Performed By User': log.performed_by_user?.full_name ?? '', 'Created At': log.created_at,
    })),
  }
  const reportKey = pathname.split('/')[2] || 'assets'
  const currentReportRows = reportData[reportKey] ?? reportData.assets
  const reportTitles: Record<string, string> = {
    assets: 'Assets Report', employees: 'Employees Report', inventory: 'Inventory Report', assignments: 'Assignments Report',
  }
  const currentReportTitle = reportTitles[reportKey] ?? 'Assets Report'
  const allReportRows = Object.values(reportData).flat()
  const handleExport = () => {
    exportToCSV(allReportRows, 'all_reports')
  }

  const startMaintenance = () => {
    if (!selectedAsset || !issue.trim()) return
    addMaintenanceRecord({ asset_id: selectedAsset, asset: assets.find(a => a.id === selectedAsset), reported_by: 'Admin', issue_description: issue.trim(), start_date: new Date().toISOString().slice(0, 10), status: 'pending' })
    setSelectedAsset(''); setIssue(''); setShowForm(false)
  }

  if (pathname.startsWith('/employees/') && !['/employees/departments', '/employees/assets'].includes(pathname) && !employee) {
    return <div className="card p-8 text-center"><h1 className="page-title">Employee not found</h1><button className="btn-primary mt-4" onClick={() => navigate('/employees')}>Back to employees</button></div>
  }

  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="page-title">{title}</h1><p className="page-subtitle">{report ? 'Review and export current system data.' : 'Manage and review your asset management workspace.'}</p></div>
      {report && <button className="btn-primary btn-sm" onClick={handleExport}><Download size={14}/> Export All Reports CSV</button>}
      {maintenancePage && !pathname.endsWith('/history') && <button className="btn-primary btn-sm" onClick={() => setShowForm(v => !v)}><Plus size={14}/> New Request</button>}
    </div>
    {showForm && <div className="card p-4 flex flex-wrap gap-3 items-end">
      <label className="flex-1 min-w-48"><span className="form-label">Asset</span><SearchSelect value={selectedAsset} onValueChange={setSelectedAsset} placeholder="Select asset" options={assets.filter(a => a.status !== 'retired').map(a => ({ value: a.id, label: a.asset_id, description: a.name }))} /></label>
      <label className="flex-[2] min-w-56"><span className="form-label">Issue description</span><input className="form-input" value={issue} onChange={e => setIssue(e.target.value)} placeholder="Describe the problem"/></label>
      <button className="btn-primary" disabled={!selectedAsset || !issue.trim()} onClick={startMaintenance}>Create request</button>
    </div>}
    {pathname === '/employees/departments' ? <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{departments.map(d => <div className="card p-5" key={d.id}><div className="text-lg font-semibold">{d.name}</div><div className="text-sm text-gray-500">{d.code} · {employees.filter(e => e.department_id === d.id && e.status === 'active').length} active employees</div></div>)}</div>
    : pathname === '/settings/categories' ? <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{categories.map(c => <div className="card p-5" key={c.id}><div className="text-lg font-semibold">{c.name}</div><div className="text-sm text-gray-500">{c.code} · {assets.filter(a => a.category_id === c.id && a.status !== 'retired').length} assets</div></div>)}</div>
    : pathname === '/settings/notifications' ? <div className="card divide-y">{activityLogs.map(log => <div className="p-4" key={log.id}><div className="font-medium">{log.action.replace('_', ' ')}</div><div className="text-sm text-gray-600">{log.description}</div><div className="text-xs text-gray-400 mt-1">{formatDate(log.created_at)}</div></div>)}</div>
    : maintenancePage ? <div className="card overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50">{['Asset','Issue','Reported','Start Date','Status','Action'].map(c => <th className="table-th" key={c}>{c}</th>)}</tr></thead><tbody className="divide-y">{maintenance.map(m => <tr key={m.id}><td className="table-td">{m.asset?.asset_id} · {m.asset?.name}</td><td className="table-td">{m.issue_description}</td><td className="table-td">{m.reported_by}</td><td className="table-td">{formatDate(m.start_date)}</td><td className="table-td"><StatusBadge status={m.status}/></td><td className="table-td">{m.status !== 'completed' && m.status !== 'cancelled' && <button className="btn-secondary btn-sm" onClick={() => updateMaintenanceRecord(m.id, { status: m.status === 'pending' ? 'in_progress' : 'completed', ...(m.status === 'in_progress' ? { actual_completion: new Date().toISOString().slice(0, 10) } : {}) })}>{m.status === 'pending' ? 'Start service' : 'Complete'}</button>}</td></tr>)}{maintenance.length === 0 && <tr><td className="table-td text-center text-gray-400 py-10" colSpan={6}>No maintenance records</td></tr>}</tbody></table></div>
    : pathname.startsWith('/employees/') ? <div className="card overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50">{['Asset ID','Asset','Employee','Assigned','Expected Return','Status'].map(c => <th className="table-th" key={c}>{c}</th>)}</tr></thead><tbody className="divide-y">{assignmentsForEmployee.map(a => <tr key={a.id}><td className="table-td">{a.asset?.asset_id}</td><td className="table-td">{a.asset?.name}</td><td className="table-td">{a.employee?.full_name}</td><td className="table-td">{formatDate(a.assignment_date)}</td><td className="table-td">{a.expected_return_date ? formatDate(a.expected_return_date) : '—'}</td><td className="table-td"><StatusBadge status={a.status}/></td></tr>)}</tbody></table></div>
    : report ? <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          ['Assets', assets.length], ['Employees', employees.length], ['Inventory Items', inventory.length],
          ['Assignments', assignments.length], ['Returns', returns.length], ['Maintenance', maintenance.length],
        ].map(([label, count]) => <div className="card p-4" key={label}><div className="text-2xl font-bold text-orange-600">{count}</div><div className="text-xs text-gray-600">{label}</div></div>)}
      </div>
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 p-4">
          <div><h2 className="section-title">{currentReportTitle}</h2><p className="mt-1 text-xs text-gray-500">{currentReportRows.length} records · live from current system data</p></div>
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700"><span className="h-2 w-2 rounded-full bg-orange-500"/>Live report</span>
        </div>
        <div className="max-h-[70vh] overflow-auto">
          {currentReportRows.length ? <table className="w-full min-w-max"><thead className="sticky top-0 z-10"><tr className="bg-gray-50">{Object.keys(currentReportRows[0]).filter(key => key !== 'Report Type').map(key => <th className="table-th" key={key}>{key}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-100">{currentReportRows.map((row, index) => <tr className="table-row" key={String(row['Record ID'] ?? index)}>{Object.entries(row).filter(([key]) => key !== 'Report Type').map(([key, value]) => <td className="table-td" key={key}>{value === '' ? '—' : value}</td>)}</tr>)}</tbody></table>
            : <div className="py-16 text-center text-sm text-gray-500">No {reportKey} records yet. This report will update as records are added.</div>}
        </div>
        <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">Export All Reports CSV downloads assets, employees, inventory, assignments, returns, maintenance, and activity records together.</div>
      </div>
    </div>
    : <div className="card p-6"><h2 className="section-title">Workspace profile</h2><p className="mt-2 text-sm text-gray-600">GS1 Saudi Arabia asset management workspace. Data is stored in this browser and retained between visits.</p></div>}
  </div>
}

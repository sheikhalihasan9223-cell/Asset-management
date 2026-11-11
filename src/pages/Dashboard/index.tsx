import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList
} from 'recharts';
import {
  Monitor, Package, Users, Calendar, TrendingUp, TrendingDown,
  ArrowRight, CheckCircle2, RotateCcw, PackagePlus, Wrench,
  AlertTriangle, Laptop, Printer, ChevronDown, Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/ui/Badge';
import { formatDate, timeAgo, getInitials, avatarColor } from '../../lib/utils';

// Sparkline mini chart
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 40;
  const w = 100;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="dashboard-sparkline overflow-visible">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${pts} ${w},${h}`}
        fill={`url(#grad-${color})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({ title, value, trend, trendLabel, icon, iconBg, iconColor, sparkData, sparkColor }: {
  title: string;
  value: string | number;
  trend: number;
  trendLabel: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  sparkData: number[];
  sparkColor: string;
}) {
  const isPositive = trend >= 0;
  return (
    <div className="stat-card flex items-center gap-2 xl:gap-3 p-3 xl:p-4 min-w-0">
        <div className={`w-12 h-12 xl:w-[58px] xl:h-[58px] rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
          <span className={iconColor}>{icon}</span>
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="text-2xl xl:text-[28px] leading-8 font-bold text-[#0b2854]">{value}</div>
          <div className="text-xs xl:text-sm text-blue-900/80 whitespace-nowrap truncate" title={title}>{title}</div>
          <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{isPositive ? '+' : ''}{trend}%</span>
          </div>
        </div>
        <div className="flex-shrink-0 hidden 2xl:block">
          <Sparkline data={sparkData} color={sparkColor} />
        </div>
      </div>
  );
}

const DONUT_COLORS = ['#0b4a91', '#f97316', '#153c70'];

const activityIcons: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  ASSIGN: { icon: <CheckCircle2 size={14} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  RETURN: { icon: <RotateCcw size={14} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  ADD: { icon: <PackagePlus size={14} />, color: 'text-orange-600', bg: 'bg-orange-50' },
  MAINTENANCE: { icon: <Wrench size={14} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  DELETE: { icon: <Package size={14} />, color: 'text-orange-600', bg: 'bg-orange-50' },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow-md px-3 py-2 text-xs">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-gray-600">{payload[0].value} assets</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { assets, assignments, inventory, activityLogs, categories } = useApp();
  const navigate = useNavigate();

  const totalAssets = assets.filter(a => a.status !== 'retired').length;
  const availableAssets = assets.filter(a => a.status === 'available').length;
  const assignedAssets = assignments.filter(a => a.status === 'active').length;
  const pendingReturns = assignments.filter(a => {
    if (a.status !== 'active' || !a.expected_return_date) return false;
    return new Date(a.expected_return_date) < new Date();
  }).length;
  const maintenanceAssets = assets.filter(a => a.status === 'maintenance').length;
  const donutData = [
    { name: 'Assigned', value: assignedAssets },
    { name: 'In Inventory', value: availableAssets },
    { name: 'Under Maintenance', value: maintenanceAssets },
  ];
  const categoryColors = ['#2563eb', '#f97316', '#1d4ed8', '#fb923c', '#3b82f6'];
  const categoryData = categories.map((category, index) => ({
    name: category.name,
    value: assets.filter(asset => asset.category_id === category.id && asset.status !== 'retired').length,
    fill: categoryColors[index % categoryColors.length],
  })).filter(category => category.value > 0).slice(0, 5);

  const activeAssignments = assignments
    .filter(a => a.status === 'active')
    .sort((a, b) => b.assignment_date.localeCompare(a.assignment_date))
    .slice(0, 5);
  const topInventory = inventory.slice(0, 5);
  const recentLogs = activityLogs.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="dashboard-heading flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[28px] leading-tight font-bold text-[#102c58]">Asset Management System</h1>
          <p className="text-[15px] text-blue-900/80 mt-1">Monitor, manage and track all company assets efficiently</p>
        </div>
        <button className="hidden sm:flex shrink-0 items-center gap-2 px-4 py-3 bg-white border border-blue-100 rounded-xl text-sm text-blue-900 shadow-sm hover:bg-blue-50 transition-colors">
          <Calendar size={16} className="text-primary-700" />
          <span>Last 30 Days</span>
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 xl:gap-4">
        <StatCard
          title="Total Assets"
          value={totalAssets.toLocaleString()}
          trend={2.5}
          trendLabel="this month"
          icon={<Monitor size={22} />}
          iconBg="bg-[#0b4a91]"
          iconColor="text-white"
          sparkData={[800, 900, 850, 950, 1000, 1100, 1250]}
          sparkColor="#2563eb"
        />
        <StatCard
          title="In Inventory"
          value={availableAssets.toLocaleString()}
          trend={1.8}
          trendLabel="this month"
          icon={<Package size={22} />}
          iconBg="bg-orange-500"
          iconColor="text-white"
          sparkData={[600, 650, 700, 750, 800, 820, 850]}
          sparkColor="#2563eb"
        />
        <StatCard
          title="Assigned Assets"
          value={assignedAssets.toLocaleString()}
          trend={3.1}
          trendLabel="this month"
          icon={<Users size={22} />}
          iconBg="bg-[#0b4a91]"
          iconColor="text-white"
          sparkData={[300, 320, 350, 370, 390, 410, 420]}
          sparkColor="#1d4ed8"
        />
        <StatCard
          title="Pending Returns"
          value={pendingReturns.toLocaleString()}
          trend={-1.2}
          trendLabel="this month"
          icon={<Calendar size={22} />}
          iconBg="bg-orange-500"
          iconColor="text-white"
          sparkData={[60, 55, 50, 48, 50, 47, 45]}
          sparkColor="#f97316"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Donut Chart */}
        <div className="card p-4 xl:p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-6 rounded-full bg-orange-500" />
            <h3 className="section-title">Assets Overview</h3>
          </div>
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-28 h-28 xl:w-36 xl:h-36 2xl:w-44 2xl:h-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-gray-900">{totalAssets.toLocaleString()}</span>
                <span className="text-xs text-gray-500">Total Assets</span>
              </div>
            </div>
            <div className="space-y-2 xl:space-y-3 flex-1 min-w-0">
              {donutData.map((d, i) => (
                <div key={d.name} className="grid grid-cols-[12px_minmax(0,1fr)] items-start gap-x-2 gap-y-0.5 min-w-0">
                  <span className="row-span-2 mt-0.5 w-3 h-3 rounded-full" style={{ background: DONUT_COLORS[i] }} />
                  <span className="text-xs font-semibold text-blue-950 min-w-0 leading-4">{d.name}</span>
                  <span className="col-start-2 text-xs text-blue-950 whitespace-nowrap">{totalAssets ? Math.round(d.value / totalAssets * 100) : 0}% ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card p-4 xl:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-[#0b4a91]" />
            <h3 className="section-title">Asset by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={categoryData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600, fill: '#102c58' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" style={{ fill: '#102c58', fontSize: 12, fontWeight: 700 }} />
                {categoryData.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="card p-4 xl:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-orange-500" />
              <h3 className="section-title">Recent Activities</h3>
            </div>
            <button
              onClick={() => navigate('/assets/history')}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:underline"
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recentLogs.map(log => {
              const meta = activityIcons[log.action] || activityIcons.ADD;
              return (
                <div key={log.id} className="flex gap-3">
                  <div className={`w-7 h-7 rounded-full ${meta.bg} ${meta.color} flex items-center justify-center flex-shrink-0`}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-800">
                      {log.action === 'ASSIGN' ? 'Asset Assigned' :
                       log.action === 'RETURN' ? 'Asset Returned' :
                       log.action === 'MAINTENANCE' ? 'Maintenance Scheduled' :
                       log.action === 'ADD' ? 'New Asset Added' : 'Activity'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{log.description}</div>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                    {timeAgo(log.created_at)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Tables Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-w-0">
        {/* Assigned Assets Table */}
        <div className="card min-w-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-primary-600" />
              <h3 className="section-title">Recent Assigned Assets</h3>
            </div>
            <button
              onClick={() => navigate('/assets')}
              className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="dashboard-table w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="table-th">Employee Name</th>
                  <th className="table-th">Department</th>
                  <th className="table-th">Asset Type</th>
                  <th className="table-th">Asset ID</th>
                  <th className="table-th">Received On</th>
                  <th className="table-th">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeAssignments.map(a => (
                  <tr key={a.id} className="table-row">
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${avatarColor(a.employee?.full_name || '')} flex items-center justify-center text-white text-xs font-bold`}>
                          {getInitials(a.employee?.full_name || '?')}
                        </div>
                        <span className="font-medium text-gray-800">{a.employee?.full_name}</span>
                      </div>
                    </td>
                    <td className="table-td text-gray-500">{a.employee?.department?.name?.replace('Information Technology', 'IT Department')}</td>
                    <td className="table-td">{a.asset?.category?.name}</td>
                    <td className="table-td font-mono text-xs text-primary-600">{a.asset?.asset_id}</td>
                    <td className="table-td text-gray-500">{formatDate(a.assignment_date)}</td>
                    <td className="table-td">
                      <StatusBadge status={a.status === 'active' ? 'active' : a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Items Table */}
        <div className="card min-w-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-primary-600" />
              <h3 className="section-title">Inventory Items</h3>
            </div>
            <button
              onClick={() => navigate('/inventory')}
              className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="dashboard-table w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="table-th">Item</th>
                  <th className="table-th">Category</th>
                  <th className="table-th">In Stock</th>
                  <th className="table-th">Low Stock Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topInventory.map(item => {
                  const isLow = item.available_quantity <= item.min_stock_level;
                  return (
                    <tr key={item.id} className="table-row">
                      <td className="table-td">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Laptop size={14} className="text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="table-td text-gray-500">{item.category?.name}</td>
                      <td className="table-td font-semibold text-gray-800">{item.available_quantity}</td>
                      <td className="table-td">
                        {isLow ? (
                          <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
                            <AlertTriangle size={12} />
                            Below {item.min_stock_level}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">–</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

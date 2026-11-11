import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';

export default function StockOverview() {
  const { inventory, categories } = useApp();

  const byCategory = categories.map(cat => {
    const items = inventory.filter(i => i.category_id === cat.id);
    return {
      name: cat.name,
      available: items.reduce((s, i) => s + i.available_quantity, 0),
      assigned: items.reduce((s, i) => s + i.assigned_quantity, 0),
      maintenance: items.reduce((s, i) => s + i.under_maintenance, 0),
    };
  }).filter(d => d.available + d.assigned + d.maintenance > 0);

  const totals = {
    total: inventory.reduce((s, i) => s + i.total_quantity, 0),
    available: inventory.reduce((s, i) => s + i.available_quantity, 0),
    assigned: inventory.reduce((s, i) => s + i.assigned_quantity, 0),
    maintenance: inventory.reduce((s, i) => s + i.under_maintenance, 0),
    damaged: inventory.reduce((s, i) => s + i.damaged_quantity, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Stock Overview</h1>
        <p className="page-subtitle">Visual overview of inventory distribution</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Stock', value: totals.total, color: 'bg-primary-50 text-primary-700' },
          { label: 'Available', value: totals.available, color: 'bg-blue-50 text-blue-700' },
          { label: 'Assigned', value: totals.assigned, color: 'bg-blue-50 text-blue-700' },
          { label: 'Maintenance', value: totals.maintenance, color: 'bg-orange-50 text-orange-700' },
          { label: 'Damaged', value: totals.damaged, color: 'bg-orange-50 text-orange-700' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.color}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs mt-0.5 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h3 className="section-title mb-4">Stock by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byCategory} barSize={30}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="available" name="Available" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="assigned" name="Assigned" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="maintenance" name="Maintenance" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-3">
          {[['Available', '#2563eb'], ['Assigned', '#f97316'], ['Maintenance', '#1d4ed8']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="section-title">Category Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="table-th">Category</th>
                <th className="table-th text-center">Total</th>
                <th className="table-th text-center">Available</th>
                <th className="table-th text-center">Assigned</th>
                <th className="table-th text-center">Maintenance</th>
                <th className="table-th text-center">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {byCategory.map(cat => {
                const total = cat.available + cat.assigned + cat.maintenance;
                const utilization = total > 0 ? Math.round((cat.assigned / total) * 100) : 0;
                return (
                  <tr key={cat.name} className="table-row">
                    <td className="table-td font-medium text-gray-800">{cat.name}</td>
                    <td className="table-td text-center font-semibold">{total}</td>
                    <td className="table-td text-center text-blue-600 font-medium">{cat.available}</td>
                    <td className="table-td text-center text-blue-600 font-medium">{cat.assigned}</td>
                    <td className="table-td text-center text-orange-600">{cat.maintenance}</td>
                    <td className="table-td text-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${utilization}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 w-10">{utilization}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

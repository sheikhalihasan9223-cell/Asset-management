import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LowStockItems() {
  const { inventory } = useApp();
  const lowStock = inventory.filter(i => i.available_quantity <= i.min_stock_level);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <AlertTriangle size={20} className="text-orange-600" />
        </div>
        <div>
          <h1 className="page-title">Low Stock Items</h1>
          <p className="page-subtitle">{lowStock.length} items below minimum stock level</p>
        </div>
      </div>

      {lowStock.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">All Stock Levels OK</h3>
          <p className="text-gray-500 mt-1">No items are below their minimum stock level.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="table-th">Item Name</th>
                  <th className="table-th">Category</th>
                  <th className="table-th text-center">Available</th>
                  <th className="table-th text-center">Min Stock</th>
                  <th className="table-th text-center">Shortage</th>
                  <th className="table-th text-center">Urgency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lowStock.map(item => {
                  const shortage = item.min_stock_level - item.available_quantity;
                  const urgency = item.available_quantity === 0 ? 'critical' : shortage > 20 ? 'high' : 'medium';
                  return (
                    <tr key={item.id} className="table-row bg-orange-50/20">
                      <td className="table-td font-medium text-gray-800">{item.name}</td>
                      <td className="table-td"><span className="badge-blue">{item.category?.name}</span></td>
                      <td className="table-td text-center">
                        <span className={`font-bold ${item.available_quantity === 0 ? 'text-orange-600' : 'text-blue-600'}`}>
                          {item.available_quantity}
                        </span>
                      </td>
                      <td className="table-td text-center text-gray-500">{item.min_stock_level}</td>
                      <td className="table-td text-center text-orange-600 font-semibold">-{shortage}</td>
                      <td className="table-td text-center">
                        <span className={`badge ${urgency === 'medium' ? 'badge-blue' : 'badge-orange'}`}>
                          {urgency}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, PackagePlus, ArrowRightLeft, History,
  RotateCcw, Boxes, BarChart3, AlertTriangle, Users, Building2,
  UserSquare2, Wrench, ClipboardList, FileBarChart, Settings,
  Bell, Shield, ChevronDown, ChevronRight, HelpCircle, MessageSquare, Headphones, ArrowRight,
  Tag, UserCog
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, to: '/' },
  {
    label: 'Assets', icon: <Package size={18} />,
    children: [
      { label: 'All Assets', icon: <Package size={16} />, to: '/assets' },
      { label: 'Add New Asset', icon: <PackagePlus size={16} />, to: '/assets/add' },
      { label: 'Assign Asset', icon: <ArrowRightLeft size={16} />, to: '/assets/assign' },
      { label: 'Asset History', icon: <History size={16} />, to: '/assets/history' },
      { label: 'Return Asset', icon: <RotateCcw size={16} />, to: '/assets/return' },
    ],
  },
  {
    label: 'Inventory', icon: <Boxes size={18} />,
    children: [
      { label: 'Inventory Items', icon: <Boxes size={16} />, to: '/inventory' },
      { label: 'Stock Overview', icon: <BarChart3 size={16} />, to: '/inventory/stock' },
      { label: 'Low Stock Items', icon: <AlertTriangle size={16} />, to: '/inventory/low-stock' },
    ],
  },
  {
    label: 'Employees', icon: <Users size={18} />,
    children: [
      { label: 'All Employees', icon: <Users size={16} />, to: '/employees' },
      { label: 'Departments', icon: <Building2 size={16} />, to: '/employees/departments' },
      { label: 'Employee Asset Details', icon: <UserSquare2 size={16} />, to: '/employees/assets' },
    ],
  },
  {
    label: 'Maintenance', icon: <Wrench size={18} />,
    children: [
      { label: 'Maintenance Requests', icon: <ClipboardList size={16} />, to: '/maintenance' },
      { label: 'Service History', icon: <History size={16} />, to: '/maintenance/history' },
    ],
  },
  {
    label: 'Reports', icon: <FileBarChart size={18} />,
    children: [
      { label: 'Asset Reports', icon: <FileBarChart size={16} />, to: '/reports/assets' },
      { label: 'Employee Reports', icon: <Users size={16} />, to: '/reports/employees' },
      { label: 'Inventory Reports', icon: <Boxes size={16} />, to: '/reports/inventory' },
      { label: 'Assignment Reports', icon: <ArrowRightLeft size={16} />, to: '/reports/assignments' },
    ],
  },
  {
    label: 'Settings', icon: <Settings size={18} />,
    children: [
      { label: 'General Settings', icon: <Settings size={16} />, to: '/settings' },
      { label: 'Categories', icon: <Tag size={16} />, to: '/settings/categories' },
      { label: 'Notifications', icon: <Bell size={16} />, to: '/settings/notifications' },
      { label: 'User Management', icon: <UserCog size={16} />, to: '/settings/users' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen } = useApp();
  const [expanded, setExpanded] = useState<string[]>(['Assets', 'Inventory', 'Employees']);

  const toggle = (label: string) => {
    setExpanded(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const isChildActive = (children: NavItem[]) =>
    children.some(c => c.to && location.pathname === c.to);

  if (!sidebarOpen) return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-[#0b2854] flex flex-col z-30 overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <img
          src="/gs1-saudi-arabia.png"
          alt="GS1 Saudi Arabia"
          className="w-full h-[74px] rounded-xl bg-white p-1 object-contain"
        />
        <div className="mt-1 text-center text-blue-200 text-xs leading-tight">Asset Management</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
        {navItems.map((item) => {
          if (!item.children) {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.label}
                to={item.to!}
                end
                className={`sidebar-link mb-0.5 ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            );
          }

          const isOpen = expanded.includes(item.label);
          const hasActive = isChildActive(item.children);

          return (
            <div key={item.label} className="mb-0.5">
              <button
                onClick={() => toggle(item.label)}
                className={`sidebar-link w-full ${hasActive ? 'text-white bg-white/10' : ''}`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {isOpen
                  ? <ChevronDown size={14} className="text-blue-200" />
                  : <ChevronRight size={14} className="text-blue-200" />
                }
              </button>
              {isOpen && (
                <div className="mt-0.5 space-y-0.5">
                  {item.children.map(child => (
                    <NavLink
                      key={child.label}
                      to={child.to!}
                      end
                      className={`sidebar-link-child ${location.pathname === child.to ? 'active' : ''}`}
                    >
                      {child.icon}
                      <span>{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="px-3 pb-4">
        <div className="bg-blue-900/60 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Headphones size={18} className="text-white" />
            </div>
            <div>
              <div className="text-white text-xs font-semibold">Need Help?</div>
              <div className="text-blue-200 text-xs">Contact Support</div>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-blue-100 text-xs hover:text-white transition-colors">
            <MessageSquare size={12} />
            <span>Open Support Ticket</span>
            <ArrowRight size={12} className="ml-auto" />
          </button>
        </div>
        <div className="mt-3 text-center text-blue-200 text-xs">
          © 2026 GS1 Saudi Arabia<br />
          Asset Management v1.0
        </div>
      </div>
    </aside>
  );
}

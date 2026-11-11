import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getInitials, avatarColor } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const { globalSearch, setGlobalSearch, setSidebarOpen, sidebarOpen } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('gs1_read_notifications') || '[3,4]') as number[]; }
    catch { return [3, 4]; }
  });
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifications = [
    { id: 1, title: 'Low Stock Alert', msg: 'Printer HP LaserJet below min stock level', time: '2h ago', type: 'warning' },
    { id: 2, title: 'Asset Overdue', msg: 'AST-0002 expected return date passed', time: '5h ago', type: 'error' },
    { id: 3, title: 'Maintenance Scheduled', msg: 'HP LaserJet maintenance scheduled', time: '1d ago', type: 'info' },
    { id: 4, title: 'New Asset Added', msg: 'Dell Latitude 5540 added to inventory', time: '2d ago', type: 'success' },
  ];
  const unreadCount = notifications.filter(n => !readNotifications.includes(n.id)).length;
  const markAllRead = () => {
    const ids = notifications.map(n => n.id);
    setReadNotifications(ids);
    localStorage.setItem('gs1_read_notifications', JSON.stringify(ids));
  };
  const markRead = (id: number) => {
    const ids = [...new Set([...readNotifications, id])];
    setReadNotifications(ids);
    localStorage.setItem('gs1_read_notifications', JSON.stringify(ids));
  };

  return (
    <header className={`fixed top-0 right-0 h-[74px] bg-white border-b border-blue-100 flex items-center px-6 gap-4 z-20 shadow-sm transition-all duration-300 ${sidebarOpen ? 'left-[220px]' : 'left-0'}`}>
      {/* Menu toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-lg hover:bg-gray-100"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets, users, or serial number..."
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && globalSearch.trim()) navigate('/assets'); }}
            className="w-full pl-11 pr-4 py-3 bg-blue-50/70 border border-blue-100 rounded-full text-sm text-blue-900 placeholder:text-blue-700/70 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto" ref={profileRef}>
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-medium leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                <button onClick={markAllRead} className="text-xs text-primary-600 font-medium hover:underline">Mark all read</button>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <button key={n.id} onClick={() => markRead(n.id)} className={`flex w-full text-left gap-3 px-4 py-3 hover:bg-gray-50 ${!readNotifications.includes(n.id) ? 'bg-primary-50/30' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      n.type === 'warning' ? 'bg-orange-400' :
                      n.type === 'error' ? 'bg-orange-500' :
                      n.type === 'success' ? 'bg-blue-500' : 'bg-blue-500'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-gray-800">{n.title}</div>
                      <div className="text-xs text-gray-500 truncate">{n.msg}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{n.time}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button
                  onClick={() => { navigate('/settings/notifications'); setNotifOpen(false); }}
                  className="text-xs text-primary-600 hover:underline font-medium"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full ${avatarColor(user?.full_name || 'Admin')} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {getInitials(user?.full_name || 'Admin')}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-semibold text-gray-800 leading-tight">{user?.full_name}</div>
              <div className="text-xs text-gray-500 capitalize leading-tight">
                {user?.role?.replace('_', ' ')}
              </div>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="font-semibold text-sm text-gray-800">{user?.full_name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={15} className="text-gray-400" />
                  My Profile
                </button>
                <button
                  onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={15} className="text-gray-400" />
                  Settings
                </button>
              </div>
              <div className="py-1 border-t border-gray-100">
                <button
                  onClick={() => { logout(); setProfileOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 transition-colors"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

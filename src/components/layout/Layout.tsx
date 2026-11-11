import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';

export default function Layout() {
  const { sidebarOpen } = useApp();

  return (
    <div className="flex h-screen bg-[#f2f7ff] overflow-hidden">
      <Sidebar />
      <div className={`app-workspace flex flex-col flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? 'ml-[220px]' : 'ml-0'}`}>
        <Header />
        <main className="flex-1 overflow-y-auto pt-[74px]">
          <div className="px-4 py-6 xl:px-[30px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

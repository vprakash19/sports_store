import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({ children, activePageTitle = 'Dashboard' }) {
  const { adminUser, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: Users
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBag
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#1e293b] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-amber-400" />
          <span className="font-black text-sm tracking-tight">
            SPORTS<span className="text-amber-400">STORE</span> ADMIN
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 rounded bg-slate-700 text-slate-200"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between z-50 transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo & Header */}
          <div className="p-5 border-b border-slate-200 bg-[#1e293b] text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-inner shrink-0">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight leading-tight">
                  SPORTS<span className="text-amber-400">STORE</span>
                </h1>
                <span className="inline-block text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                  Admin Console
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-2">
              Management
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-800 border-l-4 border-amber-500 shadow-2xs font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
          {/* Admin Profile Box */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white font-black text-xs flex items-center justify-center shrink-0">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{adminUser?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-500 truncate">{adminUser?.email || 'admin@sportsstore.com'}</p>
            </div>
          </div>

          {/* Quick links: Storefront & Logout */}
          <div className="space-y-1">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition"
            >
              <ExternalLink size={15} />
              <span>Customer Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition text-left"
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 hidden md:flex items-center justify-between sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-black text-[#1e293b] tracking-tight">{activePageTitle}</h2>
            <p className="text-xs text-slate-500">Real-time store management & live database metrics</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Database Connected
            </span>
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#1e293b] hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl transition shadow-xs"
            >
              <ExternalLink size={14} />
              <span>Visit Shop</span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

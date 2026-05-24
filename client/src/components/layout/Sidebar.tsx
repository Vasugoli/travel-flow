import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  Compass,
  Package,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Vehicles', path: '/vehicles', icon: Truck },
    { name: 'Drivers', path: '/drivers', icon: Users },
    { name: 'Trips', path: '/trips', icon: Compass },
    { name: 'Deliveries', path: '/deliveries', icon: Package },
  ];

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-20 flex w-64 flex-col border-r border-gray-200/50 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200/50 px-6 dark:border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-md shadow-purple-500/30">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Transport<span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Flow</span>
          </span>
        </div>
      </div>

      {/* Roster Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-600 shadow-sm border border-purple-500/10 dark:text-purple-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Footer Profile */}
      <div className="border-t border-gray-200/50 p-4 dark:border-gray-800/50">
        <div className="flex items-center gap-3 rounded-2xl bg-gray-50/50 p-3 dark:bg-gray-800/30">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
            <span className="font-semibold">{user?.name.charAt(0).toUpperCase()}</span>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-gray-900"></span>
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </h4>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              <ShieldCheck className="h-3 w-3 text-purple-500" />
              <span className="capitalize">{user?.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            title="Log Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

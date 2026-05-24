import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Shield } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Dynamically calculate page title from routing path
  const getPageTitle = (): string => {
    switch (location.pathname) {
      case '/':
        return 'Overview Dashboard';
      case '/vehicles':
        return 'Vehicle Management';
      case '/drivers':
        return 'Driver Management';
      case '/trips':
        return 'Trip Scheduling';
      case '/deliveries':
        return 'Delivery Orders';
      default:
        return 'TransportFlow';
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-gray-200/50 bg-white/70 px-8 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white my-0">
          {getPageTitle()}
        </h1>
        <p className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
          Manage logistics, track compliance, and dispatch routes in real-time.
        </p>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-4">
        {/* Search Mock */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets, trips..."
            className="w-60 rounded-xl border border-gray-200/60 bg-gray-50/50 py-1.5 pl-10 pr-4 text-xs outline-none transition-all focus:border-purple-500 focus:bg-white dark:border-gray-800 dark:bg-gray-950/30 dark:focus:border-purple-400 dark:focus:bg-gray-950"
          />
        </div>

        {/* Notifications Mock */}
        <button className="relative rounded-xl border border-gray-200/60 p-2 text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800/50">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-purple-600 ring-2 ring-white dark:ring-gray-900"></span>
        </button>

        {/* Role Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-purple-500/10 bg-purple-500/5 px-3 py-1.5 text-purple-600 dark:text-purple-400">
          <Shield className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold capitalize tracking-wider">
            {user?.role} Access
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

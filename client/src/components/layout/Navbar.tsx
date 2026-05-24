import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  // Dynamically calculate page title from routing path
  const getPageTitle = (): string => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/vehicles':
        return 'Vehicles';
      case '/drivers':
        return 'Drivers';
      case '/trips':
        return 'Trips';
      case '/deliveries':
        return 'Deliveries';
      default:
        return 'TransportFlow';
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Page Title */}
      <h1 className="font-display font-bold text-2xl text-text-primary tracking-tight my-0">
        {getPageTitle()}
      </h1>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={15} />
          <input
            className="bg-elevated border border-border rounded-lg pl-9 pr-4 py-2
                       text-sm text-text-primary placeholder:text-text-tertiary
                       focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                       w-56 transition-all duration-150"
            placeholder="Search..."
          />
        </div>

        {/* Notification Bell */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center
                           text-text-secondary hover:bg-hover hover:text-text-primary
                           transition-colors duration-150 cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* Dynamic Date */}
        <span className="text-xs text-text-secondary hidden lg:block">
          {todayFormatted}
        </span>
      </div>
    </header>
  );
};

export default Navbar;

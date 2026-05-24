import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Package,
  LogOut,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', path: '/vehicles', icon: Truck },
    { name: 'Drivers', path: '/drivers', icon: Users },
    { name: 'Trips', path: '/trips', icon: Route },
    { name: 'Deliveries', path: '/deliveries', icon: Package },
  ];

  return (
    <aside className="w-60 shrink-0 fixed top-0 left-0 h-screen bg-surface border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Truck className="text-canvas" size={18} />
        </div>
        <span className="font-display font-bold text-xl text-text-primary tracking-tight">
          TransportFlow
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary px-2 mb-3">
          Main
        </p>

        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 h-11 rounded-lg mb-1 font-medium text-sm transition-colors duration-150 cursor-pointer ${
                isActive
                  ? 'bg-primary-muted border-l-[3px] border-primary text-primary'
                  : 'text-text-secondary hover:bg-hover hover:text-text-primary'
              }`
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-canvas font-bold text-sm shrink-0 uppercase">
            {user?.name.slice(0, 2) || 'TF'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
            <p className="text-xs text-text-secondary capitalize truncate">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

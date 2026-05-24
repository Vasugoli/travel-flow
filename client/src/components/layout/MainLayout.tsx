import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Fixed Sidebar navigation */}
      <Sidebar />

      {/* Main Shifted Wrapper */}
      <div className="pl-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Sticky top header navbar */}
        <Navbar />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

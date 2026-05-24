import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-canvas text-text-primary">
      {/* Fixed Sidebar navigation */}
      <Sidebar />

      {/* Main Shifted Wrapper */}
      <main className="ml-60 flex-1 flex flex-col min-h-screen">
        {/* Sticky top header navbar */}
        <Navbar />

        {/* Dynamic Route Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

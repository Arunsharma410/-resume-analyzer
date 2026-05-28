// frontend/src/layouts/DashboardLayout.jsx
// 📊 Layout wrapper for all dashboard pages (with sidebar)

import { Outlet } from 'react-router-dom';
import Sidebar from '@components/layout/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen">
      {/* 📑 Persistent Sidebar */}
      <Sidebar />

      {/* 📄 Main Content (offset by sidebar width) */}
      <main className="ml-20 lg:ml-64 transition-all duration-300">
        <div className="min-h-screen p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
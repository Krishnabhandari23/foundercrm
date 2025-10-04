import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const { dashboardType } = useDashboard();

  // Preserve dashboard state in localStorage on navigation
  React.useEffect(() => {
    if (dashboardType) {
      localStorage.setItem('lastDashboardType', dashboardType);
    }
  }, [location.pathname, dashboardType]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
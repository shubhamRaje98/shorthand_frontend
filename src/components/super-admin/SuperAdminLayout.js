import React from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminNavbar from './SuperAdminNavbar';

const SuperAdminLayout = () => {
  return (
    <div className="super-admin-layout">
      <SuperAdminNavbar />
      <main className="super-admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;
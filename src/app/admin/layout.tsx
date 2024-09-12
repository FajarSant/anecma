"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from './components/sidebar'; // Adjust the import path as needed
import TopBar from './components/topbar'; // Adjust the import path as needed
import { usePathname } from 'next/navigation'; // For App Router

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname(); // Get the current path

  // Extract user information if needed (mocked here for demonstration)
  const userName = "User Name"; // Replace with dynamic user data if available
  const userImage = "/images/bidan.png"; // Replace with dynamic user image if available

  return (
    <div className="flex h-screen flex-col">
      {/* Sidebar with current path */}
      <Sidebar currentPath={pathname} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64  overflow-hidden">
      <div className='p-4 bg-gray-100'>
        <TopBar title={getTitle(pathname)} userName={userName} userImage={userImage} />
      </div>
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

// Function to get the title based on the current path
const getTitle = (pathname: string) => {
  switch (pathname) {
    case '/admin/dashboard':
      return 'Data Ibu Hamil';
    case '/admin/puskesmas':
      return 'Data Puskesmas';
    case '/admin/petugas':
      return 'Data Petugas';
    case '/admin/settings':
      return 'Settings';
    default:
      return 'Admin Panel';
  }
};

export default Layout;

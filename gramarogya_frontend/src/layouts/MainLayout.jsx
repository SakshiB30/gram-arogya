import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const MainLayout = () => {
  return (
    <div className="flex h-screen w-full bg-slate-50">
      
      {/* Sidebar stays fixed */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top navbar */}
        <Navbar />

        {/* Page content renders here */}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;
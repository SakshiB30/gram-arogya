import React from "react";
import { Outlet } from "react-router-dom";

const HealthRecordsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Outlet />
    </div>
  );
};

export default HealthRecordsPage;
import React from "react";
import { Outlet } from "react-router-dom";

const HealthRecordsPage = () => {
  return (
    <div className="container-fluid p-4">
      <Outlet />
    </div>
  );
};

export default HealthRecordsPage;
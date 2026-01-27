import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/user-management" className="p-4 bg-white shadow rounded">
          User Management
        </Link>
        <Link to="/student-data" className="p-4 bg-white shadow rounded">
          Student Data Management
        </Link>
        <Link to="/advisor-management" className="p-4 bg-white shadow rounded">
          Advisor Management
        </Link>
        <Link to="/risk-monitoring" className="p-4 bg-white shadow rounded">
          Risk Monitoring & Reports
        </Link>
        <Link to="/configuration" className="p-4 bg-white shadow rounded">
          Configuration Management
        </Link>
        <Link to="/notifications" className="p-4 bg-white shadow rounded">
          Notifications & Alerts
        </Link>
        <Link to="/security-compliance" className="p-4 bg-white shadow rounded">
          Security & Compliance
        </Link>
        <Link to="/maintenance" className="p-4 bg-white shadow rounded">
          Maintenance
        </Link>
        <Link to="/troubleshooting" className="p-4 bg-white shadow rounded">
          Troubleshooting & Support
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
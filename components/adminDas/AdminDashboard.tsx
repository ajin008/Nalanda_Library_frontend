// components/dashboard/AdminDashboard.tsx
"use client";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import MetricsSection from "./MetricsSection";
import AggregationReport from "./AggregationReport";
import ManagementControls from "./ManagementControls";
import BookManagement from "./BookManagement";
import UserManagement from "./UserManagement";

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("overview");

  // Remove the hardcoded metricsData and topBooks since they're now dynamic
  // const metricsData = { ... };
  // const topBooks = [ ... ];

  const renderContent = () => {
    switch (activeMenu) {
      case "overview":
        return (
          <>
            {/* MetricsSection now fetches its own data */}
            <MetricsSection />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* AggregationReport now fetches its own data */}
                <AggregationReport />
              </div>
              <div className="lg:col-span-1">
                <ManagementControls />
              </div>
            </div>
          </>
        );
      case "books":
        return <BookManagement />;
      case "users":
        return <UserManagement />;
      case "reports":
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="text-gray-400 text-lg">Reports Section</div>
            <div className="text-gray-500 text-sm mt-2">
              Analytics and reporting features coming soon...
            </div>
          </div>
        );
      default:
        return (
          <>
            <MetricsSection />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AggregationReport />
              </div>
              <div className="lg:col-span-1">
                <ManagementControls />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <AdminTopBar />

          {/* Main Content Area */}
          <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              {activeMenu === "overview" && (
                <div className="mb-2">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    System Overview 📊
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Library management dashboard
                  </p>
                </div>
              )}

              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

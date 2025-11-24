// components/dashboard/UserDashboard.tsx
"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import StatusCards from "./StatusCards";
import BorrowedBooksList from "./BorrowedBooksList";
import Profile from "./Profile";
import BrowseBooks from "./BrowseBooks";
import BorrowHistory from "./BrowseHistory";
import { useUserStore } from "@/app/lib/store/userStore";

export default function UserDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const { user } = useUserStore();

  // Remove the borrowedBooks array since BorrowedBooksList now fetches its own data
  // const borrowedBooks = [ ... ];

  // Render different content based on active menu
  const renderMainContent = () => {
    switch (activeMenu) {
      case "profile":
        return <Profile />;

      case "browse":
        return <BrowseBooks />;

      case "history":
        return <BorrowHistory />; // Replace placeholder with actual component

      case "dashboard":
      default:
        return (
          <>
            {/* Welcome Section */}
            <div className="mb-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back, {user?.name || "User"}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here&apos;s your reading overview for today
              </p>
            </div>

            {/* Status Cards */}
            <StatusCards />

            {/* Borrowed Books Section - Full width */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Remove books prop since component fetches its own data */}
              <BorrowedBooksList
                onViewAllHistory={() => setActiveMenu("history")}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <TopBar />

          {/* Main Content Area */}
          <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

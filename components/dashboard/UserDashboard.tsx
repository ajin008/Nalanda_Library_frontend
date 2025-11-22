// components/dashboard/UserDashboard.tsx
"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import StatusCards from "./StatusCards";
import BorrowedBooksList from "./BorrowedBooksList";
import QuickActions from "./QuickActions";

export default function UserDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const statusData = {
    booksBorrowed: 3,
    nextDueDate: "Feb 15, 2024",
    totalBorrowed: 47,
    reservedBooks: 2,
  };

  const borrowedBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      dueDate: "Feb 15, 2024",
      isOverdue: false,
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      dueDate: "Feb 10, 2024",
      isOverdue: true,
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      dueDate: "Feb 20, 2024",
      isOverdue: false,
    },
  ];

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
              {/* Welcome Section */}
              <div className="mb-2">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome back, John! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's your reading overview for today
                </p>
              </div>

              {/* Status Cards */}
              <StatusCards data={statusData} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Borrowed Books Section */}
                <div className="lg:col-span-2">
                  <BorrowedBooksList books={borrowedBooks} />
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-1">
                  <QuickActions />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

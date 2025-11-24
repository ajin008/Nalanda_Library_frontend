// components/dashboard/ManagementControls.tsx
"use client";
import { useState } from "react";
import BookForm from "./BookFrom";

export default function ManagementControls() {
  const [showBookForm, setShowBookForm] = useState(false);

  const controls = [
    {
      title: "Add New Book",
      description: "Add new book to inventory",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      color: "emerald",
      onClick: () => setShowBookForm(true),
    },
    {
      title: "Active Members Report",
      description: "View member activity analytics",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: "blue",
      onClick: () => console.log("Members report"),
    },
    {
      title: "View Overdue Book List",
      description: "Check overdue returns",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "red",
      onClick: () => console.log("Overdue books"),
    },
  ];

  const getButtonClasses = (color: string) => {
    const colors = {
      emerald: "bg-emerald-600 hover:bg-emerald-700 border-emerald-600",
      blue: "bg-blue-600 hover:bg-blue-700 border-blue-600",
      red: "bg-red-600 hover:bg-red-700 border-red-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (showBookForm) {
    return (
      <BookForm
        onSuccess={() => setShowBookForm(false)}
        onCancel={() => setShowBookForm(false)}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Management Controls</h3>
      <div className="space-y-3">
        {controls.map((control, index) => (
          <button
            key={index}
            onClick={control.onClick}
            className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg border text-white font-medium transition-all duration-150 ${getButtonClasses(
              control.color
            )}`}
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              {control.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{control.title}</p>
              <p className="text-xs opacity-90">{control.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-600">New Members</p>
            <p className="font-semibold text-gray-900">12 this week</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-600">Overdue</p>
            <p className="font-semibold text-gray-900">8 books</p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    </div>
  );
}

// components/dashboard/AdminTopBar.tsx
"use client";
import { logoutAdmin } from "@/app/lib/api/auth";
import { useAuthStore } from "@/app/lib/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminTopBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await logoutAdmin();

      if (res.success) {
        clearUser();
        toast.success("Logged out successfully");
        router.replace("/admin/login");
      }
    } catch (err) {
      toast.error(`${err}`);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "A";
    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            System Overview
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Admin Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || "Administrator"}
              </p>
              <p className="text-xs text-gray-500">{user?.role || "Admin"}</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {getUserInitials()}
            </div>
          </div>

          {/* Logout Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

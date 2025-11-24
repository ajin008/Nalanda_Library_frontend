// components/dashboard/Profile.tsx
"use client";
import { useUserStore } from "@/app/lib/store/userStore";

export default function Profile() {
  const { user } = useUserStore();

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
            {user.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {user.name}
            </h1>
            <p className="text-gray-600 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{user.name}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

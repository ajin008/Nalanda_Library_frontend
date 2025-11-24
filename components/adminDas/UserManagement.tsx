// components/dashboard/UserManagement.tsx
"use client";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "member" | "admin" | "librarian";
  joinDate: string;
  borrowedBooks: number;
  status: "active" | "suspended" | "inactive";
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Dummy users data
  const users: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "member",
      joinDate: "2023-05-15",
      borrowedBooks: 3,
      status: "active",
    },
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      role: "admin",
      joinDate: "2022-01-10",
      borrowedBooks: 0,
      status: "active",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      role: "member",
      joinDate: "2023-11-20",
      borrowedBooks: 7,
      status: "active",
    },
    {
      id: "4",
      name: "Emily Chen",
      email: "emily.chen@example.com",
      role: "librarian",
      joinDate: "2023-03-08",
      borrowedBooks: 1,
      status: "active",
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.brown@example.com",
      role: "member",
      joinDate: "2022-08-30",
      borrowedBooks: 12,
      status: "suspended",
    },
    {
      id: "6",
      name: "Lisa Garcia",
      email: "lisa.garcia@example.com",
      role: "member",
      joinDate: "2024-01-05",
      borrowedBooks: 0,
      status: "inactive",
    },
  ];

  const roles = ["all", "member", "admin", "librarian"];
  const statuses = ["all", "active", "suspended", "inactive"];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "librarian":
        return "bg-purple-100 text-purple-800";
      case "member":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-600 mt-1">Manage library members and staff</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Users
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Role
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "all"
                    ? "All Roles"
                    : role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {users.length}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.status === "active").length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrowed Books
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {user.borrowedBooks}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                        {user.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No users found</div>
            <div className="text-gray-500 text-sm mt-1">
              Try adjusting your search or filters
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

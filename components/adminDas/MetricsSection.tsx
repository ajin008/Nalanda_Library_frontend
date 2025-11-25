// components/dashboard/MetricsSection.tsx
"use client";
import { useState, useEffect } from "react";
import { getAdminStatsAPI } from "@/app/lib/api/admin";

interface AdminStats {
  totalBooks: number;
  totalInventory: number;
  borrowedCount: number;
  availableCopies: number;
  membersCount: number;
}

export default function MetricsSection() {
  const [stats, setStats] = useState<AdminStats>({
    totalBooks: 0,
    totalInventory: 0,
    borrowedCount: 0,
    availableCopies: 0,
    membersCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getAdminStatsAPI();

      if (res.success) {
        setStats({
          totalBooks: res.stats.totalBooks || 0,
          totalInventory: res.stats.totalInventory || 0,
          borrowedCount: res.stats.borrowedCount || 0,
          availableCopies: res.stats.availableCopies || 0,
          membersCount: res.stats.membersCount || 0,
        });
      } else {
        setError("Failed to fetch admin statistics");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch admin statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Book Inventory",
      value: stats.totalInventory.toLocaleString(),
      description: "All titles & copies",
      icon: "📚",
      color: "blue",
    },
    {
      title: "Currently Borrowed",
      value: stats.borrowedCount,
      description: "Requires Return Action",
      icon: "📖",
      color: "amber",
    },
    {
      title: "Available Copies",
      value: stats.availableCopies.toLocaleString(),
      description: "Ready for Borrowing",
      icon: "✅",
      color: "emerald",
    },
    {
      title: "Registered Members",
      value: stats.membersCount,
      description: "Includes both Admins & Members",
      icon: "👥",
      color: "violet",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      amber: "from-amber-500 to-amber-600",
      emerald: "from-emerald-500 to-emerald-600",
      violet: "from-violet-500 to-violet-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-16"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <div className="text-4xl mb-2">❌</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Statistics
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 mb-2">
                {card.value}
              </p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
            <div
              className={`w-12 h-12 bg-linear-to-br ${getColorClasses(
                card.color
              )} rounded-lg flex items-center justify-center text-white text-lg`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

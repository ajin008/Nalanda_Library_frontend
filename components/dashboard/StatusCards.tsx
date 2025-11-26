// components/dashboard/StatusCards.tsx
"use client";
import { useState, useEffect } from "react";
import { getBorrowStats } from "@/app/lib/api/books";

export default function StatusCards() {
  const [stats, setStats] = useState({
    totalBorrowedCount: 0,
    totalReturnedCount: 0,
    totalReadCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getBorrowStats();

      if (res.success) {
        setStats({
          totalBorrowedCount: res.totalBorrowedCount || 0,
          totalReturnedCount: res.totalReturnedCount || 0,
          totalReadCount: res.totalReadCount || 0,
        });
      } else {
        setError("Failed to fetch statistics");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Books Borrowed",
      value: stats.totalBorrowedCount,
      description: "Currently with you",
      trend: "Active borrows",
      icon: "📚",
      color: "blue",
    },
    {
      title: "Total Read",
      value: stats.totalReadCount,
      description: "All time books",
      trend: "Books completed",
      icon: "📖",
      color: "violet",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      violet: "from-violet-500 to-violet-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20 mt-1"></div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <p className="text-xs text-gray-400 mt-1">{card.trend}</p>
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

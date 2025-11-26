// components/dashboard/BrowseHistory.tsx
"use client";
import { getBorrowHistory } from "@/app/lib/api/books";
import { useState, useEffect } from "react";

interface HistoryItem {
  _id: string;
  userId: string;
  bookId: {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    genre: string;
    copies: number;
  };
  status: "borrowed" | "returned";
  borrowDate: string; // Changed from borrowedAt
  returnedAt: string | null;
  __v: number;
}

export default function BrowseHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "borrowed" | "returned">("all");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching borrow history...");
      const res = await getBorrowHistory();
      console.log("API Response:", res);

      if (res.success) {
        // Reverse the array to show latest first
        const reversedHistory = (res.history || []).reverse();
        setHistory(reversedHistory);
        console.log("History data set successfully, reversed order");
      } else {
        const errorMessage = res.message || "Failed to fetch borrow history";
        setError(errorMessage);
        setHistory([]);
        console.error("API returned error:", errorMessage);
      }
    } catch (err) {
      console.error("Error fetching history:", err);

      if (err instanceof SyntaxError) {
        setError(
          "Server returned invalid JSON response. Please check the API endpoint."
        );
      } else if (err instanceof TypeError) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to fetch borrow history"
        );
      }
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Calculate duration between borrow and return
  const calculateDuration = (borrowDate: string, returnedAt: string | null) => {
    try {
      if (!borrowDate) return "N/A";

      const borrow = new Date(borrowDate);
      const return_ = returnedAt ? new Date(returnedAt) : new Date();

      // Check if dates are valid
      if (isNaN(borrow.getTime())) return "N/A";
      if (returnedAt && isNaN(return_.getTime())) return "N/A";

      const diffTime = Math.abs(return_.getTime() - borrow.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    } catch {
      return "N/A";
    }
  };

  // Filter history based on selected filter
  const filteredHistory = history.filter((item) => {
    switch (filter) {
      case "borrowed":
        return item.status === "borrowed";
      case "returned":
        return item.status === "returned";
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Borrow History
          </h1>
          <p className="text-gray-600">Your complete borrowing timeline</p>
        </div>

        {/* Loading State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Loading borrow history...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Borrow History
          </h1>
          <p className="text-gray-600">Your complete borrowing timeline</p>
        </div>

        {/* Error State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading History
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchHistory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/dashboard?menu=browse")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Browse Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Borrow History
            </h1>
            <p className="text-gray-600">
              Your complete borrowing timeline - {history.length} items (Newest
              first)
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                filter === "all"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("borrowed")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                filter === "borrowed"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Borrowed
            </button>
            <button
              onClick={() => setFilter("returned")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                filter === "returned"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Returned
            </button>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {history.length === 0 ? "No Borrow History" : "No Items Found"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {history.length === 0
                ? "You haven't borrowed any books yet. Start exploring our collection!"
                : `No ${filter} items found. Try changing the filter.`}
            </p>
            {history.length === 0 && (
              <button
                onClick={() =>
                  (window.location.href = "/dashboard?menu=browse")
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse Books
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredHistory.map((item) => (
              <div
                key={item._id}
                className="p-6 hover:bg-gray-50/50 transition-colors duration-150 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Book Icon */}
                    <div
                      className={`w-12 h-14 rounded-lg border flex items-center justify-center shrink-0 ${
                        item.status === "borrowed"
                          ? "bg-blue-100 border-blue-200 text-blue-600"
                          : "bg-green-100 border-green-200 text-green-600"
                      }`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>

                    {/* Book Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {item.bookId.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        by {item.bookId.author}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "borrowed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.status === "borrowed"
                            ? "Currently Borrowed"
                            : "Returned"}
                        </span>

                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                          {item.bookId.genre}
                        </span>

                        <div className="flex items-center space-x-1 text-gray-500">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>Borrowed: {formatDate(item.borrowDate)}</span>
                        </div>

                        {item.returnedAt && (
                          <div className="flex items-center space-x-1 text-gray-500">
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Returned: {formatDate(item.returnedAt)}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-1 text-gray-500">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {calculateDuration(
                              item.borrowDate,
                              item.returnedAt
                            )}
                          </span>
                        </div>

                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          ISBN: {item.bookId.isbn}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

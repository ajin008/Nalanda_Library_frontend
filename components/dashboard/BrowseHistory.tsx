// components/dashboard/BrowseHistory.tsx
"use client";
import { useState } from "react";

// Mock data for browsing history
const mockBrowseHistory = [
  {
    id: 1,
    bookTitle: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    viewedAt: "2024-02-20T10:30:00Z",
    duration: "5 minutes",
  },
  {
    id: 2,
    bookTitle: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    viewedAt: "2024-02-19T15:45:00Z",
    duration: "3 minutes",
  },
  {
    id: 3,
    bookTitle: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    viewedAt: "2024-02-18T09:15:00Z",
    duration: "7 minutes",
  },
  {
    id: 4,
    bookTitle: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    viewedAt: "2024-02-17T14:20:00Z",
    duration: "4 minutes",
  },
  {
    id: 5,
    bookTitle: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    viewedAt: "2024-02-16T11:00:00Z",
    duration: "6 minutes",
  },
];

export default function BrowseHistory() {
  const [history, setHistory] = useState(mockBrowseHistory);
  const [filter, setFilter] = useState("all");

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Remove single history item
  const handleRemoveItem = (id: number) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Browse History
            </h1>
            <p className="text-gray-600">
              Track the books you've recently viewed
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
              onClick={() => setFilter("recent")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                filter === "recent"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Recent
            </button>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {history.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Browse History
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your recently viewed books will appear here. Start exploring our
              collection to build your history!
            </p>
            <button
              onClick={() => (window.location.href = "/dashboard?menu=browse")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-6 hover:bg-gray-50/50 transition-colors duration-150 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Book Icon */}
                    <div className="w-12 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
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
                        {item.bookTitle}
                      </h3>
                      <p className="text-gray-600 mb-2">by {item.author}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {item.genre}
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{item.duration}</span>
                        </div>

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
                          <span>{formatDate(item.viewedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove from history"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>

                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View book details"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
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

// components/dashboard/AggregationReport.tsx
"use client";
import { useState, useEffect } from "react";
import { getMostBorrowedBooks } from "@/app/lib/api/admin";

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  copies: number;
  borrowCount: number;
}

export default function AggregationReport() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMostBorrowedBooks();
  }, []);

  const fetchMostBorrowedBooks = async () => {
    try {
      setLoading(true);
      const res = await getMostBorrowedBooks();
      console.log("Most borrowed books API Response:", res);

      if (res.success) {
        setBooks(res.report || []);
      } else {
        setError(res.message || "Failed to fetch most borrowed books");
      }
    } catch (err) {
      console.log("Error fetching most borrowed books:", err);
      setError("Error fetching most borrowed books");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Top Aggregation Report
              </h2>
              <p className="text-sm text-gray-600 mt-1">Most Borrowed Books</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Full Report →
            </button>
          </div>
        </div>

        {/* Loading State */}
        <div className="px-6 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading report...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Top Aggregation Report
              </h2>
              <p className="text-sm text-gray-600 mt-1">Most Borrowed Books</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Full Report →
            </button>
          </div>
        </div>

        {/* Error State */}
        <div className="px-6 py-8 text-center">
          <div className="text-4xl mb-2">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Report
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMostBorrowedBooks}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Top Aggregation Report
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Most Borrowed Books - {books.length} books
            </p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View Full Report →
          </button>
        </div>
      </div>

      {/* Books List */}
      <div className="divide-y divide-gray-100">
        {books.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Borrow Data Available
            </h3>
            <p className="text-gray-600">
              Borrowing statistics will appear here as users borrow books.
            </p>
          </div>
        ) : (
          books.map((book, index) => (
            <div
              key={book._id}
              className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank Number */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : index === 1
                        ? "bg-gray-100 text-gray-600"
                        : index === 2
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      by {book.author}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        {book.genre}
                      </span>
                      <span className="text-xs text-gray-500">
                        {book.copies} copies
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    {book.borrowCount}{" "}
                    {book.borrowCount === 1 ? "Borrow" : "Borrows"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

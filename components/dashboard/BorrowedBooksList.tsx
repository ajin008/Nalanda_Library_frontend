// components/dashboard/BorrowedBooksList.tsx
"use client";
import { useState, useEffect } from "react";
import { getCurrentBorrowed, returnBook } from "@/app/lib/api/books";
import { toast } from "sonner";

interface Book {
  _id: string;
  title: string;
  author: string;
  copies: number;
  genre: string;
}

interface BorrowRecord {
  _id: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  status: string;
  bookId: Book;
}

interface BorrowedBooksListProps {
  books?: Book[];
  onViewAllHistory?: () => void;
}

export default function BorrowedBooksList({
  books: propBooks,
  onViewAllHistory,
}: BorrowedBooksListProps) {
  const [books, setBooks] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returningBookId, setReturningBookId] = useState<string | null>(null);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const data = await getCurrentBorrowed();

      if (data.success) {
        setBooks(data.books || []);
      } else {
        setBooks([]);
        setError(data.message || "Failed to fetch borrowed books");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch borrowed books"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle return book
  const handleReturnBook = async (
    borrowRecordId: string,
    bookId: string,
    bookTitle: string
  ) => {
    try {
      setReturningBookId(borrowRecordId);

      const data = await returnBook(bookId);

      if (data.success) {
        toast.success(`Successfully returned "${bookTitle}"`);
        // Remove the returned book from the list
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book._id !== borrowRecordId)
        );
      } else {
        toast.error(data.message || "Failed to return book");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to return book");
    } finally {
      setReturningBookId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const isOverdue = (dueDate: string) => {
    try {
      return new Date(dueDate) < new Date();
    } catch {
      return false;
    }
  };

  const calculateDueDate = (borrowDate: string) => {
    try {
      const dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + 14);
      return dueDate.toISOString().split("T")[0];
    } catch {
      return borrowDate;
    }
  };

  const handleViewAllHistory = () => {
    if (onViewAllHistory) {
      onViewAllHistory();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Currently Borrowed
            </h2>
            <button
              onClick={handleViewAllHistory}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All History →
            </button>
          </div>
        </div>

        {/* Loading State */}
        <div className="px-6 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Loading borrowed books...
            </span>
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
            <h2 className="text-lg font-semibold text-gray-900">
              Currently Borrowed
            </h2>
            <button
              onClick={handleViewAllHistory}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All History →
            </button>
          </div>
        </div>

        {/* Error State */}
        <div className="px-6 py-8 text-center">
          <div className="text-4xl mb-2">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Books
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBorrowedBooks}
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
          <h2 className="text-lg font-semibold text-gray-900">
            Currently Borrowed ({books.length})
          </h2>
          <button
            onClick={handleViewAllHistory}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All History →
          </button>
        </div>
      </div>

      {/* Books List */}
      <div className="divide-y divide-gray-100">
        {books.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <div className="text-4xl mb-2">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Books Borrowed
            </h3>
            <p className="text-gray-600">
              You haven&apos;t borrowed any books yet.
            </p>
          </div>
        ) : (
          books.map((record) => {
            const dueDate = calculateDueDate(record.borrowDate);
            const overdue = isOverdue(dueDate);
            const isReturning = returningBookId === record._id;

            return (
              <div
                key={record._id}
                className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Book Icon */}
                    <div className="w-10 h-12 bg-linear-to-br from-gray-100 to-gray-200 rounded border flex items-center justify-center text-gray-400">
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
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">
                        {record.bookId.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        by {record.bookId.author}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`text-xs font-medium ${
                            overdue ? "text-red-600" : "text-gray-500"
                          }`}
                        >
                          Due {formatDate(dueDate)}
                        </span>
                        {overdue && (
                          <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Borrowed on {formatDate(record.borrowDate)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleReturnBook(
                        record._id,
                        record.bookId._id,
                        record.bookId.title
                      )
                    }
                    disabled={isReturning}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isReturning
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {isReturning ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                        <span>Returning...</span>
                      </div>
                    ) : (
                      "Return"
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

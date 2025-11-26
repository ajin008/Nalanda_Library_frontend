// components/dashboard/BookManagement.tsx
"use client";
import { getAllBooks, deleteBook } from "@/app/lib/api/books";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EditBookForm from "./EditBookForm";
import { DeleteBookGraphQl } from "@/app/lib/GraphQl/books";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  copies: number;
  available_copies?: number;
  publicationDate: string;
  publisher?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function BookManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBooks = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await getAllBooks(page, itemsPerPage);
      console.log("API Response:", res);

      if (res.success) {
        const booksData = res.books || [];
        console.log("Books data:", booksData);
        setBooks(booksData);
        setPagination({
          currentPage: res.currentPage || 1,
          totalPages: res.totalPages || 1,
          totalBooks: res.totalBooks || 0,
          hasNext: (res.currentPage || 1) < (res.totalPages || 1),
          hasPrev: (res.currentPage || 1) > 1,
        });
      } else {
        setError("Failed to fetch books");
      }
    } catch (err) {
      console.log("Error fetching books:", err);
      setError("Error fetching books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  // Handle page change
  useEffect(() => {
    if (currentPage > 1) {
      fetchBooks(currentPage);
    }
  }, [currentPage]);

  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(bookId);

      if (process.env.NEXT_PUBLIC_ENABLE_GRAPHQL) {
        const res = await DeleteBookGraphQl(bookId);

        if (res.data.deleteBook.success) {
          toast.success(`Book "${bookTitle}" deleted successfully`);
        } else {
          toast.error(res.data.deleteBook.message || "failed to delete book");
        }
        return;
      }
      const res = await deleteBook(bookId);

      if (res.success) {
        toast.success(`Book "${bookTitle}" deleted successfully`);
        // Refresh the current page
        fetchBooks(currentPage);
      } else {
        toast.error(res.message || "Failed to delete book");
      }
    } catch (err) {
      console.log("Error deleting book:", err);
      toast.error("Error deleting book");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditBook = (bookId: string) => {
    setEditingBookId(bookId);
  };

  const handleEditSuccess = () => {
    toast.success("Book updated successfully!");
    setEditingBookId(null);
    fetchBooks(currentPage); // Refresh the book list
  };

  const handleEditCancel = () => {
    setEditingBookId(null);
  };

  // Pagination controls
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(pagination.currentPage - 1)}
        disabled={!pagination.hasPrev}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
    );

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-2 text-sm font-medium border rounded-lg ${
            page === pagination.currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(pagination.currentPage + 1)}
        disabled={!pagination.hasNext}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    );

    return buttons;
  };

  // Extract unique genres from all books (you might want to fetch this separately)
  const genres = [
    "all",
    ...Array.from(new Set(books.map((book) => book.genre).filter(Boolean))),
  ];

  // Filter books based on search and genre (client-side filtering for current page)
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    const matchesGenre =
      selectedGenre === "all" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Calculate book status based on available copies
  const getBookStatus = (book: Book) => {
    const availableCopies = book.available_copies || book.copies;
    if (availableCopies === 0) {
      return "out-of-stock";
    } else if (availableCopies <= 2) {
      return "low-stock";
    } else {
      return "available";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "low-stock":
        return "Low Stock";
      case "out-of-stock":
        return "Out of Stock";
      default:
        return "Unknown";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // If editing, show the edit form
  if (editingBookId) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Book</h1>
            <p className="text-gray-600 mt-1">Update book details</p>
          </div>
          <button
            onClick={handleEditCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back to Book List
          </button>
        </div>
        <EditBookForm
          bookId={editingBookId}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Book Management
            </h1>
            <p className="text-gray-600 mt-1">Manage library book inventory</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="flex justify-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-600 mt-2">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Book Management
            </h1>
            <p className="text-gray-600 mt-1">Manage library book inventory</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-red-600 text-lg">Error loading books</div>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => fetchBooks(1)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Book Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage library book inventory - {pagination.totalBooks} total books
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Books
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Genre Filter */}
          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Genre
            </label>
            <select
              id="genre"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {pagination.totalBooks}
              </div>
              <div className="text-sm text-gray-600">Total Books</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  books.filter((book) => getBookStatus(book) === "available")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Copies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBooks.map((book) => {
                const status = getBookStatus(book);
                const availableCopies = book.available_copies || book.copies;

                return (
                  <tr
                    key={book._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {book.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {book.author}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ISBN: {book.isbn}
                        </div>
                        {book.publisher && (
                          <div className="text-xs text-gray-500">
                            Publisher: {book.publisher}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {book.genre || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {availableCopies}/{book.copies} available
                      </div>
                      {book.publicationDate && (
                        <div className="text-xs text-gray-500">
                          Published: {formatDate(book.publicationDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          status
                        )}`}
                      >
                        {getStatusText(status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(book.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBook(book._id)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book._id, book.title)}
                          disabled={deletingId === book._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center space-x-1"
                        >
                          {deletingId === book._id ? (
                            <>
                              <svg
                                className="animate-spin h-3 w-3 text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span>Deleting...</span>
                            </>
                          ) : (
                            <span>Delete</span>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {books.length === 0 ? "No books in library" : "No books found"}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              {books.length === 0
                ? "Start by adding some books to your library"
                : "Try adjusting your search or filters"}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8 pb-6">
            {renderPaginationButtons()}
          </div>
        )}
      </div>
    </div>
  );
}

// components/dashboard/BrowseBooks.tsx
"use client";
import { useState, useEffect } from "react";
import { getAllBooks, searchBooksAPI, borrowBook } from "@/app/lib/api/books";
import { toast } from "sonner";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  genre: string;
  copies: number;
  description?: string;
  publisher?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function BrowseBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [borrowingBookId, setBorrowingBookId] = useState<string | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search/filter changes
      if (searchTerm.trim() || selectedGenre !== "all") {
        handleSearch();
      } else {
        // If no search term and genre is "all", load all books
        fetchBooks(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedGenre]);

  // Initial load
  useEffect(() => {
    fetchBooks(1);
  }, []);

  // Handle page change
  useEffect(() => {
    if (currentPage > 1) {
      if (searchTerm.trim() || selectedGenre !== "all") {
        handleSearch();
      } else {
        fetchBooks(currentPage);
      }
    }
  }, [currentPage]);

  const fetchBooks = async (page: number) => {
    try {
      setLoading(true);
      const data = await getAllBooks(page, itemsPerPage);

      if (data.success) {
        setBooks(data.books || []);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalBooks: data.totalBooks,
          hasNext: data.currentPage < data.totalPages,
          hasPrev: data.currentPage > 1,
        });
      } else {
        setBooks([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalBooks: 0,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch books");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      const data = await searchBooksAPI(
        searchTerm,
        selectedGenre === "all" ? "" : selectedGenre
      );

      console.log("Search API response:", data);

      if (data.success) {
        // For search results, we'll handle pagination on frontend since search API might not support pagination
        const allBooks = data.books || [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedBooks = allBooks.slice(startIndex, endIndex);

        setBooks(paginatedBooks);
        setPagination({
          currentPage,
          totalPages: Math.ceil(allBooks.length / itemsPerPage),
          totalBooks: allBooks.length,
          hasNext: endIndex < allBooks.length,
          hasPrev: currentPage > 1,
        });
      } else {
        setBooks([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalBooks: 0,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search books");
      // Fallback to local filtering if search fails
      const data = await getAllBooks(1, 1000); // Get all books for local filtering
      if (data.success) {
        const allBooks = data.books || [];
        const filteredBooks = allBooks.filter((book: Book) => {
          const matchesSearch =
            !searchTerm ||
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesGenre =
            selectedGenre === "all" || book.genre === selectedGenre;

          return matchesSearch && matchesGenre;
        });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

        setBooks(paginatedBooks);
        setPagination({
          currentPage,
          totalPages: Math.ceil(filteredBooks.length / itemsPerPage),
          totalBooks: filteredBooks.length,
          hasNext: endIndex < filteredBooks.length,
          hasPrev: currentPage > 1,
        });
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Handle borrow book
  const handleBorrowBook = async (bookId: string, bookTitle: string) => {
    try {
      setBorrowingBookId(bookId);

      const data = await borrowBook(bookId);

      if (data.success) {
        toast.success(`Successfully borrowed "${bookTitle}"`);
        // Refresh the books list to update available copies
        if (searchTerm.trim() || selectedGenre !== "all") {
          handleSearch();
        } else {
          fetchBooks(currentPage);
        }
      } else {
        toast.error(data.message || "Failed to borrow book");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to borrow book");
    } finally {
      setBorrowingBookId(null);
    }
  };

  // Get unique genres for filter from all available books
  const [allGenres, setAllGenres] = useState<string[]>([]);

  useEffect(() => {
    // Load all genres for the filter dropdown
    const loadGenres = async () => {
      try {
        const data = await getAllBooks(1, 1000); // Get more books to have complete genre list
        if (data.success) {
          const genres = [
            "all",
            ...new Set(
              (data.books || []).map((book: Book) => book.genre).filter(Boolean)
            ),
          ] as string[];
          setAllGenres(genres);
        }
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    };

    loadGenres();
  }, []);

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

  // Determine book status based on copies available
  const getBookStatus = (copies: number): "available" | "borrowed" => {
    return copies > 0 ? "available" : "borrowed";
  };

  // Format publication date to show only year
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).getFullYear();
    } catch {
      return "N/A";
    }
  };

  const displayLoading = loading || isSearching;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Browse Books
        </h1>
        <p className="text-gray-600">
          Discover our collection of {pagination.totalBooks} books
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Books
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === "all" ? "All Genres" : genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Info */}
        {(searchTerm || selectedGenre !== "all") && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              {isSearching
                ? "Searching..."
                : `Showing results for: ${
                    searchTerm ? `"${searchTerm}"` : ""
                  } ${searchTerm && selectedGenre !== "all" ? "in" : ""} ${
                    selectedGenre !== "all" ? selectedGenre : ""
                  }`.trim()}
            </p>
          </div>
        )}
      </div>

      {/* Books Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {displayLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              {isSearching ? "Searching books..." : "Loading books..."}
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Books
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchBooks(1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedGenre !== "all"
                ? "No books found"
                : "No books available"}
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedGenre !== "all"
                ? "Try adjusting your search or filter criteria."
                : "There are no books in the library yet."}
            </p>
            {(searchTerm || selectedGenre !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGenre("all");
                  setCurrentPage(1);
                  fetchBooks(1);
                }}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Showing {books.length} of {pagination.totalBooks} books
                {pagination.totalPages > 1 &&
                  ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
              </h2>
              {(searchTerm || selectedGenre !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedGenre("all");
                    setCurrentPage(1);
                    fetchBooks(1);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => {
                const status = getBookStatus(book.copies);
                const isBorrowing = borrowingBookId === book._id;

                return (
                  <div
                    key={book._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Book Cover Placeholder */}
                    <div className="aspect-3/4 bg-linear-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-4xl text-blue-600">📖</div>
                    </div>

                    {/* Book Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        by {book.author}
                      </p>

                      {book.publisher && (
                        <p className="text-xs text-gray-500 mb-1">
                          {book.publisher}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mb-2">
                        Published: {formatDate(book.publicationDate)}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {book.genre}
                        </span>
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                          ISBN: {book.isbn}
                        </span>
                      </div>

                      {book.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                          {book.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              status === "available"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {status === "available"
                              ? `${book.copies} Available`
                              : "Out of Stock"}
                          </span>
                        </div>

                        {status === "available" && (
                          <button
                            onClick={() =>
                              handleBorrowBook(book._id, book.title)
                            }
                            disabled={isBorrowing}
                            className={`text-xs px-3 py-1 rounded transition-colors ${
                              isBorrowing
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {isBorrowing ? (
                              <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 border-t-2 border-white rounded-full animate-spin"></div>
                                <span>Borrowing...</span>
                              </div>
                            ) : (
                              "Borrow"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                {renderPaginationButtons()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// components/dashboard/BorrowedBooksList.tsx
interface Book {
  id: number;
  title: string;
  author: string;
  dueDate: string;
  isOverdue: boolean;
}

interface BorrowedBooksListProps {
  books: Book[];
}

export default function BorrowedBooksList({ books }: BorrowedBooksListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Currently Borrowed
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All History →
          </button>
        </div>
      </div>

      {/* Books List */}
      <div className="divide-y divide-gray-100">
        {books.map((book) => (
          <div
            key={book.id}
            className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Book Icon */}
                <div className="w-10 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded border flex items-center justify-center text-gray-400">
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
                  <h3 className="font-medium text-gray-900">{book.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{book.author}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`text-xs font-medium ${
                        book.isOverdue ? "text-red-600" : "text-gray-500"
                      }`}
                    >
                      Due {book.dueDate}
                    </span>
                    {book.isOverdue && (
                      <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150">
                Return
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

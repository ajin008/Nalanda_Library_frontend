// components/dashboard/AggregationReport.tsx
interface Book {
  title: string;
  author: string;
  borrows: number;
}

interface AggregationReportProps {
  books: Book[];
}

export default function AggregationReport({ books }: AggregationReportProps) {
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

      {/* Books List */}
      <div className="divide-y divide-gray-100">
        {books.map((book, index) => (
          <div
            key={index}
            className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Rank Number */}
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-sm font-semibold">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{book.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{book.author}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  {book.borrows} Borrows
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

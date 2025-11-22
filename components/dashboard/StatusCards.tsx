// components/dashboard/StatusCards.tsx
interface StatusCardsProps {
  data: {
    booksBorrowed: number;
    nextDueDate: string;
    totalBorrowed: number;
    reservedBooks: number;
  };
}

export default function StatusCards({ data }: StatusCardsProps) {
  const cards = [
    {
      title: "Books Borrowed",
      value: data.booksBorrowed,
      description: "Currently with you",
      trend: "+1 this month",
      icon: "📚",
      color: "blue",
    },
    {
      title: "Next Due Date",
      value: data.nextDueDate,
      description: "Upcoming return",
      trend: "The Great Gatsby",
      icon: "📅",
      color: "emerald",
    },
    {
      title: "Total Read",
      value: data.totalBorrowed,
      description: "All time books",
      trend: "47 books completed",
      icon: "📖",
      color: "violet",
    },
    {
      title: "Reserved",
      value: data.reservedBooks,
      description: "Waiting for pickup",
      trend: "Ready to collect",
      icon: "⏳",
      color: "amber",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      emerald: "from-emerald-500 to-emerald-600",
      violet: "from-violet-500 to-violet-600",
      amber: "from-amber-500 to-amber-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

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
              <p className="text-xs text-gray-400 mt-1">{card.trend}</p>
            </div>
            <div
              className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(
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

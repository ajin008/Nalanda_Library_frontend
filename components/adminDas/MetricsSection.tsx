// components/dashboard/MetricsSection.tsx
interface MetricsSectionProps {
  data: {
    totalBooks: number;
    borrowedBooks: number;
    availableBooks: number;
    totalMembers: number;
  };
}

export default function MetricsSection({ data }: MetricsSectionProps) {
  const cards = [
    {
      title: "Total Book Inventory",
      value: data.totalBooks.toLocaleString(),
      description: "All titles & copies",
      icon: "📚",
      color: "blue",
    },
    {
      title: "Currently Borrowed",
      value: data.borrowedBooks,
      description: "Requires Return Action",
      icon: "📖",
      color: "amber",
    },
    {
      title: "Available Copies",
      value: data.availableBooks.toLocaleString(),
      description: "Ready for Borrowing",
      icon: "✅",
      color: "emerald",
    },
    {
      title: "Registered Members",
      value: data.totalMembers,
      description: "Includes both Admins & Members",
      icon: "👥",
      color: "violet",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      amber: "from-amber-500 to-amber-600",
      emerald: "from-emerald-500 to-emerald-600",
      violet: "from-violet-500 to-violet-600",
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

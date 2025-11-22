// components/dashboard/QuickActions.tsx
export default function QuickActions() {
  const actions = [
    {
      title: "Borrow New Book",
      description: "Explore our collection",
      icon: (
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
      ),
      onClick: () => console.log("Borrow new book"),
    },
    {
      title: "Update Profile",
      description: "Manage your account",
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      onClick: () => console.log("Update profile"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-150"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                {action.icon}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {action.title}
                </p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-5">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
            ?
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 text-sm">Need Help?</h3>
            <p className="text-blue-700 text-xs mt-1">
              Our support team is here to help with any questions about your
              account or books.
            </p>
            <div className="flex space-x-4 mt-3">
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </button>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

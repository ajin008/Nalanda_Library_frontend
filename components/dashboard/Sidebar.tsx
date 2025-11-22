// components/dashboard/Sidebar.tsx
interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

export default function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "browse", label: "Browse Books", icon: "📚" },
    { id: "history", label: "Borrow History", icon: "🕒" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Nalanda Library</h1>
        <p className="text-sm text-gray-500 mt-1">Knowledge Hub</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeMenu === item.id
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-base mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

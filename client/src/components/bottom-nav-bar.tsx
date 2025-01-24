import { AlertCircle, CheckCircle, Home, Loader } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  // { path: "/downloads", label: "Downloads", icon: Download },
  { path: "/downloads/completed", label: "Completed", icon: CheckCircle },
  { path: "/downloads/in-progress", label: "In Progress", icon: Loader },
  { path: "/downloads/failed", label: "Failed", icon: AlertCircle },
];

const BottomNavbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${
              location.pathname === item.path
                ? "text-blue-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;

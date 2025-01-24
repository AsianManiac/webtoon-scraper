import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Home, Loader } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  // { path: "/downloads", label: "Downloads", icon: Download },
  { path: "/downloads/completed", label: "Completed", icon: CheckCircle },
  { path: "/downloads/in-progress", label: "In Progress", icon: Loader },
  { path: "/downloads/failed", label: "Failed", icon: AlertCircle },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-xl font-bold text-gray-800 dark:text-white"
          >
            Webtoon Downloader
          </Link>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <div className="flex items-center space-x-1">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {location.pathname === item.path && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import Navbar from "@/components/nav-bar";
import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="container max-w-xl mx-auto md:px-4 px-0 py-8">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AppLayout;

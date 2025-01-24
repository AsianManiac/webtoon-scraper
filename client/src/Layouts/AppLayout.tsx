import BottomNavbar from "@/components/bottom-nav-bar";
import Navbar from "@/components/nav-bar";
import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <main className="container max-w-xl mx-auto md:px-4 px-0 py-8 mb-16 md:mb-0">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default AppLayout;

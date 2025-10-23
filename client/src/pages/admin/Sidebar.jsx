import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Helper to check which page is active
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#020817]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r border-gray-200 dark:border-gray-800 p-6 space-y-10 sticky top-0 h-screen shadow-md dark:shadow-none">
        {/* Brand */}
        <div className="text-center">
          <Link to="/" className="flex flex-col items-center gap-1">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
              Moodle
            </span>
            <p className="text-xm text-gray-500 dark:text-gray-400 ">
              Instructor Panel
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-3">
          <SidebarLink
            to="dashboard"
            icon={<ChartNoAxesColumn size={20} />}
            label="Dashboard"
            active={isActive("dashboard")}
          />
          <SidebarLink
            to="course"
            icon={<SquareLibrary size={20} />}
            label="Courses"
            active={isActive("course")}
          />
        </nav>

        {/* Footer Info */}
        <div className="mt-auto text-center text-xs text-gray-500 dark:text-gray-400">
          © 2025 Moodle
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;

// 🎯 Sidebar Link Component (Reusable)
const SidebarLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 
      hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-gray-800 dark:hover:text-blue-400 ${active
        ? "bg-blue-500 text-white dark:bg-blue-600 shadow-md"
        : "bg-transparent"
      }`}
  >
    <span
      className={`transition-transform duration-200 ${active ? "scale-110" : "scale-100"
        }`}
    >
      {icon}
    </span>
    <span>{label}</span>
  </Link>
);

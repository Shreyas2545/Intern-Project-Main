import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaPalette,
  FaBox,
  FaTruck,
  FaBars,
  FaTimes,
} from "react-icons/fa";

// --- Sidebar Links Configuration ---
const sidebarLinks = [
  { to: "/dashboard/profile", label: "Profile", icon: FaUser },
  { to: "/dashboard/designs", label: "Saved Designs", icon: FaPalette },
  { to: "/dashboard/orders", label: "Order History", icon: FaBox },
  { to: "/dashboard/track", label: "Track Orders", icon: FaTruck },
];

// --- Reusable NavLink Component for DRY code ---
const SidebarLink = ({ to, icon: Icon, label, isActive, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="flex-1">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // --- Animation Variants ---
  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const linkVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { y: { stiffness: 1000, velocity: -100 } },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: { y: { stiffness: 1000 } },
    },
  };

  return (
    <>
      {/* --- Mobile Menu Toggle --- */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white text-gray-800 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* --- Overlay for mobile --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* --- Sidebar --- */}
      <motion.aside
        className="fixed top-0 left-0 min-h-screen w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col z-40 md:static md:translate-x-0 m-0"
        variants={sidebarVariants}
        initial={false}
        animate={isOpen || window.innerWidth >= 768 ? "open" : "closed"}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto flex flex-col">
          <motion.ul
            className="space-y-2 flex-1"
            variants={{
              open: {
                transition: { staggerChildren: 0.07, delayChildren: 0.2 },
              },
              closed: {
                transition: { staggerChildren: 0.05, staggerDirection: -1 },
              },
            }}
          >
            {sidebarLinks.map((item) => (
              <motion.li key={item.to} variants={linkVariants}>
                <SidebarLink
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.to}
                  onClick={() => setIsOpen(false)}
                />
              </motion.li>
            ))}
          </motion.ul>
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;

import React, { useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaArrowLeft,
  FaBox,
  FaTshirt,
  FaList,
  FaImage,
  FaShoppingCart,
  FaUserFriends,
  FaTicketAlt,
  FaFileAlt,
  FaCreditCard,
  FaTruck,
  FaBell,
  FaChartLine,
} from "react-icons/fa";
import Dashboard from "./AdminPanel/Dashboard.jsx";
import ProductManagement from "./AdminPanel/ProductManagement";
import CategoryManager from "./AdminPanel/CategoryManager";
import DesignTemplateManager from "./AdminPanel/DesignTemplateManager";
import OrdersManagement from "./AdminPanel/OrdersManagement";
import CustomersManagement from "./AdminPanel/CustomersManagement";
import CouponManager from "./AdminPanel/CouponManager";
import ContentManagement from "./AdminPanel/ContentManagement";
import PaymentManager from "./AdminPanel/PaymentManager";
import ShippingManagement from "./AdminPanel/ShippingManager";
import NotificationsManager from "./AdminPanel/NotificationsManager";
import AnalyticsReports from "./AdminPanel/Analytics";

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: FaBox },
    {
      to: "/admin/product-management",
      label: "Product Management",
      icon: FaTshirt,
    },
    { to: "/admin/category-manager", label: "Category Manager", icon: FaList },
    {
      to: "/admin/design-template-manager",
      label: "Design Template Manager",
      icon: FaImage,
    },
    {
      to: "/admin/orders-management",
      label: "Orders Management",
      icon: FaShoppingCart,
    },
    {
      to: "/admin/customers-management",
      label: "Customers Management",
      icon: FaUserFriends,
    },
    { to: "/admin/coupon-manager", label: "Coupon Manager", icon: FaTicketAlt },
    {
      to: "/admin/content-management",
      label: "Content Management",
      icon: FaFileAlt,
    },
    {
      to: "/admin/payment-manager",
      label: "Payment Manager",
      icon: FaCreditCard,
    },
    {
      to: "/admin/shipping-management",
      label: "Shipping Management",
      icon: FaTruck,
    },
    {
      to: "/admin/notifications-manager",
      label: "Notifications Manager",
      icon: FaBell,
    },
    {
      to: "/admin/analytics-reports",
      label: "Analytics & Reports",
      icon: FaChartLine,
    },
  ];

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const sidebarVariants = {
    hidden: { x: -256 },
    visible: { x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans">
      {/* Mobile and Tablet Menu Button */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-100 lg:static lg:w-64 p-6 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 ease-in-out`}
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h2>
        <motion.button
          onClick={() => {
            navigate("/");
            setIsSidebarOpen(false);
            console.log("Navigated to home");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white font-medium rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 text-sm"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaArrowLeft />
          Go to Home
        </motion.button>
        <nav>
          <ul className="space-y-2">
            {navLinks.map((link, index) => (
              <motion.li
                key={link.to}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-800 text-white font-semibold"
                        : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                    }`
                  }
                  onClick={() => {
                    setIsSidebarOpen(false);
                    console.log(`Navigated to ${link.label}`);
                  }}
                >
                  <link.icon className="text-base" />
                  <span>{link.label}</span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.aside>

      {/* Overlay for mobile and tablet */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <motion.header
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
        </motion.header>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product-management" element={<ProductManagement />} />
          <Route path="/category-manager" element={<CategoryManager />} />
          <Route
            path="/design-template-manager"
            element={<DesignTemplateManager />}
          />
          <Route path="/orders-management" element={<OrdersManagement />} />
          <Route
            path="/customers-management"
            element={<CustomersManagement />}
          />
          <Route path="/coupon-manager" element={<CouponManager />} />
          <Route path="/content-management" element={<ContentManagement />} />
          <Route path="/payment-manager" element={<PaymentManager />} />
          <Route path="/shipping-management" element={<ShippingManagement />} />
          <Route
            path="/notifications-manager"
            element={<NotificationsManager />}
          />
          <Route path="/analytics-reports" element={<AnalyticsReports />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;

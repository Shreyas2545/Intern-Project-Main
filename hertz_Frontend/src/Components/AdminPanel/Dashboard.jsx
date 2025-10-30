import React from "react";
import { motion } from "framer-motion";
import {
  FaBox,
  FaMoneyBillWave,
  FaClock,
  FaUsers,
  FaExclamationTriangle,
} from "react-icons/fa";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
  }),
};

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const TotalOrders = () => (
  <motion.div
    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    custom={0}
  >
    <div className="flex items-center space-x-4">
      <FaBox className="text-blue-700 text-3xl" />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Total Orders</h3>
        <p className="text-2xl font-bold text-blue-800">1,234</p>
        <p className="text-sm text-gray-500">
          Today: 50 / Weekly: 300 / Monthly: 1,000
        </p>
      </div>
    </div>
  </motion.div>
);

const TotalRevenue = () => (
  <motion.div
    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    custom={1}
  >
    <div className="flex items-center space-x-4">
      <FaMoneyBillWave className="text-blue-700 text-3xl" />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
        <p className="text-2xl font-bold text-blue-800">₹1,50,000</p>
        <p className="text-sm text-gray-500">+8% from last month</p>
      </div>
    </div>
  </motion.div>
);

const PendingOrders = () => (
  <motion.div
    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    custom={2}
  >
    <div className="flex items-center space-x-4">
      <FaClock className="text-blue-700 text-3xl" />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Pending Orders</h3>
        <p className="text-2xl font-bold text-blue-800">42</p>
        <p className="text-sm text-gray-500">3 urgent</p>
      </div>
    </div>
  </motion.div>
);

const LiveUsersOnline = () => (
  <motion.div
    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    custom={3}
  >
    <div className="flex items-center space-x-4">
      <FaUsers className="text-blue-700 text-3xl" />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Live Users Online
        </h3>
        <p className="text-2xl font-bold text-blue-800">156</p>
        <p className="text-sm text-gray-500">Active now</p>
      </div>
    </div>
  </motion.div>
);

const RecentOrdersTable = () => {
  const orders = [
    {
      id: "ORD1001",
      customer: "Shreyas Hadawale",
      date: "2025-06-20",
      total: 1999,
      status: "Delivered",
    },
    {
      id: "ORD1002",
      customer: "Ananya Sharma",
      date: "2025-06-19",
      total: 799,
      status: "Shipped",
    },
    {
      id: "ORD1003",
      customer: "Rohan Patel",
      date: "2025-06-18",
      total: 2499,
      status: "Processing",
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={4}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Orders
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                className="border-b hover:bg-blue-100"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index + 5}
              >
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.customer}</td>
                <td className="px-4 py-2">{order.date}</td>
                <td className="px-4 py-2">
                  ₹{order.total.toLocaleString("en-IN")}
                </td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    order.status === "Delivered"
                      ? "text-blue-700"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </td>
                <td className="px-4 py-2">
                  <motion.button
                    className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => console.log(`View details for ${order.id}`)}
                  >
                    View
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const TopSellingProducts = () => {
  const products = [
    { id: 1, name: "Custom T-Shirt", sales: 150, revenue: 75000 },
    { id: 2, name: "Premium Mug", sales: 120, revenue: 36000 },
    { id: 3, name: "Canvas Print", sales: 80, revenue: 64000 },
  ];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={5}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Top Selling Products
      </h3>
      <ul className="space-y-3">
        {products.map((product, index) => (
          <motion.li
            key={product.id}
            className="flex justify-between items-center border-b pb-2 hover:bg-blue-100"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index + 6}
          >
            <span className="text-sm text-gray-700">{product.name}</span>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-700">
                {product.sales} sales
              </p>
              <p className="text-xs text-gray-500">
                ₹{product.revenue.toLocaleString("en-IN")}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const LowInventoryAlerts = () => {
  const alerts = [
    { id: 1, product: "Custom T-Shirt", stock: 5 },
    { id: 2, product: "Sticker Set", stock: 10 },
  ];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={6}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Low Inventory Alerts
      </h3>
      <ul className="space-y-3">
        {alerts.map((alert, index) => (
          <motion.li
            key={alert.id}
            className="flex justify-between items-center border-b pb-2 hover:bg-blue-100"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index + 7}
          >
            <div className="flex items-center space-x-2">
              <FaExclamationTriangle className="text-blue-700" />
              <span className="text-sm text-gray-700">{alert.product}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-700">
                {alert.stock} in stock
              </span>
              <motion.button
                className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => console.log(`Restock ${alert.product}`)}
              >
                Restock
              </motion.button>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const Dashboard = () => (
  <motion.div
    className="space-y-6"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <TotalOrders />
      <TotalRevenue />
      <PendingOrders />
      <LiveUsersOnline />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentOrdersTable />
      <TopSellingProducts />
    </div>
    <LowInventoryAlerts />
  </motion.div>
);

export default Dashboard;

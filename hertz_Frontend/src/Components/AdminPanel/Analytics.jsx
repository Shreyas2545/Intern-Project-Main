import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChartLine } from "react-icons/fa";

const AnalyticsReports = () => {
  const [salesReports, setSalesReports] = useState([
    { id: 1, period: "Daily", date: "2025-06-20", total: 5000, orders: 50 },
    { id: 2, period: "Weekly", date: "2025-06-15", total: 30000, orders: 300 },
  ]);
  const [productPerformance, setProductPerformance] = useState([
    { id: 1, name: "Custom T-Shirt", views: 1000, purchases: 150 },
    { id: 2, name: "Premium Mug", views: 800, purchases: 120 },
  ]);
  const [customerInsights, setCustomerInsights] = useState([
    { id: 1, type: "New", count: 200, totalSpend: 50000 },
    { id: 2, type: "Returning", count: 150, totalSpend: 75000 },
    { id: 3, type: "High-Value", count: 50, totalSpend: 100000 },
  ]);
  const [abandonedCarts, setAbandonedCarts] = useState([
    { id: 1, customer: "Shreyas Hadawale", date: "2025-06-20", total: 999 },
  ]);
  const [filters, setFilters] = useState({ period: "" });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleExportReport = (type) => {
    console.log(`Export ${type} report`);
  };

  const filteredSalesReports = salesReports.filter(
    (s) => !filters.period || s.period === filters.period
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaChartLine className="text-blue-700 mr-2" /> Analytics & Reports
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sales Reports
          </h3>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Filter by Period
            </label>
            <select
              name="period"
              value={filters.period}
              onChange={handleFilterChange}
              className="mt-1 w-full sm:w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          <motion.button
            className="mb-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={() => handleExportReport("sales")}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Export Sales Report
          </motion.button>
          {filteredSalesReports.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No sales reports available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Period</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Total (₹)</th>
                    <th className="px-4 py-2">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSalesReports.map((report, index) => (
                    <motion.tr
                      key={report.id}
                      className="border-b hover:bg-blue-100"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <td className="px-4 py-2">{report.period}</td>
                      <td className="px-4 py-2">{report.date}</td>
                      <td className="px-4 py-2">
                        ₹{report.total.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2">{report.orders}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Product Performance
          </h3>
          <motion.button
            className="mb-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={() => handleExportReport("product")}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Export Product Report
          </motion.button>
          {productPerformance.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No product performance data available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Product Name</th>
                    <th className="px-4 py-2">Views</th>
                    <th className="px-4 py-2">Purchases</th>
                    <th className="px-4 py-2">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {productPerformance.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      className="border-b hover:bg-blue-100"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">{product.views}</td>
                      <td className="px-4 py-2">{product.purchases}</td>
                      <td className="px-4 py-2">
                        {((product.purchases / product.views) * 100).toFixed(2)}
                        %
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Customer Insights
          </h3>
          <motion.button
            className="mb-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={() => handleExportReport("customer")}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Export Customer Insights
          </motion.button>
          {customerInsights.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No customer insights available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Customer Type</th>
                    <th className="px-4 py-2">Count</th>
                    <th className="px-4 py-2">Total Spend (₹)</th>
                    <th className="px-4 py-2">Average Spend (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {customerInsights.map((insight, index) => (
                    <motion.tr
                      key={insight.id}
                      className="border-b hover:bg-blue-100"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <td className="px-4 py-2">{insight.type}</td>
                      <td className="px-4 py-2">{insight.count}</td>
                      <td className="px-4 py-2">
                        ₹{insight.totalSpend.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2">
                        ₹
                        {(insight.totalSpend / insight.count).toLocaleString(
                          "en-IN"
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Abandoned Carts
          </h3>
          <motion.button
            className="mb-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={() => handleExportReport("abandoned")}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Export Abandoned Carts
          </motion.button>
          {abandonedCarts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No abandoned carts found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Customer</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {abandonedCarts.map((cart, index) => (
                    <motion.tr
                      key={cart.id}
                      className="border-b hover:bg-blue-100"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <td className="px-4 py-2">{cart.customer}</td>
                      <td className="px-4 py-2">{cart.date}</td>
                      <td className="px-4 py-2">
                        ₹{cart.total.toLocaleString("en-IN")}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsReports;

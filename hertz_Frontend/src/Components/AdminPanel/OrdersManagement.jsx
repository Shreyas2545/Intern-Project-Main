import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD1001",
      customer: "Shreyas Hadawale",
      date: "2025-06-20",
      total: 1999,
      status: "Delivered",
      printer: "Vendor A",
    },
    {
      id: "ORD1002",
      customer: "Ananya Sharma",
      date: "2025-06-19",
      total: 799,
      status: "Shipped",
      printer: "Vendor B",
    },
  ]);
  const [filters, setFilters] = useState({ date: "", status: "", product: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ status: "", printer: "" });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleStatusUpdate = (id) => {
    setOrders(
      orders.map((o) =>
        o.id === id
          ? { ...o, status: editData.status, printer: editData.printer }
          : o
      )
    );
    setEditingId(null);
  };

  const handleDownload = (id, type) => {
    const order = orders.find((o) => o.id === id);
    const doc = new jsPDF();
    doc.text(`${type} for Order ${id}`, 10, 10);
    doc.text(`Customer: ${order.customer}`, 10, 20);
    doc.text(`Date: ${order.date}`, 10, 30);
    doc.text(`Total: ₹${order.total.toLocaleString("en-IN")}`, 10, 40);
    doc.text(`Status: ${order.status}`, 10, 50);
    doc.text(`Printer: ${order.printer}`, 10, 60);
    doc.save(`${id}_${type}.pdf`);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  const filteredOrders = orders.filter(
    (o) =>
      (!filters.date || o.date.includes(filters.date)) &&
      (!filters.status || o.status === filters.status) &&
      (!filters.product ||
        o.customer.toLowerCase().includes(filters.product.toLowerCase()))
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
        <FaShoppingCart className="text-blue-700 mr-2" /> Orders Management
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Filter by Date
            </label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Filter by Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="In Printing">In Printing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Filter by Product
            </label>
            <input
              type="text"
              name="product"
              value={filters.product}
              onChange={handleFilterChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Search by customer or product"
            />
          </div>
        </div>
        <motion.button
          className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          onClick={handleExport}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Export to Excel
        </motion.button>
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders</h3>
          {filteredOrders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No orders found.
            </p>
          ) : (
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Printer</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    className="border-b hover:bg-blue-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.customer}</td>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2">
                      {editingId === order.id ? (
                        <select
                          name="status"
                          value={editData.status}
                          onChange={handleEditChange}
                          className="px-2 py-1 border rounded-md text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Printing">In Printing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      ) : (
                        <span
                          className={`font-semibold ${
                            order.status === "Delivered"
                              ? "text-blue-700"
                              : order.status === "Shipped"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingId === order.id ? (
                        <input
                          type="text"
                          name="printer"
                          value={editData.printer}
                          onChange={handleEditChange}
                          className="px-2 py-1 border rounded-md text-sm"
                          placeholder="Printer name"
                        />
                      ) : (
                        order.printer
                      )}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      {editingId === order.id ? (
                        <>
                          <motion.button
                            className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 text-xs"
                            onClick={() => handleStatusUpdate(order.id)}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            Save
                          </motion.button>
                          <motion.button
                            className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-xs"
                            onClick={() => setEditingId(null)}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            Cancel
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <motion.button
                            className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 text-xs"
                            onClick={() => {
                              setEditingId(order.id);
                              setEditData({
                                status: order.status,
                                printer: order.printer,
                              });
                            }}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs flex items-center"
                            onClick={() => handleDownload(order.id, "Invoice")}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <FaDownload className="mr-1" /> Invoice
                          </motion.button>
                          <motion.button
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs flex items-center"
                            onClick={() =>
                              handleDownload(order.id, "Packing Slip")
                            }
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <FaDownload className="mr-1" /> Packing Slip
                          </motion.button>
                        </>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OrdersManagement;

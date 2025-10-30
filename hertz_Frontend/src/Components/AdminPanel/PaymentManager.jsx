import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCreditCard } from "react-icons/fa";
import * as XLSX from "xlsx";

const PaymentManager = () => {
  const [payments, setPayments] = useState([
    {
      id: "TXN1001",
      orderId: "ORD1001",
      amount: 1999,
      method: "UPI",
      status: "Success",
      date: "2025-06-20",
    },
    {
      id: "TXN1002",
      orderId: "ORD1002",
      amount: 799,
      method: "Card",
      status: "Pending",
      date: "2025-06-19",
    },
  ]);
  const [adjustment, setAdjustment] = useState({
    paymentId: "",
    amount: "",
    reason: "",
  });
  const [filters, setFilters] = useState({ status: "", method: "" });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleAdjustmentChange = (e) => {
    const { name, value } = e.target;
    setAdjustment({ ...adjustment, [name]: value });
  };

  const handleAdjustPayment = (e) => {
    e.preventDefault();
    if (!adjustment.paymentId || !adjustment.amount || !adjustment.reason) {
      alert("All adjustment fields are required!");
      return;
    }
    setPayments([
      ...payments,
      {
        id: `TXN${payments.length + 1001}`,
        orderId: adjustment.paymentId,
        amount: parseInt(adjustment.amount),
        method: "Manual",
        status: "Success",
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setAdjustment({ paymentId: "", amount: "", reason: "" });
  };

  const handleRefund = (id, amount) => {
    alert(`Refund processed for payment ${id}: ₹${amount}`);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(payments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "payments.xlsx");
  };

  const filteredPayments = payments.filter(
    (p) =>
      (!filters.status || p.status === filters.status) &&
      (!filters.method || p.method === filters.method)
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
        <FaCreditCard className="text-blue-700 mr-2" /> Payment Manager
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Manual Payment Adjustment
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Payment ID
              </label>
              <input
                type="text"
                name="paymentId"
                value={adjustment.paymentId}
                onChange={handleAdjustmentChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter payment ID"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={adjustment.amount}
                onChange={handleAdjustmentChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Reason
              </label>
              <input
                type="text"
                name="reason"
                value={adjustment.reason}
                onChange={handleAdjustmentChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter reason"
              />
            </div>
          </div>
          <motion.button
            className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={handleAdjustPayment}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Adjust Payment
          </motion.button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Filter by Method
            </label>
            <select
              name="method"
              value={filters.method}
              onChange={handleFilterChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Netbanking">Netbanking</option>
            </select>
          </div>
        </div>
        <motion.button
          className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          onClick={handleExport}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Export Financial Report
        </motion.button>
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Payment Logs
          </h3>
          {filteredPayments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No payments found.
            </p>
          ) : (
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Transaction ID</th>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Method</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    className="border-b hover:bg-blue-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <td className="px-4 py-2">{payment.id}</td>
                    <td className="px-4 py-2">{payment.orderId}</td>
                    <td className="px-4 py-2">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2">{payment.method}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        payment.status === "Success"
                          ? "text-blue-700"
                          : payment.status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {payment.status}
                    </td>
                    <td className="px-4 py-2">{payment.date}</td>
                    <td className="px-4 py-2">
                      <motion.button
                        className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        onClick={() => handleRefund(payment.id, payment.amount)}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Refund
                      </motion.button>
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

export default PaymentManager;

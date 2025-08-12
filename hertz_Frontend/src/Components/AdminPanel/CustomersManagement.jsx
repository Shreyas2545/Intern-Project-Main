import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserFriends, FaEnvelope, FaPhone } from "react-icons/fa";

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Shreyas Hadawale",
      email: "shreyas@example.com",
      phone: "+91 9876543210",
      orders: 5,
      totalSpend: 4999,
      lastLogin: "2025-06-20",
      addresses: ["123 Main St, Mumbai"],
      savedDesigns: ["T-Shirt Design 1"],
      orderHistory: ["ORD1001", "ORD1002"],
      status: "Active",
    },
    {
      id: 2,
      name: "Ananya Sharma",
      email: "ananya@example.com",
      phone: "+91 8765432109",
      orders: 3,
      totalSpend: 2397,
      lastLogin: "2025-06-19",
      addresses: ["456 Park Ave, Delhi"],
      savedDesigns: [],
      orderHistory: ["ORD1003"],
      status: "Active",
    },
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleBlock = (id) => {
    setCustomers(
      customers.map((c) => (c.id === id ? { ...c, status: "Blocked" } : c))
    );
    console.log(`Blocked customer with id: ${id}`);
  };

  const handleDelete = (id) => {
    setCustomers(customers.filter((c) => c.id !== id));
    console.log(`Deleted customer with id: ${id}`);
  };

  const handleSendMessage = (id, type) => {
    console.log(`Send ${type} to customer with id: ${id}`);
  };

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
        <FaUserFriends className="text-blue-700 mr-2" /> Customers Management
      </h2>
      <div className="space-y-6">
        {selectedCustomer ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Customer Profile: {selectedCustomer.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> {selectedCustomer.email}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Phone:</strong> {selectedCustomer.phone}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Total Orders:</strong> {selectedCustomer.orders}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Total Spend:</strong> ₹
                  {selectedCustomer.totalSpend.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Last Login:</strong> {selectedCustomer.lastLogin}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Addresses:</strong>{" "}
                  {selectedCustomer.addresses.join(", ")}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Saved Designs:</strong>{" "}
                  {selectedCustomer.savedDesigns.length > 0
                    ? selectedCustomer.savedDesigns.join(", ")
                    : "None"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Order History:</strong>{" "}
                  {selectedCustomer.orderHistory.join(", ")}
                </p>
              </div>
            </div>
            <motion.button
              className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onClick={() => setSelectedCustomer(null)}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Back to List
            </motion.button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Customers
            </h3>
            {customers.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No customers available.
              </p>
            ) : (
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Orders</th>
                    <th className="px-4 py-2">Total Spend</th>
                    <th className="px-4 py-2">Last Login</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      className="border-b hover:bg-blue-100"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <td className="px-4 py-2">{customer.name}</td>
                      <td className="px-4 py-2">{customer.email}</td>
                      <td className="px-4 py-2">{customer.phone}</td>
                      <td className="px-4 py-2">{customer.orders}</td>
                      <td className="px-4 py-2">
                        ₹{customer.totalSpend.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2">{customer.lastLogin}</td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          customer.status === "Active"
                            ? "text-blue-700"
                            : "text-red-600"
                        }`}
                      >
                        {customer.status}
                      </td>
                      <td className="px-4 py-2 flex space-x-2">
                        <motion.button
                          className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          onClick={() => setSelectedCustomer(customer)}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          View
                        </motion.button>
                        <motion.button
                          className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          onClick={() =>
                            handleSendMessage(customer.id, "Email")
                          }
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <FaEnvelope className="inline mr-1" /> Email
                        </motion.button>
                        <motion.button
                          className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          onClick={() =>
                            handleSendMessage(customer.id, "WhatsApp")
                          }
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <FaPhone className="inline mr-1" /> WhatsApp
                        </motion.button>
                        <motion.button
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
                          onClick={() => handleBlock(customer.id)}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Block
                        </motion.button>
                        <motion.button
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
                          onClick={() => handleDelete(customer.id)}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Delete
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CustomersManagement;

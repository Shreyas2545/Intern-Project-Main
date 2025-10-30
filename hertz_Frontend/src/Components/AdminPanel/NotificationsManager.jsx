import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBell } from "react-icons/fa";

const NotificationsManager = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      type: "Email",
      name: "Order Confirmation",
      content: "Your order has been confirmed.",
    },
    {
      id: 2,
      type: "SMS",
      name: "Shipping Alert",
      content: "Your order has been shipped.",
    },
  ]);
  const [newTemplate, setNewTemplate] = useState({
    type: "Email",
    name: "",
    content: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTemplate({ ...newTemplate, [name]: value });
  };

  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.content) {
      alert("Template name and content are required!");
      return;
    }
    setTemplates([...templates, { ...newTemplate, id: templates.length + 1 }]);
    setNewTemplate({ type: "Email", name: "", content: "" });
    console.log("Added template:", newTemplate);
  };

  const handleEdit = (template) => {
    setEditingId(template.id);
    setNewTemplate(template);
  };

  const handleSaveEdit = () => {
    if (!newTemplate.name || !newTemplate.content) {
      alert("Template name and content are required!");
      return;
    }
    setTemplates(
      templates.map((t) =>
        t.id === editingId ? { ...newTemplate, id: t.id } : t
      )
    );
    setEditingId(null);
    setNewTemplate({ type: "Email", name: "", content: "" });
    console.log("Updated template:", newTemplate);
  };

  const handleDelete = (id) => {
    setTemplates(templates.filter((t) => t.id !== id));
    console.log(`Deleted template with id: ${id}`);
  };

  const handleSendPush = () => {
    console.log("Send push notification to users");
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
        <FaBell className="text-blue-700 mr-2" /> Notifications Manager
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? "Edit Template" : "Add New Template"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Type
              </label>
              <select
                name="type"
                value={newTemplate.type}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="Push">Push</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Template Name
              </label>
              <input
                type="text"
                name="name"
                value={newTemplate.name}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter template name"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Content
              </label>
              <textarea
                name="content"
                value={newTemplate.content}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter template content"
                rows="4"
              />
            </div>
          </div>
          <motion.button
            className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={editingId ? handleSaveEdit : handleAddTemplate}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {editingId ? "Save Changes" : "Add Template"}
          </motion.button>
        </div>
        <motion.button
          className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          onClick={handleSendPush}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Send Push Notification
        </motion.button>
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Notification Templates
          </h3>
          {templates.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No templates available.
            </p>
          ) : (
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Content</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template, index) => (
                  <motion.tr
                    key={template.id}
                    className="border-b hover:bg-blue-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <td className="px-4 py-2">{template.type}</td>
                    <td className="px-4 py-2">{template.name}</td>
                    <td className="px-4 py-2">{template.content}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <motion.button
                        className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        onClick={() => handleEdit(template)}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
                        onClick={() => handleDelete(template.id)}
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
      </div>
    </motion.div>
  );
};

export default NotificationsManager;

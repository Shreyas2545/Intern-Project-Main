import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaImage } from "react-icons/fa";

const DesignTemplateManager = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "T-Shirt Mockup",
      product: "Custom T-Shirt",
      format: "PNG",
      rules: {
        text: true,
        image: true,
        margin: "10px",
        fonts: ["Arial", "Times New Roman"],
      },
    },
    {
      id: 2,
      name: "Mug Design",
      product: "Premium Mug",
      format: "SVG",
      rules: { text: true, image: false, margin: "5px", fonts: ["Helvetica"] },
    },
  ]);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    product: "",
    format: "",
    rules: { text: false, image: false, margin: "", fonts: "" },
  });
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTemplate({ ...newTemplate, [name]: value });
  };

  const handleRulesChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTemplate({
      ...newTemplate,
      rules: {
        ...newTemplate.rules,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewTemplate({
        ...newTemplate,
        format: file.name.split(".").pop().toUpperCase(),
      });
      console.log("Uploaded file:", file.name);
    }
  };

  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.product) {
      alert("Template name and product are required!");
      return;
    }
    setTemplates([...templates, { ...newTemplate, id: templates.length + 1 }]);
    setNewTemplate({
      name: "",
      product: "",
      format: "",
      rules: { text: false, image: false, margin: "", fonts: "" },
    });
    console.log("Added template:", newTemplate);
  };

  const handleEdit = (template) => {
    setEditingId(template.id);
    setNewTemplate(template);
  };

  const handleSaveEdit = () => {
    if (!newTemplate.name || !newTemplate.product) {
      alert("Template name and product are required!");
      return;
    }
    setTemplates(
      templates.map((t) =>
        t.id === editingId ? { ...newTemplate, id: t.id } : t
      )
    );
    setEditingId(null);
    setNewTemplate({
      name: "",
      product: "",
      format: "",
      rules: { text: false, image: false, margin: "", fonts: "" },
    });
    console.log("Updated template:", newTemplate);
  };

  const handleDelete = (id) => {
    setTemplates(templates.filter((t) => t.id !== id));
    console.log(`Deleted template with id: ${id}`);
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
        <FaImage className="text-blue-700 mr-2" /> Design Template Manager
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? "Edit Template" : "Add New Template"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Product
              </label>
              <input
                type="text"
                name="product"
                value={newTemplate.product}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Upload Template (PSD, PNG, SVG)
              </label>
              <input
                type="file"
                accept=".psd,.png,.svg"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Customization Rules
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="text"
                    checked={newTemplate.rules.text}
                    onChange={handleRulesChange}
                    className="mr-2 focus:ring-blue-500"
                  />
                  Allow Text
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="image"
                    checked={newTemplate.rules.image}
                    onChange={handleRulesChange}
                    className="mr-2 focus:ring-blue-500"
                  />
                  Allow Image Upload
                </label>
                <input
                  type="text"
                  name="margin"
                  value={newTemplate.rules.margin}
                  onChange={handleRulesChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Margin (e.g., 10px)"
                />
                <input
                  type="text"
                  name="fonts"
                  value={newTemplate.rules.fonts}
                  onChange={handleRulesChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Fonts (comma-separated)"
                />
              </div>
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
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Templates
          </h3>
          {templates.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No templates available.
            </p>
          ) : (
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Format</th>
                  <th className="px-4 py-2">Rules</th>
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
                    <td className="px-4 py-2">{template.name}</td>
                    <td className="px-4 py-2">{template.product}</td>
                    <td className="px-4 py-2">{template.format}</td>
                    <td className="px-4 py-2">
                      {`Text: ${template.rules.text ? "Yes" : "No"}, Image: ${
                        template.rules.image ? "Yes" : "No"
                      }, Margin: ${template.rules.margin}, Fonts: ${
                        template.rules.fonts
                      }`}
                    </td>
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

export default DesignTemplateManager;

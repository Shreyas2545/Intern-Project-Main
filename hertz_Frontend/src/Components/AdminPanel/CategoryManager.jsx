import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaList,
  FaEdit,
  FaTrash,
  FaSave,
  FaPlus,
  FaTimes,
  FaCheck,
  FaTimesCircle,
} from "react-icons/fa";
import axios from "axios";

/**
 * CategoryManager Component
 * Provides a comprehensive admin interface for managing product categories, subcategories, attributes, and variants.
 */
const CategoryManager = () => {
  // --- STATE MANAGEMENT ---
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null); // State for notification
  const [confirmation, setConfirmation] = useState(null); // State for delete confirmation

  // State for the main category form (add/edit)
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    attributes: [],
  });

  // Holds the entire category object being edited to access its slug
  const [editingCategory, setEditingCategory] = useState(null);

  // State for the subcategory form
  const [subcategoryForm, setSubcategoryForm] = useState({
    parentId: "",
    name: "",
    image: "",
  });

  // State for adding a new attribute to the main category form
  const [newAttribute, setNewAttribute] = useState({ name: "", values: "" });

  // State for the product variant management form
  const [variant, setVariant] = useState({
    categoryId: "",
    product: "",
    attributes: {},
  });

  // Use the provided API URL directly
  const API_BASE_URL = "http://localhost:8000/api/v1";

  // --- DATA FETCHING ---
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/categories`);
      const categories = Array.isArray(response.data)
        ? response.data
        : response.data.data;
      if (!Array.isArray(categories)) {
        throw new Error(
          "Unexpected API response format: Expected an array of categories."
        );
      }
      setCategories(categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(
        "Could not load categories. Please ensure the backend server is running and accessible."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- FORM INPUT HANDLERS ---
  const handleCategoryChange = (e) => {
    setCategoryForm({
      ...categoryForm,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubcategoryChange = (e) => {
    setSubcategoryForm({
      ...subcategoryForm,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setNewAttribute({ ...newAttribute, [name]: value.trim() });
  };

  const addAttribute = () => {
    if (!newAttribute.name || !newAttribute.values) return;
    const values = newAttribute.values
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v);
    if (values.length === 0) return;
    setCategoryForm({
      ...categoryForm,
      attributes: [
        ...categoryForm.attributes,
        { name: newAttribute.name, values },
      ],
    });
    setNewAttribute({ name: "", values: "" });
  };

  const removeAttribute = (indexToRemove) => {
    setCategoryForm({
      ...categoryForm,
      attributes: categoryForm.attributes.filter(
        (_, index) => index !== indexToRemove
      ),
    });
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      description: "",
      imageUrl: "",
      attributes: [],
    });
  };

  // --- API ACTION HANDLERS ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.imageUrl) {
      setNotification({
        type: "error",
        message: "Category name and Image URL are required!",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const isEditing = !!editingCategory;
    const method = isEditing ? "put" : "post";
    const url = isEditing
      ? `${API_BASE_URL}/categories/${editingCategory.slug}`
      : `${API_BASE_URL}/categories`;

    try {
      const response = await axios({
        method,
        url,
        data: categoryForm,
        headers: {
          // Remove placeholder token; add real token via auth system later
        },
      });
      console.log("API Response:", response.data);
      resetCategoryForm();
      fetchCategories();
      setNotification({
        type: "success",
        message: `Category ${isEditing ? "updated" : "added"} successfully!`,
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(
        `Error ${isEditing ? "updating" : "adding"} category:`,
        err.response ? err.response.data : err.message
      );
      setNotification({
        type: "error",
        message: `Failed to ${
          isEditing ? "update" : "add"
        } category. Check console for details. Status: ${
          err.response?.status || err.message
        }`,
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name || "",
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      attributes: category.attributes || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (slug) => {
    setConfirmation({
      type: "confirm",
      message: "Are you sure you want to delete this category?",
      action: () => handleDeleteConfirmed(slug),
      cancel: () => setConfirmation(null),
    });
  };

  const handleDeleteConfirmed = async (slug) => {
    try {
      await axios.delete(`${API_BASE_URL}/categories/${slug}`, {
        headers: {
          // Remove placeholder token; add real token via auth system later
        },
      });
      fetchCategories();
      setNotification({
        type: "success",
        message: "Category deleted successfully!",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error("Error deleting category:", err);
      setNotification({
        type: "error",
        message: "Failed to delete category. Check console for details.",
      });
      setTimeout(() => setNotification(null), 3000);
    }
    setConfirmation(null);
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (
      !subcategoryForm.parentId ||
      !subcategoryForm.name ||
      !subcategoryForm.image
    ) {
      setNotification({
        type: "error",
        message: "All subcategory fields are required.",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    try {
      const { parentId, ...subcategoryData } = subcategoryForm;
      await axios.post(
        `${API_BASE_URL}/categories/${parentId}/subcategories`,
        subcategoryData,
        {
          headers: {
            // Remove placeholder token; add real token via auth system later
          },
        }
      );
      setSubcategoryForm({ parentId: "", name: "", image: "" });
      fetchCategories();
      setNotification({
        type: "success",
        message: "Subcategory added successfully!",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error("Error adding subcategory:", err);
      setNotification({
        type: "error",
        message:
          "Failed to add subcategory. Ensure your backend supports this route.",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    setConfirmation({
      type: "confirm",
      message: "Are you sure you want to delete this subcategory?",
      action: () => handleDeleteSubcategoryConfirmed(categoryId, subcategoryId),
      cancel: () => setConfirmation(null),
    });
  };

  const handleDeleteSubcategoryConfirmed = async (
    categoryId,
    subcategoryId
  ) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/categories/${categoryId}/subcategories/${subcategoryId}`,
        {
          headers: {
            // Remove placeholder token; add real token via auth system later
          },
        }
      );
      fetchCategories();
      setNotification({
        type: "success",
        message: "Subcategory deleted successfully!",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error("Error deleting subcategory:", err);
      setNotification({
        type: "error",
        message: "Failed to delete subcategory. Check console for details.",
      });
      setTimeout(() => setNotification(null), 3000);
    }
    setConfirmation(null);
  };

  // --- Variant Handlers ---
  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariant({ ...variant, [name]: value.trim() });
  };

  const handleVariantAttributeChange = (attrName, value) => {
    setVariant({
      ...variant,
      attributes: { ...variant.attributes, [attrName]: value },
    });
  };

  const addVariant = () => {
    if (!variant.categoryId || !variant.product) {
      setNotification({
        type: "error",
        message: "Category and product are required for variant!",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    // Placeholder: Replace with actual API call when backend is implemented
    console.log("Adding variant (placeholder):", variant);
    setVariant({ categoryId: "", product: "", attributes: {} });
    setNotification({
      type: "success",
      message: "Variant added successfully! (Placeholder)",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- RENDER LOGIC ---
  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } shadow-lg z-50 transition-opacity duration-300`}
          style={{ opacity: notification ? 1 : 0 }}
        >
          {notification.message}
        </div>
      )}

      {/* Confirmation Popup */}
      {confirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmation
            </h3>
            <p className="text-gray-600 mb-6">{confirmation.message}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  confirmation.cancel();
                }}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                <FaTimesCircle className="inline mr-2" /> Cancel
              </button>
              <button
                onClick={() => {
                  confirmation.action();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <FaCheck className="inline mr-2" /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Category Form */}
      <form
        onSubmit={handleFormSubmit}
        className="space-y-6 bg-gray-50 p-6 rounded-lg border mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editingCategory
            ? `Editing: ${editingCategory.name}`
            : "Add New Category"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={categoryForm.name}
              onChange={handleCategoryChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter category name"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={categoryForm.description}
              onChange={handleCategoryChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter category description"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={categoryForm.imageUrl}
              onChange={handleCategoryChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter image URL"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Attributes
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                name="name"
                value={newAttribute.name}
                onChange={handleAttributeChange}
                className="flex-grow mt-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Attribute (e.g., Size)"
              />
              <input
                type="text"
                name="values"
                value={newAttribute.values}
                onChange={handleAttributeChange}
                className="flex-grow mt-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Values (comma-separated)"
              />
              <button
                type="button"
                onClick={addAttribute}
                className="mt-1 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
              >
                <FaPlus />
              </button>
            </div>
            <div className="mt-3 text-sm text-gray-700 flex flex-wrap gap-2">
              {categoryForm.attributes.map((attr, index) => (
                <span
                  key={index}
                  className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                >
                  {attr.name}: {attr.values.join(", ")}
                  <button
                    type="button"
                    onClick={() => removeAttribute(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FaTimes size="0.8em" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
          >
            {editingCategory ? "Save Changes" : "Add Category"}
          </button>
          {editingCategory && (
            <button
              type="button"
              onClick={resetCategoryForm}
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Subcategory Add Form */}
      <form
        onSubmit={handleAddSubcategory}
        className="space-y-4 bg-gray-50 p-6 rounded-lg border mb-12"
      >
        <h3 className="text-lg font-semibold text-gray-800">Add Subcategory</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Parent Category
            </label>
            <select
              name="parentId"
              value={subcategoryForm.parentId}
              onChange={handleSubcategoryChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              required
            >
              <option value="">-- Select Parent --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Subcategory Name
            </label>
            <input
              type="text"
              name="name"
              value={subcategoryForm.name}
              onChange={handleSubcategoryChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., T-Shirts"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Subcategory Image URL
            </label>
            <input
              type="text"
              name="image"
              value={subcategoryForm.image}
              onChange={handleSubcategoryChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://example.com/image.png"
              required
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FaPlus className="mr-2" />
              Add Subcategory
            </button>
          </div>
        </div>
      </form>

      {/* Manage Variants Section */}
      <div className="space-y-4 bg-gray-50 p-6 rounded-lg border mb-12">
        <h3 className="text-lg font-semibold text-gray-800">Manage Variants</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Category
            </label>
            <select
              name="categoryId"
              value={variant.categoryId}
              onChange={handleVariantChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
              Product
            </label>
            <input
              type="text"
              name="product"
              value={variant.product}
              onChange={handleVariantChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter product name"
            />
          </div>
          {variant.categoryId &&
            categories
              .find((c) => c._id === variant.categoryId)
              ?.attributes.map((attr) => (
                <div key={attr.name}>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                    {attr.name}
                  </label>
                  <select
                    value={variant.attributes[attr.name] || ""}
                    onChange={(e) =>
                      handleVariantAttributeChange(attr.name, e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="">Select {attr.name}</option>
                    {attr.values.map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 opacity-50 cursor-not-allowed"
          disabled
          title="Variant addition is not implemented yet"
        >
          Add Variant (Not Implemented)
        </button>
      </div>

      {/* Categories & Subcategories List */}
      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Existing Categories
        </h3>
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white p-4 rounded-lg shadow-sm border"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">{category.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category.slug)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t pl-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">
                  Subcategories:
                </h4>
                {category.subcategories?.length > 0 ? (
                  <ul className="space-y-2">
                    {category.subcategories.map((sub) => (
                      <li
                        key={sub._id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>- {sub.name}</span>
                        <button
                          onClick={() =>
                            handleDeleteSubcategory(category._id, sub._id)
                          }
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <FaTrash size="0.8em" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No subcategories yet.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryManager;

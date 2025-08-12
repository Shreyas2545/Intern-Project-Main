// src/Components/ProductManager.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8000/api/v1";

// Helper to read auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    subcategory: "",
    description: "",
    price: "",
    stock: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); // product object for details modal
  const [detailLoading, setDetailLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);

  const navigate = useNavigate();
  // TODO: Replace with actual admin check from auth state
  const isAdmin = true;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Robust response extractor
  const extractDataArray = (response) => {
    if (!response) return [];
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    if (Array.isArray(response.data?.products)) return response.data.products;
    // sometimes API returns { success, data: { docs: [...] } } pattern
    if (Array.isArray(response.data?.data?.docs))
      return response.data.data.docs;
    // fallback if response itself is an array
    if (Array.isArray(response)) return response;
    return [];
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: getAuthHeaders(),
      });
      const fetched = extractDataArray(response);
      setProducts(fetched);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load products. Ensure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: getAuthHeaders(),
      });
      // Some APIs return array directly, some use .data or .data.data
      let fetchedCategories = [];
      if (Array.isArray(response.data)) fetchedCategories = response.data;
      else if (Array.isArray(response.data?.data))
        fetchedCategories = response.data.data;
      else if (Array.isArray(response.data?.categories))
        fetchedCategories = response.data.categories;
      else if (Array.isArray(response.data?.data?.docs))
        fetchedCategories = response.data.data.docs;
      else fetchedCategories = [];
      setCategories(fetchedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // keep UI working even if categories fail
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // in ProductManagement.jsx (or ProductManager.jsx) replace handlePreCreate with:
  const handlePreCreate = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Only admins can add products");
      return;
    }
    if (!formData.category || (formData.category && !formData.subcategory)) {
      alert("Please select both a category and a subcategory");
      return;
    }

    try {
      console.log("Sending request to:", `${API_BASE_URL}/products/precreate`);
      // Normalize numbers explicitly
      const payload = {
        ...formData,
        price: formData.price === "" ? 0 : parseFloat(formData.price),
        stock: formData.stock === "" ? 0 : parseInt(formData.stock, 10),
        tags: formData.tags || [],
        sizes: formData.sizes || [],
        colors: formData.colors || [],
        pricingTiers: formData.pricingTiers || [],
      };

      const response = await axios.post(
        `${API_BASE_URL}/products/precreate`,
        payload,
        {
          headers: {
            ...getAuthHeaders(), // if you have helper; otherwise keep Authorization header inline
            "Content-Type": "application/json",
          },
        }
      );

      // success path
      const productId =
        response?.data?.data?._id ||
        response?.data?._id ||
        response?.data?.data?.id;
      if (!productId) {
        console.warn("Precreate returned unexpected shape:", response.data);
        alert(
          "Product pre-created but server returned unexpected response. Check console."
        );
        return;
      }
      navigate(`/design-tool/${productId}`, { state: { isCreating: true } });
    } catch (err) {
      // show the server response body and axios error for debugging
      console.error("Error pre-creating product - axios error:", err);
      if (err.response) {
        console.error("Server response data:", err.response.data);
        // show server message if present
        const serverMsg =
          err.response.data?.message || JSON.stringify(err.response.data);
        alert(`Failed to pre-create product: ${serverMsg}`);
      } else {
        alert(`Failed to pre-create product: ${err.message}`);
      }
    }
  };

  // Fetch single product details for modal
  const fetchProductDetails = useCallback(async (productId) => {
    setDetailLoading(true);
    setSelectedProduct(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/${productId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      const product =
        response?.data?.data ||
        response?.data ||
        (Array.isArray(response?.data) ? response.data[0] : null);
      setSelectedProduct(product);
    } catch (err) {
      console.error("Error fetching product details:", err);
      alert(
        `Failed to load product details. Error: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleViewDetails = (productId) => {
    fetchProductDetails(productId);
  };

  const handleDelete = async (productId) => {
    if (!isAdmin) {
      alert("Only admins can delete products");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setOperationLoading(true);
      // optimistic UI update
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      await axios.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(
        `Failed to delete product. Error: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
      // rollback: refetch products to ensure UI state consistent
      fetchProducts();
    } finally {
      setOperationLoading(false);
    }
  };

  // Utility to convert ids to names safely
  const getCategoryNames = (categoryId, subcategoryId) => {
    const category = categories.find(
      (cat) => cat._id === categoryId || cat.id === categoryId
    );
    const subcategory = category?.subcategories?.find(
      (sc) => sc._id === subcategoryId || sc.id === subcategoryId
    );
    return {
      categoryName: category?.name || "N/A",
      subcategoryName: subcategory?.name || "N/A",
    };
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      return (
        String(p.name || "")
          .toLowerCase()
          .includes(q) ||
        String(p.sku || "")
          .toLowerCase()
          .includes(q) ||
        String(p._id || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [products, searchQuery]);

  if (loading)
    return <div className="text-center p-10">Loading products...</div>;
  if (error)
    return (
      <div className="text-center p-10 text-red-500">
        {error}
        <div className="mt-4">
          <button
            onClick={() => {
              setError(null);
              fetchProducts();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Product Manager</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="search"
              placeholder="Search by name, sku or id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-72"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            onClick={() => setIsAdding(true)}
          >
            <FaPlus /> <span>Add Product</span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white p-6 rounded-lg shadow mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handlePreCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat._id || cat.id} value={cat._id || cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subcategory
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">-- Select Subcategory --</option>
                    {categories
                      .find(
                        (cat) =>
                          cat._id === formData.category ||
                          cat.id === formData.category
                      )
                      ?.subcategories?.map((subcat) => (
                        <option
                          key={subcat._id || subcat.id}
                          value={subcat._id || subcat.id}
                        >
                          {subcat.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={operationLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  {operationLoading ? "Processing..." : "Proceed to Design"}
                </button>
                <button
                  type="button"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const { categoryName, subcategoryName } = getCategoryNames(
              product.category,
              product.subcategory
            );
            const img =
              product.baseImage ||
              product.image ||
              (product.gallery && product.gallery[0]) ||
              "https://placehold.co/400x300/b0c4de/333333?text=Product";
            return (
              <motion.div
                key={product._id || product.id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="relative w-full h-44 rounded-md overflow-hidden mb-3">
                  <img
                    src={img}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/400x300/b0c4de/333333?text=Product";
                    }}
                    loading="lazy"
                  />
                </div>

                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  SKU: {product.sku || "—"}
                </p>
                <p className="text-sm text-gray-600">
                  Category: {categoryName}
                </p>
                <p className="text-sm text-gray-600">
                  Subcategory: {subcategoryName}
                </p>
                <p className="text-sm text-gray-600">
                  Price: ₹{Number(product.price || 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Stock: {product.stock ?? "—"}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    className="bg-blue-600 text-white p-2 rounded-lg flex-1 flex items-center justify-center space-x-2"
                    onClick={() =>
                      navigate(`/design-tool/${product._id || product.id}`, {
                        state: { isCreating: false },
                      })
                    }
                    title="Edit / Open design-tool for this product"
                  >
                    <FaEdit />
                    <span className="hidden sm:inline">Edit Design</span>
                  </button>

                  <button
                    className="bg-gray-200 text-gray-700 p-2 rounded-lg flex-1 flex items-center justify-center space-x-2"
                    onClick={() => handleViewDetails(product._id || product.id)}
                    title="View product details"
                  >
                    <FaEye />
                    <span className="hidden sm:inline">Details</span>
                  </button>

                  <button
                    className="bg-red-600 text-white p-2 rounded-lg flex-1 flex items-center justify-center space-x-2"
                    onClick={() => handleDelete(product._id || product.id)}
                    disabled={operationLoading}
                    title="Delete product"
                  >
                    <FaTrash />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              className="relative bg-white rounded-lg max-w-3xl w-full p-6 z-10 shadow-xl overflow-auto max-h-[90vh]"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 rounded bg-gray-100"
                    onClick={() => {
                      setSelectedProduct(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>

              {detailLoading ? (
                <div className="py-6 text-center">Loading details...</div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <img
                        src={
                          selectedProduct.baseImage ||
                          selectedProduct.image ||
                          (selectedProduct.gallery &&
                            selectedProduct.gallery[0]) ||
                          "https://placehold.co/800x600/b0c4de/333333?text=Product"
                        }
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover rounded-md"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/800x600/b0c4de/333333?text=Product";
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>SKU:</strong> {selectedProduct.sku || "—"}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Price:</strong> ₹
                        {Number(selectedProduct.price || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Stock:</strong> {selectedProduct.stock ?? "—"}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Tags:</strong>{" "}
                        {Array.isArray(selectedProduct.tags) &&
                        selectedProduct.tags.length > 0
                          ? selectedProduct.tags.join(", ")
                          : "—"}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Sizes:</strong>{" "}
                        {Array.isArray(selectedProduct.sizes) &&
                        selectedProduct.sizes.length > 0
                          ? selectedProduct.sizes.join(", ")
                          : "—"}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Colors:</strong>{" "}
                        {Array.isArray(selectedProduct.colors) &&
                        selectedProduct.colors.length > 0
                          ? selectedProduct.colors.join(", ")
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {selectedProduct.description ||
                        "No description provided."}
                    </p>
                  </div>

                  {Array.isArray(selectedProduct.gallery) &&
                    selectedProduct.gallery.length > 1 && (
                      <div>
                        <h3 className="font-semibold mb-2">Gallery</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {selectedProduct.gallery.map((g, i) => (
                            <img
                              key={i}
                              src={g}
                              alt={`${selectedProduct.name}-gallery-${i}`}
                              className="w-full h-28 object-cover rounded"
                              onError={(e) => {
                                e.target.src =
                                  "https://placehold.co/400x300/b0c4de/333333?text=Image";
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  {Array.isArray(selectedProduct.pricingTiers) &&
                    selectedProduct.pricingTiers.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Pricing Tiers</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {selectedProduct.pricingTiers.map((tier, idx) => (
                            <li key={idx}>
                              <strong>{tier.name || `Tier ${idx + 1}`}</strong>:{" "}
                              {tier.price
                                ? `₹${Number(tier.price).toFixed(2)}`
                                : "—"}{" "}
                              {tier.qty ? `- min qty: ${tier.qty}` : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManager;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTicketAlt,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";

const CouponManager = () => {
  // State for coupons data
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for form
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "Percentage",
    discount: "",
    minOrder: "",
    validity: "",
    appliesTo: "All",
    maxUsage: "",
    usagePerUser: "1",
    autoDiscount: false,
  });
  const [editingId, setEditingId] = useState(null);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // State for pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // State for notifications
  const [notification, setNotification] = useState(null);

  const API_BASE_URL = "http://localhost:8000/api/v1";

  // API headers (no auth required)
  const getHeaders = () => ({
    "Content-Type": "application/json",
  });

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch coupons from backend
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        status: statusFilter,
      });

      const { data } = await axios.get(
        `${API_BASE_URL}/coupons?${queryParams}`,
        { headers: getHeaders() }
      );

      if (data.success) {
        setCoupons(data.data.coupons);
        setPagination(data.data.pagination);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  // Create coupon
  const createCoupon = async (couponData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${API_BASE_URL}/coupons`, couponData, {
        headers: getHeaders(),
      });
      if (data.success) {
        showNotification("Coupon created successfully!");
        fetchCoupons();
        return true;
      } else {
        showNotification(data.message, "error");
        return false;
      }
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to create coupon",
        "error"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update coupon
  const updateCoupon = async (id, couponData) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${API_BASE_URL}/coupons/${id}`,
        couponData,
        { headers: getHeaders() }
      );
      if (data.success) {
        showNotification("Coupon updated successfully!");
        fetchCoupons();
        return true;
      } else {
        showNotification(data.message, "error");
        return false;
      }
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to update coupon",
        "error"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete coupon
  const deleteCoupon = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`${API_BASE_URL}/coupons/${id}`, {
        headers: getHeaders(),
      });
      if (data.success) {
        showNotification("Coupon deleted successfully!");
        fetchCoupons();
        return true;
      } else {
        showNotification(data.message, "error");
        return false;
      }
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to delete coupon",
        "error"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCoupons();
  }, [pagination.page, searchQuery, statusFilter]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCoupon({
      ...newCoupon,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Validate form
  const validateForm = () => {
    if (!newCoupon.code.trim()) {
      showNotification("Coupon code is required", "error");
      return false;
    }
    if (!newCoupon.discount.trim()) {
      showNotification("Discount value is required", "error");
      return false;
    }
    if (!newCoupon.validity) {
      showNotification("Validity date is required", "error");
      return false;
    }
    if (new Date(newCoupon.validity) <= new Date()) {
      showNotification("Validity date must be in the future", "error");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const couponData = {
      ...newCoupon,
      code: newCoupon.code.toUpperCase(),
      minOrder: parseFloat(newCoupon.minOrder) || 0,
      maxUsage: newCoupon.maxUsage ? parseInt(newCoupon.maxUsage) : null,
      usagePerUser: parseInt(newCoupon.usagePerUser) || 1,
    };
    const success = editingId
      ? await updateCoupon(editingId, couponData)
      : await createCoupon(couponData);
    if (success) resetForm();
  };

  // Reset form
  const resetForm = () => {
    setNewCoupon({
      code: "",
      discountType: "Percentage",
      discount: "",
      minOrder: "",
      validity: "",
      appliesTo: "All",
      maxUsage: "",
      usagePerUser: "1",
      autoDiscount: false,
    });
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setNewCoupon({
      code: coupon.code,
      discountType: coupon.discountType,
      discount: coupon.discount,
      minOrder: coupon.minOrder.toString(),
      validity: coupon.validity.split("T")[0],
      appliesTo: coupon.appliesTo,
      maxUsage: coupon.maxUsage?.toString() || "",
      usagePerUser: coupon.usagePerUser.toString(),
      autoDiscount: coupon.autoDiscount,
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      await deleteCoupon(id);
    }
  };

  // Handle search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Format date for display
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN");

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-100";
      case "Expired":
        return "text-red-600 bg-red-100";
      case "Inactive":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Animation variants
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
      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white ${
              notification.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
          <FaTicketAlt className="text-blue-700 mr-2" /> Coupon Manager
        </h2>

        {/* Search & Filter */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search coupons..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <motion.button
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
            onClick={() => setShowFilters(!showFilters)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaFilter />
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={statusFilter}
                onChange={handleFilterChange}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Expired">Expired</option>
              </select>
              <motion.button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Clear Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaPlus className="mr-2" />
            {editingId ? "Edit Coupon" : "Add New Coupon"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Coupon Code */}
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={newCoupon.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter coupon code"
                  required
                />
              </div>
              {/* Discount Type */}
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Discount Type *
                </label>
                <select
                  name="discountType"
                  value={newCoupon.discountType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Flat">Flat Amount</option>
                  <option value="Free Shipping">Free Shipping</option>
                </select>
              </div>
              {/* Discount Value */}
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Discount Value *
                </label>
                <input
                  type="text"
                  name="discount"
                  value={newCoupon.discount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="e.g., 10% or ₹100"
                  required
                />
              </div>
              {/* Min Order */}
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Minimum Order Value
                </label>
                <input
                  type="number"
                  name="minOrder"
                  value={newCoupon.minOrder}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="0"
                  min="0"
                />
              </div>
              {/* Validity */}
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Validity Date *
                </label>
                <input
                  type="date"
                  name="validity"
                  value={newCoupon.validity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>
              {/* Applies To */}
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Applies To
                </label>
                <select
                  name="appliesTo"
                  value={newCoupon.appliesTo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="All">All Products</option>
                  <option value="Selected">Selected Products</option>
                </select>
              </div>
              {/* Max Usage */}
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Max Usage (Optional)
                </label>
                <input
                  type="number"
                  name="maxUsage"
                  value={newCoupon.maxUsage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Unlimited"
                  min="1"
                />
              </div>
              {/* Usage Per User */}
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Usage Per User
                </label>
                <input
                  type="number"
                  name="usagePerUser"
                  value={newCoupon.usagePerUser}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  min="1"
                  required
                />
              </div>
              {/* Auto Discount */}
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoDiscount"
                    checked={newCoupon.autoDiscount}
                    onChange={handleInputChange}
                    className="mr-2 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                    Auto-apply Discount
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 mt-6">
              <motion.button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium flex items-center"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                disabled={loading}
              >
                {loading && <FaSpinner className="animate-spin mr-2" />}
                {editingId ? "Save Changes" : "Add Coupon"}
              </motion.button>
              {editingId && (
                <motion.button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </form>
        </div>

        {/* Coupons Table */}
        <div className="overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Coupons ({pagination.total})
            </h3>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading && !coupons.length ? (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-2xl text-blue-600 mx-auto mb-2" />
              <p className="text-gray-500">Loading coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8">
              <FaTicketAlt className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500">No coupons found.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs uppercase bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Discount</th>
                      <th className="px-4 py-3">Min Order</th>
                      <th className="px-4 py-3">Validity</th>
                      <th className="px-4 py-3">Usage</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon, index) => (
                      <motion.tr
                        key={coupon._id}
                        className="border-b hover:bg-gray-50 transition-colors"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                      >
                        <td className="px-4 py-3 font-medium text-blue-600">
                          {coupon.code}
                        </td>
                        <td className="px-4 py-3">{coupon.discount}</td>
                        <td className="px-4 py-3">
                          ₹{coupon.minOrder.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(coupon.validity)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-600">
                            {coupon.usage}
                            {coupon.maxUsage && `/${coupon.maxUsage}`}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              coupon.status
                            )}`}
                          >
                            {coupon.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <motion.button
                              className="p-1 text-blue-600 hover:text-blue-800"
                              onClick={() => handleEdit(coupon)}
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              title="Edit"
                            >
                              <FaEdit />
                            </motion.button>
                            <motion.button
                              className="p-1 text-red-600 hover:text-red-800"
                              onClick={() => handleDelete(coupon._id)}
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              title="Delete"
                            >
                              <FaTrash />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} coupons
                  </div>
                  <div className="flex space-x-1">
                    <motion.button
                      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Previous
                    </motion.button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <motion.button
                        key={i + 1}
                        className={`px-3 py-1 text-sm border rounded-md ${
                          pagination.page === i + 1
                            ? "bg-blue-600 text-white border-blue-600"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handlePageChange(i + 1)}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        {i + 1}
                      </motion.button>
                    ))}
                    <motion.button
                      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CouponManager;

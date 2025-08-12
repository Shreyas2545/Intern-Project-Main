import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  FaCamera,
  FaEdit,
  FaTimes,
  FaUser,
  FaMapMarkerAlt,
  FaSpinner,
} from "react-icons/fa";
import { login } from "../../Features/Auth/authSlice";
import { useNavigate } from "react-router-dom";

const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

const defaultAddress = {
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

const FormInput = ({ label, id, value, onChange, disabled, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
      {...props}
    />
  </div>
);

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: defaultAddress,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  // Add debug logging helper
  const debugLog = (message, data = null) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Profile Debug] ${message}`, data);
    }
  };

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      debugLog("Starting fetchCurrentUser");
      setPageLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          debugLog("No access token found, redirecting to login");
          navigate("/login");
          return;
        }

        const response = await fetch("/api/v1/users/current-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const responseText = await response.text();
          debugLog("Non-JSON response received", responseText);
          throw new Error(
            `Server error: Received an unexpected response. Status: ${response.status}`
          );
        }

        const result = await response.json();
        debugLog("Fetch user response", result);

        if (!response.ok) {
          throw new Error(result.message || "Could not fetch user data.");
        }

        // Update Redux state with fresh user data
        dispatch(
          login({ user: result.data, isAdmin: result.data.isAdmin || false })
        );
        debugLog("Redux state updated with user data", result.data);
      } catch (fetchError) {
        debugLog("Fetch error occurred", fetchError);
        setError(fetchError.message);
        // Only navigate to login if it's an auth error
        if (
          fetchError.message.includes("401") ||
          fetchError.message.includes("unauthorized")
        ) {
          navigate("/login");
        }
      } finally {
        setPageLoading(false);
      }
    };

    fetchCurrentUser();
  }, [dispatch, navigate]);

  // Sync form data with Redux user state - improved to prevent unnecessary updates
  useEffect(() => {
    if (user) {
      debugLog("Syncing form data with user", user);

      const newFormData = {
        fullName: user.fullName || "",
        email: user.email || "",
        address: {
          streetAddress: user.address?.streetAddress || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          postalCode: user.address?.postalCode || "",
          country: user.address?.country || "",
        },
      };

      // Only update if data actually changed to prevent unnecessary re-renders
      setFormData((prevData) => {
        const hasChanged =
          prevData.fullName !== newFormData.fullName ||
          prevData.email !== newFormData.email ||
          JSON.stringify(prevData.address) !==
            JSON.stringify(newFormData.address);

        if (hasChanged) {
          debugLog("Form data updated", newFormData);
          return newFormData;
        }
        return prevData;
      });

      setAvatarPreview(user.avatar || "");

      // Clear any previous errors when user data loads
      setError("");
    }
  }, [user]);

  // Cleanup avatar preview URLs
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleEditToggle = () => {
    debugLog("Edit mode toggled");
    setIsEditMode(true);
    setSuccess("");
    setError("");
  };

  const handleCancel = () => {
    debugLog("Edit cancelled");
    setIsEditMode(false);
    setError("");
    setSuccess("");

    // Reset form data to current user data
    if (user) {
      const resetData = {
        fullName: user.fullName || "",
        email: user.email || "",
        address: {
          streetAddress: user.address?.streetAddress || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          postalCode: user.address?.postalCode || "",
          country: user.address?.country || "",
        },
      };
      setFormData(resetData);
      setAvatarPreview(user.avatar || "");
      debugLog("Form data reset to user data", resetData);
    }
    setAvatarFile(null);

    // Cleanup any blob URLs
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      debugLog(`Field ${name} changed`, { old: prev[name], new: value });
      return updated;
    });

    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        address: { ...prev.address, [name]: value },
      };
      debugLog(`Address field ${name} changed`, {
        old: prev.address[name],
        new: value,
        fullAddress: updated.address,
      });
      return updated;
    });

    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      debugLog("Avatar file selected", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB!");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, JPG, PNG, or WebP)!");
        return;
      }

      // Cleanup previous preview URL
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }

      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setError("");
      debugLog("Avatar preview set", previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    debugLog("Form submission started", formData);
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      // Create FormData for multipart upload
      const data = new FormData();

      // Add form fields
      data.append("fullName", formData.fullName.trim());
      data.append(
        "streetAddress",
        formData.address.streetAddress?.trim() || ""
      );
      data.append("city", formData.address.city?.trim() || "");
      data.append("state", formData.address.state?.trim() || "");
      data.append("postalCode", formData.address.postalCode?.trim() || "");
      data.append("country", formData.address.country?.trim() || "");

      if (avatarFile) {
        data.append("avatar", avatarFile);
      }

      // Enhanced debug logging for FormData
      debugLog("FormData prepared for submission:");
      const formDataEntries = {};
      for (let [key, value] of data.entries()) {
        formDataEntries[key] =
          value instanceof File ? `File: ${value.name}` : value;
      }
      debugLog("FormData entries", formDataEntries);

      const response = await fetch("/api/v1/users/update-profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type for FormData - browser will set it with boundary
        },
        body: data,
      });

      debugLog("API Response received", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        debugLog("Non-JSON response received", responseText);
        throw new Error(
          `Server error: Received an unexpected response. Status: ${response.status}`
        );
      }

      const result = await response.json();
      debugLog("API Response data", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile.");
      }

      // Update Redux state with new user data
      const updatedUserData = {
        ...result.data,
        isAdmin: result.data.isAdmin || user?.isAdmin || false,
      };

      dispatch(
        login({ user: updatedUserData, isAdmin: updatedUserData.isAdmin })
      );
      debugLog("Redux state updated after API response", updatedUserData);

      // Update local form state to reflect the response - improved address handling
      const responseFormData = {
        fullName: result.data.fullName || "",
        email: result.data.email || "",
        address: {
          streetAddress: result.data.address?.streetAddress || "",
          city: result.data.address?.city || "",
          state: result.data.address?.state || "",
          postalCode: result.data.address?.postalCode || "",
          country: result.data.address?.country || "",
        },
      };

      setFormData(responseFormData);
      debugLog("Local form state updated", responseFormData);

      setAvatarPreview(result.data.avatar || "");
      setSuccess("Profile updated successfully!");
      setAvatarFile(null);
      setIsEditMode(false);

      // Cleanup file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      debugLog("Profile update completed successfully");
    } catch (err) {
      debugLog("Profile update error", err);
      setError(err.message || "Failed to update profile. Please try again.");

      // Only navigate to login for authentication errors
      if (err.message.includes("401") || err.message.includes("unauthorized")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading Your Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Success/Error Messages - Enhanced with better styling */}
        <div className="mb-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{success}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
          {isEditMode ? (
            <div className="flex gap-4">
              <motion.button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                <FaTimes />
                <span>Cancel</span>
              </motion.button>
              <motion.button
                form="edit-profile-form"
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </motion.button>
            </div>
          ) : (
            <motion.button
              onClick={handleEditToggle}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEdit />
              <span>Edit Profile</span>
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="relative w-32 h-32 mx-auto">
                <div
                  key={avatarPreview}
                  className="w-full h-full rounded-full bg-cover bg-center bg-gray-200 border-4 border-white shadow-md"
                  style={{
                    backgroundImage: `url(${
                      avatarPreview ||
                      `https://placehold.co/128x128/EBF4FF/7F9CF5?text=${getInitial(
                        formData.fullName
                      )}`
                    })`,
                  }}
                />
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
                    aria-label="Change avatar"
                    disabled={loading}
                  >
                    <FaCamera />
                  </button>
                )}
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">
                {formData.fullName || "User"}
              </h2>
              <p className="text-gray-500">{formData.email}</p>

              {/* Debug info in development */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-left">
                  <strong>Debug Info:</strong>
                  <br />
                  Address: {JSON.stringify(formData.address, null, 2)}
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <form
              id="edit-profile-form"
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-lg"
            >
              <div className="p-6 sm:p-8 space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaUser className="text-blue-600" />
                    <span>Personal Information</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Full Name"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      required
                    />
                    <FormInput
                      label="Email Address"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled={true}
                      title="Email cannot be changed"
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span>Shipping Address</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="streetAddress"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Street Address
                      </label>
                      <textarea
                        id="streetAddress"
                        name="streetAddress"
                        value={formData.address.streetAddress || ""}
                        onChange={handleAddressChange}
                        disabled={!isEditMode}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                        placeholder="Enter your full street address"
                      />
                    </div>
                    <FormInput
                      label="City"
                      id="city"
                      name="city"
                      value={formData.address.city || ""}
                      onChange={handleAddressChange}
                      disabled={!isEditMode}
                      placeholder="Enter city"
                    />
                    <FormInput
                      label="State / Province"
                      id="state"
                      name="state"
                      value={formData.address.state || ""}
                      onChange={handleAddressChange}
                      disabled={!isEditMode}
                      placeholder="Enter state or province"
                    />
                    <FormInput
                      label="Postal / ZIP Code"
                      id="postalCode"
                      name="postalCode"
                      value={formData.address.postalCode || ""}
                      onChange={handleAddressChange}
                      disabled={!isEditMode}
                      placeholder="Enter postal/ZIP code"
                    />
                    <FormInput
                      label="Country"
                      id="country"
                      name="country"
                      value={formData.address.country || ""}
                      onChange={handleAddressChange}
                      disabled={!isEditMode}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />
    </div>
  );
}

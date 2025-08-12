import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";

const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB!");
        return;
      }
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (avatarFile) {
      data.append("avatar", avatarFile);
    }

    try {
      const response = await fetch("/api/v1/users/update-profile", {
        method: "PATCH",
        body: data,
        // ✅ FIX: This option tells the browser to send the authentication cookie with the request.
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to update profile.");

      navigate("/");
    } catch (err) {
      console.error("Profile Update Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')",
        backgroundSize: "cover",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-2xl w-full mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Just a few more details to get you started.
        </p>
      </div>

      <motion.div className="mt-8 max-w-2xl w-full mx-auto bg-white/95 backdrop-blur-sm py-8 px-6 rounded-xl shadow-lg border border-neutral-200">
        {error && (
          <p className="text-red-600 text-center text-sm font-medium mb-4 p-2 bg-red-100 rounded-md">
            {error}
          </p>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <div className="relative group">
              <img
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : `https://placehold.co/128x128/EBF4FF/7F9CF5?text=${getInitial(
                        user?.fullName
                      )}`
                }
                alt="Avatar Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 w-full h-full bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-300"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaCamera className="h-8 w-8 text-white" />
                </div>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-2">
              <label
                htmlFor="streetAddress"
                className="block text-sm font-medium text-blue-900"
              >
                Street Address
              </label>
              <input
                id="streetAddress"
                name="streetAddress"
                type="text"
                required
                value={formData.streetAddress}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-4 py-2.5 border border-neutral-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-blue-900"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-4 py-2.5 border border-neutral-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-blue-900"
              >
                State / Province
              </label>
              <input
                id="state"
                name="state"
                type="text"
                required
                value={formData.state}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-4 py-2.5 border border-neutral-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-blue-900"
              >
                Postal / ZIP Code
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                required
                value={formData.postalCode}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-4 py-2.5 border border-neutral-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-blue-900"
              >
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                required
                value={formData.country}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-4 py-2.5 border border-neutral-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-md text-white bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400"
            >
              {loading ? "Saving..." : "Save and Continue"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

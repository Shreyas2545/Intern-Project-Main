import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../Features/Auth/authSlice"; // Your Redux auth slice
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// --- Animation Variants (unchanged) ---
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.2 },
  },
};
const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // API call remains the same
      const response = await fetch("/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Signup failed. Please try again.");
        return;
      }

      // --- Handle Auto-Login on Successful Signup ---
      if (result.data && result.data.user) {
        // Dispatch the user data to Redux to log them in
        dispatch(login({ user: result.data.user, isAdmin: false }));
        // ✅ Navigate to the profile completion page instead of the homepage
        navigate("/complete-profile");
      } else {
        setError("Account created, but failed to log in automatically.");
      }
    } catch (err) {
      console.error("Signup Fetch Error:", err);
      setError("A network error occurred. Please try again.");
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-md w-full mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">
          Create Your Account
        </h2>
      </div>
      <motion.div
        className="mt-8 max-w-md w-full mx-auto bg-white/95 backdrop-blur-sm py-8 px-6 rounded-xl shadow-lg border border-neutral-200"
        variants={formVariants}
      >
        {error && (
          <motion.p
            className="text-red-600 text-center text-sm font-medium mb-4 p-2 bg-red-100 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <motion.div variants={inputVariants}>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-blue-900"
            >
              Full Name
            </label>
            <div className="mt-1">
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="appearance-none block w-full px-4 py-2.5 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-blue-900 focus:border-blue-900 text-sm sm:text-base transition-colors"
                placeholder="Your Name"
              />
            </div>
          </motion.div>
          <motion.div variants={inputVariants}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-900"
            >
              Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-2.5 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-blue-900 focus:border-blue-900 text-sm sm:text-base transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </motion.div>
          <motion.div variants={inputVariants}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-blue-900"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-2.5 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-blue-900 focus:border-blue-900 text-sm sm:text-base transition-colors"
                placeholder="********"
              />
            </div>
          </motion.div>
          <motion.div variants={inputVariants}>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-blue-900"
            >
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-2.5 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-blue-900 focus:border-blue-900 text-sm sm:text-base transition-colors"
                placeholder="********"
              />
            </div>
          </motion.div>
          <motion.div variants={inputVariants}>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 font-semibold transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {loading ? "Creating Account..." : "Sign Up & Continue"}
            </motion.button>
          </motion.div>
        </form>
        <p className="mt-5 text-center text-sm text-neutral-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-900 hover:text-blue-800 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

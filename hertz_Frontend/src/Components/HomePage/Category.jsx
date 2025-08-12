import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

// --- Helper Components ---

/**
 * SkeletonCard Component
 * Renders a placeholder card with a pulsing animation.
 * This is used to provide visual feedback to the user while category data is being loaded.
 */
const SkeletonCard = () => (
  <div className="w-[120px] sm:w-[140px] lg:w-[160px] bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex-shrink-0 animate-pulse">
    <div className="w-full h-24 sm:h-28 lg:h-32 bg-gray-300"></div>
    <div className="p-2">
      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
    </div>
  </div>
);

/**
 * ErrorDisplay Component
 * Renders a standardized error message with a retry button.
 * This provides a clear and actionable way for users to respond to API failures.
 * @param {string} message - The error message to display.
 * @param {function} onRetry - The function to call when the retry button is clicked.
 */
const ErrorDisplay = ({ message, onRetry }) => (
  <div className="text-center py-8 bg-red-50 border border-red-200 rounded-lg mx-auto max-w-2xl">
    <h3 className="text-lg font-semibold text-red-800">Something Went Wrong</h3>
    <p className="text-red-600 mt-2">{message}</p>
    <button
      onClick={onRetry}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

/**
 * Category Component
 * This component is responsible for displaying a horizontally scrollable list of product categories.
 * It fetches category data from the backend and renders each category as a clickable card
 * that navigates the user to a specific category page.
 */
const Category = () => {
  // --- STATE AND REFS ---

  // A ref to the scrollable container div to directly manipulate its scroll position.
  const scrollRef = useRef(null);

  // State to track if the left scroll button should be visible.
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  // State to track if the right scroll button should be visible.
  const [canScrollRight, setCanScrollRight] = useState(true);

  // State to hold the array of category objects fetched from the API.
  const [categories, setCategories] = useState([]);

  // State to manage the loading status of the API call.
  const [loading, setLoading] = useState(true);

  // State to store any error messages from the API call.
  const [error, setError] = useState(null);

  // Use the provided API URL directly
  const API_BASE_URL = "http://localhost:8000/api/v1";

  // --- DATA FETCHING ---

  /**
   * Fetches the list of categories from the backend API.
   * This function has been updated to use the absolute path.
   */
  const fetchCategories = useCallback(async () => {
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
        "Could not load categories. Please check the network connection and ensure the server is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // The main useEffect hook to trigger the initial data fetch when the component mounts.
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- UI LOGIC AND EVENT HANDLERS ---

  /**
   * Checks the current scroll position of the container to determine
   * whether the left and right scroll buttons should be displayed.
   */
  const checkScroll = useCallback(() => {
    const container = scrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  /**
   * An effect hook to set up and clean up event listeners for scrolling and window resizing.
   * These listeners call checkScroll to keep the button visibility updated.
   */
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      checkScroll();
      scrollContainer.addEventListener("scroll", checkScroll, {
        passive: true,
      });
      window.addEventListener("resize", checkScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [categories, checkScroll]);

  /**
   * Scrolls the container left or right by a calculated amount.
   * @param {'left' | 'right'} dir - The direction to scroll.
   */
  const scroll = (dir) => {
    if (scrollRef.current) {
      const scrollAmount =
        window.innerWidth < 640 ? 120 : window.innerWidth < 1024 ? 180 : 240;

      scrollRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // --- ANIMATION VARIANTS (for Framer Motion) ---

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.9 },
  };

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div className="relative w-full bg-white py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-blue-900 text-center tracking-tight mb-8">
          Shop by Category
        </h2>
        <div className="flex gap-3 overflow-x-hidden px-4 sm:px-6 lg:px-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchCategories} />;
  }

  return (
    <motion.div
      className="relative w-full bg-white py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(245, 245, 245, 1), rgba(235, 240, 255, 0.8)), url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')",
        backgroundSize: "cover",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-bold text-blue-900 text-center tracking-tight mb-8">
        Shop by Category
      </h2>

      <div className="relative w-full flex items-center">
        <motion.button
          onClick={() => scroll("left")}
          className={`absolute left-2 sm:left-3 lg:left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full p-2 shadow-md z-10 transition-opacity duration-300 ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label="Scroll categories left"
        >
          <ChevronLeft size={16} className="text-blue-900" />
        </motion.button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 touch-pan-x"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              className="w-[120px] sm:w-[140px] lg:w-[160px] bg-white rounded-lg shadow-md border border-blue-200 overflow-hidden flex-shrink-0 group"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover="hover"
            >
              <Link
                to={`/category/${category.slug}`}
                className="block"
                aria-label={`View ${category.name} category`}
              >
                <div className="relative w-full h-24 sm:h-28 lg:h-32 overflow-hidden">
                  <img
                    src={category.imageUrl || "https://placehold.co/150x150"}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) =>
                      (e.target.src = "https://placehold.co/150x150")
                    }
                  />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-blue-900/30 to-transparent" />
                </div>
                <div className="text-center px-2 py-2">
                  <h3 className="text-sm sm:text-sm lg:text-base font-semibold text-blue-900 line-clamp-2">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={() => scroll("right")}
          className={`absolute right-2 sm:right-3 lg:right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full p-2 shadow-md z-10 transition-opacity duration-300 ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label="Scroll categories right"
        >
          <ChevronRight size={16} className="text-blue-900" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Category;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaTrash, FaTimes, FaArrowUp } from "react-icons/fa";
import Header from "../Header";
import Footer from "../Footer";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
    setLoading(false);
  }, []);

  const handleRemoveFavorite = (productId) => {
    if (
      window.confirm(
        `Are you sure you want to remove "${
          favorites.find((fav) => fav.id === productId)?.name
        }" from favorites?`
      )
    ) {
      const updatedFavorites = favorites.filter((fav) => fav.id !== productId);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    }
  };

  const handleClearAll = () => {
    setShowClearModal(true);
  };

  const confirmClearAll = () => {
    localStorage.removeItem("favorites");
    setFavorites([]);
    setShowClearModal(false);
  };

  const cancelClearAll = () => {
    setShowClearModal(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <motion.div
        className="relative w-full min-h-screen bg-gradient-to-br from-white to-gray-50 bg-[url('https://www.transparenttextures.com/patterns/light-paper-fibers.png')]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          {/* Sticky Header */}
          <motion.div
            className=" top-0 bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 mb-8 z-10"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <nav className="text-sm text-gray-500 flex items-center space-x-2 mb-4">
              <Link
                to="/"
                className="hover:text-blue-600 transition flex items-center"
              >
                <FaChevronLeft className="mr-1" /> Home
              </Link>
              <span>/</span>
              <span className="font-semibold text-blue-900">Favorites</span>
            </nav>
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight text-center">
              My Favorites
            </h1>
            {favorites.length > 0 && (
              <motion.button
                onClick={handleClearAll}
                className="mt-4 mx-auto block bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Clear all favorites"
              >
                <FaTrash className="inline mr-2" /> Clear All
              </motion.button>
            )}
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-lg text-blue-900">Loading favorites...</p>
            </div>
          ) : favorites.length === 0 ? (
            <motion.div
              className="text-center py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg
                className="w-24 h-24 text-blue-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-2xl font-semibold text-blue-900 mb-4">
                No favorite products yet.
              </p>
              <p className="text-gray-600 mb-6">
                Start exploring and save your favorite items!
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                aria-label="Continue shopping"
              >
                <FaChevronLeft className="mr-2" /> Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {favorites.map((product) => (
                  <motion.div
                    key={product.id}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-blue-200 p-6 hover:shadow-2xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4 relative group">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/600x450/CCCCCC/666666?text=Image+Not+Available?url";
                        }}
                      />
                      <button
                        onClick={() => handleRemoveFavorite(product.id)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-label={`Remove ${product.name} from favorites`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-blue-900 mb-2 line-clamp-2">
                      {product.name}
                    </h2>
                    <p className="text-lg font-semibold text-blue-600 mb-4">
                      ₹{product.price}
                    </p>
                    <Link
                      to={`/products/${product.id}`}
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-center font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 block"
                      aria-label={`View ${product.name}`}
                    >
                      View Product
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Clear All Modal */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                Confirm Clear All
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove all favorites?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={confirmClearAll}
                  className="flex-1 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors duration-200"
                  aria-label="Confirm clear all favorites"
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={cancelClearAll}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
                  aria-label="Cancel clear all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {favorites.length > 0 && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </motion.button>
      )}
      
    </>
  );
};

export default Favorites;

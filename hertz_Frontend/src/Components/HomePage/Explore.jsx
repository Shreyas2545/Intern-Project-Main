import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  FaArrowLeft,
  FaArrowRight,
  FaShoppingCart,
  FaHeart,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "../Cart/cartSlice";
import axios from "axios";

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center p-3 rounded-lg shadow-lg text-white ${
              toast.type === "success" ? "bg-blue-600" : "bg-red-500"
            }`}
            role="alert"
            aria-live="assertive"
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-white"
              aria-label="Close toast"
            >
              <FaTimes />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const toastMessages = useRef(new Set());

  const removeToast = useCallback((id) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast) toastMessages.current.delete(toast.message);
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const addToast = useCallback(
    (message, type = "success") => {
      if (toastMessages.current.has(message)) return;
      const id = Date.now();
      toastMessages.current.add(message);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 3000);
    },
    [removeToast]
  );

  return { toasts, addToast, removeToast };
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: i * 0.1, ease: "easeOut" },
  }),
};

const Popular = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const [hoverId, setHoverId] = useState(null);
  const { toasts, addToast, removeToast } = useToast();
  const [products, setProducts] = useState([]);

  const API_BASE_URL = "http://localhost:8000/api/v1";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(
        response.data.data.map((product) => ({
          id: product._id,
          title: product.name,
          price: product.price,
          discount: 0, // Add discount field to product model if needed
          inStock: product.status === "In Stock",
          stock: product.stock,
          img:
            product.baseImage ||
            "https://placehold.co/400x300/b0c4de/333333?text=Product",
          tags: product.tags,
        }))
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      addToast("Failed to load products.", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = container.clientWidth / 2;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = useCallback(
    (product) => {
      if (!product.inStock || product.stock <= 0) {
        addToast(`${product.title} is out of stock.`, "error");
        return;
      }
      const cartItem = {
        id: product.id,
        name: product.title,
        price: product.price,
        quantity: 1,
      };
      dispatch(addToCart(cartItem));
      addToast(`${product.title} added to cart.`, "success");
    },
    [addToast, dispatch]
  );

  const handleToggleFavorite = useCallback(
    (product) => {
      const updatedFavorites = isProductFavorited(product.id)
        ? favorites.filter((favId) => favId !== product.id)
        : [...favorites, product.id];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      addToast(
        isProductFavorited(product.id)
          ? `${product.title} removed from favorites.`
          : `${product.title} added to favorites.`,
        "success"
      );
    },
    [addToast, favorites]
  );

  const isProductFavorited = (productId) => favorites.includes(productId);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Explore Products
      </h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
          aria-label="Scroll left"
        >
          <FaArrowLeft className="text-blue-900" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
          aria-label="Scroll right"
        >
          <FaArrowRight className="text-blue-900" />
        </button>
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-4 sm:px-6"
        >
          {products.map((item, i) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              custom={i}
              className="flex-shrink-0 w-64 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border border-gray-100"
              onMouseEnter={() => setHoverId(item.id)}
              onMouseLeave={() => setHoverId(null)}
              role="article"
              aria-labelledby={`product-name-${item.id}`}
            >
              <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x300/b0c4de/333333?text=Product";
                  }}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                        tag === "New"
                          ? "bg-green-500"
                          : tag === "Trending"
                          ? "bg-blue-500"
                          : "bg-purple-500"
                      } shadow-md`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoverId === item.id ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products/${item.id}`);
                  }}
                  className="absolute bottom-2 left-2 bg-blue-900 text-white p-2 rounded-full shadow-lg hover:bg-blue-800 transition-colors"
                  aria-label={`View details for ${item.title}`}
                >
                  <FaEye />
                </motion.button>
              </div>
              <div className="p-5">
                <h3
                  id={`product-name-${item.id}`}
                  className="text-xl font-semibold text-gray-900 mb-2 truncate"
                >
                  {item.title}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-blue-900 font-bold text-2xl mr-2">
                    ₹{item.price.toFixed(2)}
                  </span>
                  {item.discount > 0 && (
                    <span className="text-gray-500 line-through text-sm">
                      ₹{(item.price / (1 - item.discount / 100)).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="flex items-center bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors shadow-md"
                    aria-label={`Add ${item.title} to cart`}
                    disabled={!item.inStock || item.stock <= 0}
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isProductFavorited(item.id)
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600"
                    }`}
                    aria-label={
                      isProductFavorited(item.id)
                        ? `Remove ${item.title} from favorites`
                        : `Add ${item.title} to favorites`
                    }
                  >
                    <FaHeart />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Popular;

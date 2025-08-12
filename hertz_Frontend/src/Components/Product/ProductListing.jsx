import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaTrashAlt,
  FaChevronDown,
  FaChevronUp,
  FaSort,
  FaShoppingCart,
  FaHeart,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaSave,
  FaMinusCircle,
} from "react-icons/fa";
import { addToCart } from "../Cart/cartSlice";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

const CATEGORIES = [
  "Visiting Cards",
  "Stationery and Notebooks",
  "Umbrellas and Raincoats",
  "Custom T-shirts",
  "Mugs and Gifts",
  "Caps and Bags",
  "Signs and Banners",
  "Posters and Marketing Materials",
];
const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Pellentesque euismod, nibh quis luctus fermentum, nibh nisl aliquam nisl,
eu aliquam nunc nisl eu lectus.`;

const generateProducts = () =>
  Array.from({ length: 100 }, (_, i) => {
    const cat = CATEGORIES[i % CATEGORIES.length];
    const price = 50 + ((i * 47) % 1950);
    const discount = (i * 13) % 70;
    // const inStock = i % 7 !== 0; // Removed as requested
    const stock = Math.floor(Math.random() * 100) + 1; // Always in stock for this version
    const createdAt = new Date(Date.now() - i * 86400000).toISOString();
    const popularity = Math.floor(Math.random() * 1000);
    return {
      id: i + 1,
      name: `${cat} Item ${i + 1}`,
      category: cat,
      price,
      discount,
      inStock: true, // Always true as requested
      image: `https://picsum.photos/seed/${i + 1}/400/300`,
      createdAt,
      popularity,
      description: LOREM.repeat((i % 3) + 1).trim(),
      stock,
    };
  });

const sortItems = (items, sortBy) => {
  switch (sortBy) {
    case "price-asc":
      return [...items].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...items].sort((a, b) => b.price - a.price);
    case "newest":
      return [...items].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    default:
      return [...items].sort((a, b) => b.popularity - a.popularity);
  }
};

const getTags = (p) => {
  const tags = [];
  // if (Date.now() - new Date(p.createdAt) < 7 * 86400000) tags.push({ text: 'New', color: 'bg-green-500' }); // Removed as requested
  if (p.popularity > 800)
    tags.push({ text: "Best Seller", color: "bg-yellow-500" });
  // if (!p.inStock) tags.push({ text: 'Out of Stock', color: 'bg-red-500' }); // Removed as requested
  return tags;
};

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

function MultiSelect({ label, options, selected, onChange, onClear }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-800 mb-1 flex justify-between items-center">
        {label}
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-red-500 text-xs flex items-center hover:underline"
            aria-label={`Clear ${label}`}
          >
            <FaMinusCircle className="mr-1" /> Clear
          </button>
        )}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full border border-gray-200 rounded-lg px-4 py-2 flex justify-between items-center bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        aria-label={`Toggle ${label} dropdown`}
      >
        <span className="truncate text-gray-800">
          {selected.length ? selected.join(", ") : "All"}
        </span>
        {open ? (
          <FaChevronUp className="text-gray-600" />
        ) : (
          <FaChevronDown className="text-gray-600" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-full bg-gray-50 border border-gray-200 rounded-lg mt-1 shadow-2xl max-h-60 overflow-auto"
            role="menu"
            aria-label={`${label} options`}
          >
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${label}`}
                className="w-full border border-gray-200 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            </div>
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(opt)}
                    onChange={() => {
                      const next = selected.includes(opt)
                        ? selected.filter((x) => x !== opt)
                        : [...selected, opt];
                      onChange(next);
                    }}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              ))
            ) : (
              <div className="p-4 text-gray-500 text-center">No matches</div>
            )}
            {selected.length > 0 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PriceRangeSelector({
  label,
  buckets,
  current,
  onChange,
  onClear,
  onCustomChange,
  addToast,
}) {
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");

  useEffect(() => {
    if (current && current.isCustom) {
      setCustomMin(current.min !== null ? String(current.min) : "");
      setCustomMax(current.max !== null ? String(current.max) : "");
    } else {
      setCustomMin("");
      setCustomMax("");
    }
  }, [current]);

  const handleCustomApply = () => {
    const minVal = customMin === "" ? null : Number(customMin);
    const maxVal = customMax === "" ? null : Number(customMax);

    if (
      (minVal !== null && (isNaN(minVal) || minVal < 0)) ||
      (maxVal !== null && (isNaN(maxVal) || maxVal < 0))
    ) {
      addToast(
        "Please enter valid, non-negative numbers for price range.",
        "error"
      );
      return;
    }
    if (minVal !== null && maxVal !== null && minVal > maxVal) {
      addToast("Minimum price cannot be greater than maximum price.", "error");
      return;
    }
    onCustomChange({ min: minVal, max: maxVal, isCustom: true });
  };

  return (
    <div className="w-full sm:w-auto">
      <label className="block text-sm font-semibold text-gray-800 mb-2 flex justify-between items-center">
        {label}
        {current !== null && (
          <button
            type="button"
            onClick={onClear}
            className="text-red-500 text-xs flex items-center hover:underline"
            aria-label="Clear price range"
          >
            <FaMinusCircle className="mr-1" /> Clear
          </button>
        )}
      </label>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`px-4 py-2 rounded-full border transition-all duration-200 ${
            current === null
              ? "bg-blue-800 text-white shadow-md"
              : "bg-gray-50 hover:bg-blue-100 text-gray-800"
          }`}
        >
          All
        </button>
        {buckets.map((b) => (
          <button
            type="button"
            key={b.text}
            onClick={() =>
              onChange({ min: b.min, max: b.max, isCustom: false })
            }
            className={`px-4 py-2 rounded-full border transition-all duration-200 ${
              current?.min === b.min &&
              current?.max === b.max &&
              !current.isCustom
                ? "bg-blue-800 text-white shadow-md"
                : "bg-gray-50 hover:bg-blue-100 text-gray-800"
            }`}
          >
            {b.text}
          </button>
        ))}
      </div>
      <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="font-semibold text-sm mb-2 text-gray-800">
          Custom Range
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
            min="0"
            className="w-1/2 border border-gray-200 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          />
          <span className="text-gray-600">-</span>
          <input
            type="number"
            placeholder="Max"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            min="0"
            className="w-1/2 border border-gray-200 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          />
          <button
            type="button"
            onClick={handleCustomApply}
            className="ml-2 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors text-sm shadow-md"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function DiscountSelector({ bins, selected, onChange, onClear }) {
  return (
    <div className="w-full sm:w-auto">
      <label className="block text-sm font-semibold text-gray-800 mb-2 flex justify-between items-center">
        Discount
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-red-500 text-xs flex items-center hover:underline"
            aria-label="Clear discount"
          >
            <FaMinusCircle className="mr-1" /> Clear
          </button>
        )}
      </label>
      <div className="flex flex-wrap gap-4">
        {bins.map((b) => (
          <label
            key={b.text}
            className="inline-flex items-center space-x-2 cursor-pointer text-gray-800"
          >
            <input
              type="checkbox"
              checked={selected.some((x) => x.min === b.min && x.max === b.max)}
              onChange={() => {
                const exists = selected.some(
                  (x) => x.min === b.min && x.max === b.max
                );
                const next = exists
                  ? selected.filter(
                      (x) => !(x.min === b.min && x.max === b.max)
                    )
                  : [...selected, b];
                onChange(next);
              }}
              className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span>{b.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PresetManager({ presets, onSave, onApply, onDelete }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  return (
    <div className="w-full sm:w-auto">
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-900 transition-colors text-sm"
          aria-label="Toggle presets"
        >
          <FaSave className="mr-2" /> Presets
        </button>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New preset name"
          className="border border-gray-200 p-2 rounded-lg flex-1 min-w-[120px] focus:ring-blue-500 focus:border-blue-500 text-gray-800"
        />
        <button
          type="button"
          onClick={() => {
            onSave(name);
            setName("");
          }}
          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-blue-100 transition-colors shadow-sm text-sm text-gray-800"
          disabled={!name.trim()}
        >
          Add Preset
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border border-gray-200 rounded-lg shadow-2xl mt-3 bg-gray-50"
            role="menu"
            aria-label="Saved presets"
          >
            {Object.entries(presets).map(([k, v]) => (
              <li
                key={k}
                className="p-3 flex justify-between items-center hover:bg-blue-100 border-b border-gray-200 last:border-b-0"
              >
                <span className="truncate text-gray-800 font-semibold">
                  {k}
                </span>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => onApply(v)}
                    className="text-blue-700 hover:text-blue-900 transition-colors text-sm"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(k)}
                    className="text-red-600 hover:text-red-800 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {!Object.keys(presets).length && (
              <li className="p-3 text-gray-500 text-center">
                No presets saved.
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const ProductCardLoader = () => (
  <div className="w-64 bg-white border border-gray-200 rounded-lg shadow-md animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: i * 0.1, ease: "easeOut" },
  }),
};

function ProductModal({
  product,
  onClose,
  onAddToCart,
  onToggleFavorite,
  isFavorited,
}) {
  if (!product) return null;

  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Trap focus within the modal
  useEffect(() => {
    if (modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      modalRef.current.addEventListener("keydown", handleTabKey);
      firstElement?.focus(); // Focus the first focusable element when modal opens

      return () => {
        if (modalRef.current) {
          modalRef.current.removeEventListener("keydown", handleTabKey);
        }
      };
    }
  }, [product]);

  const finalPrice = product.price - (product.price * product.discount) / 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      aria-modal="true"
      role="dialog"
      tabIndex="-1"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto p-6 relative flex flex-col sm:flex-row"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors text-xl"
          aria-label="Close product details"
        >
          <FaTimes />
        </button>

        <div className="sm:w-1/2 pr-0 sm:pr-6 mb-4 sm:mb-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto rounded-lg object-cover mb-4 shadow-md"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/400x300/b0c4de/333333?text=Product+Image";
            }}
          />
          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <img
                key={i}
                src={product.image.replace(product.id, product.id + i)}
                alt={`${product.name} thumbnail ${i + 1}`}
                className="w-16 h-16 object-cover rounded-md border border-gray-200 cursor-pointer hover:border-blue-500"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/100x100/e0e0e0/555555?text=Thumb";
                }}
              />
            ))}
          </div>
        </div>

        <div className="sm:w-1/2 flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{product.category}</p>
            <p className="text-gray-700 mb-4 text-base">
              {product.description}
            </p>
            <div className="flex items-baseline mb-4">
              <span className="text-blue-700 font-extrabold text-3xl mr-2">
                ₹{finalPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-gray-500 line-through mr-2">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="text-green-600 font-bold">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center text-gray-600 text-sm mb-4">
              <span className="mr-2">Popularity: {product.popularity}</span>
              {getTags(product).map((tag) => (
                <span
                  key={tag.text}
                  className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${tag.color} mr-2`}
                >
                  {tag.text}
                </span>
              ))}
            </div>
            <p className="text-gray-700 text-sm mb-4">
              <span className="font-semibold">Availability:</span>{" "}
              {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
            </p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-blue-800 text-white py-3 rounded-lg flex items-center justify-center font-semibold hover:bg-blue-900 transition-colors shadow-md"
              disabled={!product.inStock} // Ensure button is disabled if not in stock
            >
              <FaShoppingCart className="mr-2" /> Add to Cart
            </button>
            <button
              onClick={() => onToggleFavorite(product)}
              className={`p-3 rounded-lg border flex items-center justify-center transition-colors shadow-md ${
                isFavorited
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600"
              }`}
              aria-label={
                isFavorited ? "Remove from favorites" : "Add to favorites"
              }
            >
              <FaHeart />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProductListing() {
  const dispatch = useDispatch();
  const [allProducts, setAllProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cats, setCats] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [discountBins, setDiscountBins] = useState([]);
  const [presets, setPresets] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [hoverId, setHoverId] = useState(null);
  const [modalProd, setModalProd] = useState(null);
  const [page, setPage] = useState(1);
  const productsRef = useRef(null);
  const { toasts, addToast, removeToast } = useToast();

  const discountOptions = useMemo(
    () => [
      { min: 0, max: 10, text: "0–10%" },
      { min: 10, max: 20, text: "10–20%" },
      { min: 20, max: 30, text: "20–30%" },
      { min: 30, max: 50, text: "30–50%" },
      { min: 50, max: 100, text: "50%+" },
    ],
    []
  );

  const priceBuckets = useMemo(
    () => [
      { min: 0, max: 500, text: "₹0–500" },
      { min: 500, max: 1000, text: "₹500–1,000" },
      { min: 1000, max: 2000, text: "₹1,000–2,000" },
      { min: 2000, max: 5000, text: "₹2,000+" },
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setAllProducts(generateProducts());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const storedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(storedFavorites);
    } catch (error) {
      console.error("Failed to load favorites from localStorage:", error);
      setFavorites([]);
    }
  }, []);

  // Handle modal focus trap and escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modalProd) {
        setModalProd(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalProd]);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (cats.length && !cats.includes(p.category)) return false;
      if (priceRange) {
        const minMatch = priceRange.min === null || p.price >= priceRange.min;
        const maxMatch = priceRange.max === null || p.price <= priceRange.max;
        if (!(minMatch && maxMatch)) return false;
      }
      if (discountBins.length) {
        const matchesDiscount = discountBins.some(
          (b) =>
            p.discount >= b.min &&
            (b.max === 100 ? p.discount >= 50 : p.discount < b.max)
        );
        if (!matchesDiscount) return false;
      }
      return true;
    });
  }, [allProducts, search, cats, priceRange, discountBins]);

  const sorted = useMemo(() => sortItems(filtered, sortBy), [filtered, sortBy]);
  const PER = 12; // Products Per Page
  const total = Math.ceil(sorted.length / PER);
  const pageItems = sorted.slice((page - 1) * PER, page * PER);

  useEffect(() => {
    if (page > total && total > 0) {
      setPage(total);
    } else if (total === 0) {
      setPage(1);
    }
  }, [filtered, sortBy, page, total]);

  const savePreset = useCallback(
    (name) => {
      if (!name.trim()) {
        addToast("Please enter a name for the preset.", "error");
        return;
      }
      setPresets((prev) => ({
        ...prev,
        [name]: { search, cats, priceRange, discountBins },
      }));
      addToast(`Preset "${name}" saved!`, "success");
    },
    [search, cats, priceRange, discountBins, addToast]
  );

  const applyPreset = useCallback(
    (p) => {
      setSearch(p.search || "");
      setCats(p.cats || []);
      setPriceRange(p.priceRange || null);
      setDiscountBins(p.discountBins || []);
      addToast("Preset applied successfully!", "success");
    },
    [addToast]
  );

  const deletePreset = useCallback(
    (name) => {
      setPresets((prev) => {
        const np = { ...prev };
        delete np[name];
        return np;
      });
      addToast(`Preset "${name}" deleted.`, "success");
    },
    [addToast]
  );

  const resetAll = useCallback(() => {
    setSearch("");
    setCats([]);
    setPriceRange(null);
    setDiscountBins([]);
    addToast("All filters reset.", "success");
  }, [addToast]);

  const scrollToProducts = useCallback(() => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleAddToCart = useCallback(
    (product) => {
      // Since all products are now considered 'inStock', this check is less critical but good to keep if stock levels were to be re-introduced later.
      if (!product.inStock || product.stock <= 0) {
        addToast(`${product.name} is out of stock.`, "error");
        return;
      }
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price - (product.price * product.discount) / 100,
        img: product.image,
        qty: 1,
        stock: product.stock,
      };
      dispatch(addToCart(cartItem));
      addToast(`${product.name} added to cart!`, "success");
      try {
        const currentCart = JSON.parse(localStorage.getItem("cart")) || {
          items: [],
          saved: [],
          coupon: null,
          shipping: "standard",
        };
        const existingItem = currentCart.items.find(
          (item) => item.id === cartItem.id
        );
        if (existingItem) {
          // Check for stock limit before increasing quantity
          if (existingItem.qty < product.stock) {
            existingItem.qty += 1;
          } else {
            addToast(
              `Cannot add more ${product.name}, stock limit reached.`,
              "error"
            );
            return;
          }
        } else {
          currentCart.items.push(cartItem);
        }
        localStorage.setItem("cart", JSON.stringify(currentCart));
      } catch (error) {
        console.error("Failed to update cart in localStorage:", error);
        addToast("Failed to save cart item.", "error");
      }
    },
    [dispatch, addToast]
  );

  const handleToggleFavorite = useCallback(
    (product) => {
      try {
        const storedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];
        const isFavorited = storedFavorites.some(
          (fav) => fav.id === product.id
        );
        let updatedFavorites;

        if (isFavorited) {
          updatedFavorites = storedFavorites.filter(
            (fav) => fav.id !== product.id
          );
          addToast(`${product.name} removed from favorites.`, "success");
        } else {
          const favoriteItem = {
            id: product.id,
            name: product.name,
            price: product.price - (product.price * product.discount) / 100,
            img: product.image,
          };
          updatedFavorites = [...storedFavorites, favoriteItem];
          addToast(`${product.name} added to favorites!`, "success");
        }

        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
      } catch (error) {
        console.error("Failed to update favorites in localStorage:", error);
        addToast("Failed to update favorites.", "error");
      }
    },
    [addToast]
  );

  const isProductFavorited = useCallback(
    (productId) => {
      return favorites.some((fav) => fav.id === productId);
    },
    [favorites]
  );

  return (
    <>
      <Header />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="relative bg-gradient-to-br mb-12 from-gray-900 to-gray-700 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-40 z-0"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
          <motion.div
            className="text-center lg:text-left"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            role="region"
            aria-label="Hero section"
          >
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
              All Products
            </h1>
            <motion.p
              className="mt-4 text-lg sm:text-xl max-w-md mx-auto lg:mx-0 text-gray-200 leading-relaxed"
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              Discover our wide range of unique and high-quality products,
              tailored just for you.
            </motion.p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <motion.button
                onClick={scrollToProducts}
                className="inline-flex items-center justify-center bg-blue-800 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md hover:bg-blue-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Shop now"
              >
                Shop Now <FaShoppingCart className="ml-2" />
              </motion.button>
              <motion.button
                onClick={() => {
                  resetAll();
                  scrollToProducts();
                }}
                className="inline-flex items-center justify-center bg-gray-50 text-gray-800 px-6 py-3 rounded-full font-semibold text-sm shadow-md hover:bg-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View all products"
              >
                View All <FaEye className="ml-2" />
              </motion.button>
            </div>
          </motion.div>
          <motion.img
            src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Diverse Products"
            className="mt-8 lg:mt-0 lg:ml-12 w-full max-w-md h-48 sm:h-64 lg:h-80 object-cover rounded-2xl shadow-2xl"
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/800x600/b0c4de/333333?text=All+Products";
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-gray-50 p-6 rounded-2xl shadow-2xl mb-10 backdrop-blur-sm bg-opacity-80 top-0 z-20">
          <div className="flex justify-between items-center mb-4 border-b pb-4 border-gray-200">
            <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
              <FaFilter className="mr-3 text-blue-700 text-xl" /> Filters
            </h2>
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              aria-label={collapsed ? "Expand filters" : "Collapse filters"}
            >
              {collapsed ? (
                <FaChevronDown className="text-xl" />
              ) : (
                <FaChevronUp className="text-xl" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0, scale: 0.95 }}
                animate={{ height: "auto", opacity: 1, scale: 1 }}
                exit={{ height: 0, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
                role="region"
                aria-label="Filter controls"
              >
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <span className="text-sm font-semibold text-gray-800">
                    Showing:{" "}
                    <strong className="text-blue-700">{filtered.length}</strong>{" "}
                    products
                  </span>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-red-600 flex items-center text-sm font-semibold hover:underline transition-colors"
                    aria-label="Reset all filters"
                  >
                    <FaTrashAlt className="mr-1 text-sm" /> Reset All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Search & Categories
                    </h3>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Search Product
                      </label>
                      <div className="relative">
                        <FaSearch className="absolute top-3 left-3 text-gray-600" />
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search products by name..."
                          className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
                        />
                      </div>
                    </div>
                    <MultiSelect
                      label="Category"
                      options={CATEGORIES}
                      selected={cats}
                      onChange={setCats}
                      onClear={() => setCats([])}
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Price & Discount
                    </h3>
                    <PriceRangeSelector
                      label="Price Range"
                      buckets={priceBuckets}
                      current={priceRange}
                      onChange={setPriceRange}
                      onCustomChange={setPriceRange}
                      onClear={() => setPriceRange(null)}
                      addToast={addToast}
                    />
                    <DiscountSelector
                      bins={discountOptions}
                      selected={discountBins}
                      onChange={setDiscountBins}
                      onClear={() => setDiscountBins([])}
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Presets
                    </h3>
                    <PresetManager
                      presets={presets}
                      onSave={savePreset}
                      onApply={applyPreset}
                      onDelete={deletePreset}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="mb-12" ref={productsRef}>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
              Product List
            </h2>
            <div className="flex items-center space-x-3">
              <label
                htmlFor="sort-by"
                className="text-gray-700 text-sm font-medium"
              >
                Sort by:
              </label>
              <div className="relative">
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Sort products by"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FaSort className="text-xs" />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(PER)].map((_, i) => (
                <ProductCardLoader key={i} />
              ))}
            </div>
          ) : (
            <>
              {pageItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  <AnimatePresence>
                    {pageItems.map((product, i) => (
                      <motion.div
                        key={product.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        custom={i}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border border-gray-100"
                        onMouseEnter={() => setHoverId(product.id)}
                        onMouseLeave={() => setHoverId(null)}
                        role="article"
                        aria-labelledby={`product-name-${product.id}`}
                      >
                        <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/400x300/b0c4de/333333?text=Product";
                            }}
                          />
                          <div className="absolute top-2 right-2 flex space-x-2">
                            {getTags(product).map((tag) => (
                              <span
                                key={tag.text}
                                className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${tag.color} shadow-md`}
                              >
                                {tag.text}
                              </span>
                            ))}
                          </div>
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: hoverId === product.id ? 1 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setModalProd(product)}
                            className="absolute bottom-2 left-2 bg-blue-700 text-white p-2 rounded-full shadow-lg hover:bg-blue-800 transition-colors"
                            aria-label={`View details for ${product.name}`}
                          >
                            <FaEye />
                          </motion.button>
                        </div>
                        <div className="p-5">
                          <h3
                            id={`product-name-${product.id}`}
                            className="text-xl font-semibold text-gray-900 mb-2 truncate"
                          >
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {product.category}
                          </p>
                          <div className="flex items-baseline mb-4">
                            <span className="text-blue-700 font-bold text-2xl mr-2">
                              ₹
                              {(
                                product.price -
                                (product.price * product.discount) / 100
                              ).toFixed(2)}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-gray-500 line-through text-sm">
                                ₹{product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex items-center bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors shadow-md"
                              aria-label={`Add ${product.name} to cart`}
                              disabled={!product.inStock || product.stock <= 0} // Disable if out of stock
                            >
                              <FaShoppingCart className="mr-2" /> Add to Cart
                            </button>
                            <button
                              onClick={() => handleToggleFavorite(product)}
                              className={`p-2 rounded-full transition-colors ${
                                isProductFavorited(product.id)
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600"
                              }`}
                              aria-label={
                                isProductFavorited(product.id)
                                  ? `Remove ${product.name} from favorites`
                                  : `Add ${product.name} to favorites`
                              }
                            >
                              <FaHeart />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-600 text-lg">
                    No products match your filters.
                  </p>
                  <button
                    onClick={resetAll}
                    className="mt-4 inline-flex items-center bg-blue-800 text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-blue-900 transition-colors shadow-md"
                  >
                    <FaTrashAlt className="mr-2" /> Reset Filters
                  </button>
                </div>
              )}
            </>
          )}

          {total > 1 && (
            <div
              className="flex justify-center items-center space-x-3 mt-12 mb-8"
              role="navigation"
              aria-label="Pagination"
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors ${
                    p === page
                      ? "bg-blue-800 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-current={p === page ? "page" : undefined}
                  aria-label={`Page ${p}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(total, p + 1))}
                disabled={page === total}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {modalProd && (
          <ProductModal
            product={modalProd}
            onClose={() => setModalProd(null)}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            isFavorited={isProductFavorited(modalProd.id)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

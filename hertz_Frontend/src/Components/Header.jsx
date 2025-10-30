import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaArrowLeft,
  FaQuestionCircle,
  FaFolderOpen,
  FaHeart,
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaSpinner,
} from "react-icons/fa";
import { logout } from "../Features/Auth/authSlice";
import logo from "../assets/HomePage/logo.svg";
import axios from "axios";
import _ from "lodash";
import CouponBanner from "./CouponBanner";

// Preloader component for initial page load
const Preloader = () => (
  <motion.div
    className="fixed inset-0 bg-white flex items-center justify-center z-50"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 1, ease: "easeOut" } }}
  >
    <FaSpinner className="text-blue-900 text-4xl animate-spin" />
  </motion.div>
);

// Utility function to format category links
const formatLink = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/:/g, "")
    .replace(/[^\w-]/g, "");

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: i * 0.1, ease: "easeOut" },
  }),
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(
    !sessionStorage.getItem("hasVisitedHome")
  );
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // --- COUPON BANNER STATE ---
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  const API_BASE_URL = "http://localhost:8000/api/v1";

  // Handle preloader timeout
  useEffect(() => {
    if (!sessionStorage.getItem("hasVisitedHome")) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasVisitedHome", "true");
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const response = await axios.get(`${API_BASE_URL}/categories`);
        const fetchedCategories = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        const transformedCategories = fetchedCategories.map((cat) => ({
          name: cat.name,
          sub: cat.subcategories
            ? cat.subcategories.map((sub) => sub.name)
            : [],
        }));
        setCategories([
          { name: "View All", sub: [] },
          ...transformedCategories,
        ]);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([{ name: "View All", sub: [] }]); // Fallback
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch active coupon for banner
  useEffect(() => {
    const fetchActiveCoupon = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/coupons/public`);
        if (response.data.success && response.data.data.length > 0) {
          // Get the best coupon (first one since backend sorts by discount value)
          setActiveCoupon(response.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching public coupons:", error);
        // Keep banner visible with fallback content if API fails
      }
    };

    fetchActiveCoupon();
  }, []);

  // --- SEARCH LOGIC ---
  const debouncedSearch = useCallback(
    _.debounce(async (query) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        setSearchLoading(true);
        // Assumes a new search endpoint exists on your backend
        const response = await axios.get(
          `${API_BASE_URL}/products/search?q=${query}`
        );
        setSearchResults(response.data.data || []);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    // Cleanup debounce on unmount
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery("");
      setSearchResults([]);
      setSearchActive(false);
    }
  };

  // Handle logout action
  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem("hasVisitedHome");
    navigate("/");
  };

  // Copy coupon code to clipboard
  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      // You can replace this with a toast notification if you have one
      alert(`Coupon code ${code} copied to clipboard!`);
    } catch (err) {
      console.error("Failed to copy coupon code:", err);
    }
  };

  // Generate category link path
  const linkPath = (name) =>
    name === "View All" ? "/category" : `/category/${formatLink(name)}`;

  if (categoryLoading) {
    return (
      <header className="font-montserrat w-full bg-white text-blue-900 shadow-md border-b border-gray-200 z-50">
        <div className="h-14 flex items-center justify-center">
          <FaSpinner className="text-blue-900 text-2xl animate-spin" />
        </div>
      </header>
    );
  }

  const SearchInput = ({ isMobile }) => (
    <div className="flex-1 relative">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          autoFocus={isMobile}
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="w-full border border-gray-200 bg-gray-100 text-blue-900 placeholder-blue-900 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-700 text-sm"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-900"
        >
          <FaSearch />
        </button>
      </form>
      {searchQuery && (
        <AnimatePresence>
          <motion.div
            className="absolute top-full mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {searchLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : searchResults.length > 0 ? (
              <ul>
                {searchResults.map((product) => (
                  <li key={product._id}>
                    <Link
                      to={`/product/${product.slug}`}
                      className="flex items-center p-3 hover:bg-gray-100"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        setSearchActive(false);
                      }}
                    >
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="w-12 h-12 object-cover mr-4 rounded"
                      />
                      <div>
                        <p className="font-semibold text-sm text-blue-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {product.category.name}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No results found.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );

  return (
    <>
      <AnimatePresence>{isLoading && <Preloader />}</AnimatePresence>

      <header className="font-montserrat w-full bg-white text-blue-900 shadow-md border-b border-gray-200 z-50">
        {/* Mobile Top Bar */}
        <div className="md:hidden h-14 flex items-center relative bg-white border-b border-gray-200">
          {searchActive ? (
            <motion.div
              className="flex items-center w-full px-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                onClick={() => setSearchActive(false)}
                className="text-blue-900 text-xl mr-3"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label="Close search"
              >
                <FaArrowLeft />
              </motion.button>
              <SearchInput isMobile={true} />
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center justify-between w-full px-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center space-x-4 text-blue-900">
                <motion.button
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  className="text-xl"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  aria-label={drawerOpen ? "Close menu" : "Open menu"}
                >
                  {drawerOpen ? <FaTimes /> : <FaBars />}
                </motion.button>
                <motion.button
                  onClick={() => setSearchActive(true)}
                  className="text-xl"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  aria-label="Open search"
                >
                  <FaSearch />
                </motion.button>
              </div>
              <Link to="/">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
              </Link>
              <div className="flex items-center space-x-4 text-blue-900">
                <Link to="/favorites">
                  <FaHeart className="text-xl" aria-label="Favorites" />
                </Link>
                {isAuthenticated ? (
                  <motion.button
                    onClick={handleLogout}
                    className="text-xl"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    aria-label="Logout"
                  >
                    <FaSignOutAlt />
                  </motion.button>
                ) : (
                  <Link to="/login" aria-label="Sign in">
                    <FaUser className="text-xl" />
                  </Link>
                )}
                <Link to="/cart">
                  <FaShoppingCart className="text-xl" aria-label="Cart" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* Desktop Main Bar */}
        <div className="hidden md:flex max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 items-center justify-between py-4 bg-white">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="text-blue-900 lg:hidden text-2xl"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
            >
              <FaBars />
            </motion.button>
            <Link to="/">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
            </Link>
          </div>

          <div className="flex flex-1 mx-4 sm:mx-6 relative">
            <SearchInput isMobile={false} />
          </div>

          <div className="flex items-center space-x-6 text-blue-900">
            <Link
              to="/help"
              className="flex items-center space-x-1 hover:text-blue-700 text-sm font-medium"
            >
              <FaQuestionCircle />
              <span>Help</span>
            </Link>
            <Link
              to="/projects"
              className="flex items-center space-x-1 hover:text-blue-700 text-sm font-medium"
            >
              <FaFolderOpen />
              <span>Projects</span>
            </Link>
            <Link
              to="/favorites"
              className="flex items-center space-x-1 hover:text-blue-700 text-sm font-medium"
            >
              <FaHeart />
              <span>Favorites</span>
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 hover:text-blue-700 text-sm font-medium"
                  >
                    <FaUser />
                    <span>Admin</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 hover:text-blue-700 text-sm font-medium"
                  >
                    <FaUser />
                    <span>Profile</span>
                  </Link>
                )}
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-red-500 text-sm font-medium"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 hover:text-blue-700 text-sm font-medium"
              >
                <FaUser />
                <span>Sign In</span>
              </Link>
            )}
            <Link
              to="/cart"
              className="flex items-center space-x-1 hover:text-blue-700 text-sm font-medium"
            >
              <FaShoppingCart />
              <span>Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile Drawer & Desktop Nav (unchanged) */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              className="lg:hidden bg-white border-t border-gray-200 shadow-inner"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <nav className="px-4 pb-4">
                <ul className="space-y-2 text-blue-900">
                  {categories.map((cat, index) => (
                    <motion.li
                      key={cat.name}
                      className="py-2 border-b border-gray-200"
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <details>
                        <summary className="cursor-pointer hover:text-blue-700 text-sm font-medium">
                          <Link
                            to={linkPath(cat.name)}
                            onClick={() => {
                              setDrawerOpen(false);
                            }}
                          >
                            {cat.name}
                          </Link>
                        </summary>
                        {cat.sub.length > 0 && (
                          <ul className="pl-4 mt-2 space-y-1">
                            {cat.sub.map((item, subIndex) => (
                              <motion.li
                                key={item}
                                variants={linkVariants}
                                initial="hidden"
                                animate="visible"
                                custom={subIndex}
                              >
                                <Link
                                  to={`${linkPath(cat.name)}#${formatLink(
                                    item
                                  )}`}
                                  className="block text-sm text-blue-900 hover:text-blue-700 transition"
                                  onClick={() => {
                                    setDrawerOpen(false);
                                  }}
                                >
                                  {item}
                                </Link>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </details>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="hidden lg:block bg-white border-t border-gray-200">
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex space-x-6 py-3 items-center justify-around text-blue-900 text-sm">
              {categories.map((cat, index) => (
                <motion.li
                  key={cat.name}
                  className="relative"
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <div className="inline-block group">
                    <Link
                      to={linkPath(cat.name)}
                      className="hover:text-blue-700 transition whitespace-nowrap py-2 block font-medium"
                    >
                      {cat.name}
                    </Link>
                    {cat.sub.length > 0 && (
                      <motion.div
                        className="absolute top-full left-0 w-64 bg-white shadow-md rounded-md border border-gray-200 z-50 p-2 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 ease-in-out pointer-events-none group-hover:pointer-events-auto"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <ul className="space-y-1">
                          {cat.sub.map((item, subIndex) => (
                            <motion.li
                              key={item}
                              variants={linkVariants}
                              initial="hidden"
                              animate="visible"
                              custom={subIndex}
                            >
                              <Link
                                to={`${linkPath(cat.name)}#${formatLink(item)}`}
                                className="block px-4 py-2 text-sm text-blue-900 hover:bg-gray-100 hover:text-blue-700 rounded transition"
                              >
                                {item}
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </nav>
        {/* Dynamic Coupon Banner */}
        <AnimatePresence>
          {bannerVisible && activeCoupon && (
            <CouponBanner
              activeCoupon={activeCoupon}
              bannerVisible={bannerVisible}
              setBannerVisible={setBannerVisible}
              copyToClipboard={copyToClipboard}
            />
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;

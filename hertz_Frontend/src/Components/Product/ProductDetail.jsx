import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Assuming react-router-dom is installed
import { useDispatch } from "react-redux"; // Assuming react-redux is installed
import { FaChevronLeft, FaUpload, FaHeart } from "react-icons/fa"; // Assuming react-icons/fa is installed
import { motion } from "framer-motion"; // Assuming framer-motion is installed
import { addToCart } from "../../Components/Cart/cartSlice"; // Assuming cartSlice exists at this path

/**
 * ALL_PRODUCTS Array
 * This array serves as a mock database for product information.
 * In a real application, this data would typically come from an API or a backend.
 * Each product object contains details like ID, name, type, tags, description,
 * image URLs, pricing tiers, available sizes, and colors.
 */
const ALL_PRODUCTS = [
  {
    id: "personalize-mugs",
    name: "Personalize Mugs",
    type: "gifts",
    tags: ["Hot Drink", "Customizable", "Great for Gifts"],
    longDescription:
      "Start your morning right with a custom mug! Upload your design or pick a ready-made one. Dishwasher-safe, microwave-friendly, and shipped same-day for prepaid orders.",
    baseImage:
      "https://placehold.co/600x450/333333/ffffff?text=Personalize+Mug",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=Mug+Angle+1",
      "https://placehold.co/600x450/B8DAEC/333333?text=Mug+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=Mug+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, price: 1100 },
      { qty: 2, price: 2000 },
      { qty: 5, price: 4500 },
      { qty: 10, price: 8500 },
    ],
    sizes: ["180ml", "270ml", "320ml", "430ml"],
    colors: ["White", "Black", "Blue", "Red"],
  },
  {
    id: "Raincoats",
    name: "Raincoats",
    type: "gifts",
    tags: ["Waterproof", "Customizable", "Travel-Friendly"],
    longDescription:
      "Add your design or logo. Lightweight, waterproof, and easy to carry. Perfect for travel, events, or daily use. Fast shipping on prepaid orders!",
    baseImage:
      "https://placehold.co/600x450/333333/ffffff?text=Poncho+Raincoat",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=Raincoat+Angle+1",
      "https://placehold.co/600x450/B8DAEC/333333?text=Raincoat+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=Raincoat+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, price: 1100 },
      { qty: 2, price: 2000 },
      { qty: 5, price: 4500 },
      { qty: 10, price: 8500 },
    ],
  },
  {
    id: "poncho-raincoats",
    name: "Poncho Raincoats",
    type: "gifts",
    tags: ["Waterproof", "Customizable", "Travel-Friendly"],
    longDescription:
      "Poncho Raincoats available guys !!!Add your design or logo. Lightweight, waterproof, and easy to carry. Perfect for travel, events, or daily use. Fast shipping on prepaid orders!",
    baseImage:
      "https://placehold.co/600x450/333333/ffffff?text=Poncho+Raincoat",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=Raincoat+Angle+1",
      "https://placehold.co/600x450/B8DAEC/333333?text=Raincoat+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=Raincoat+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, price: 1100 },
      { qty: 2, price: 2000 },
      { qty: 5, price: 4500 },
      { qty: 10, price: 8500 },
    ],
    colors: ["Black", "Grey"],
  },
  {
    id: "Cotton Caps",
    name: "Cotton Caps",
    type: "gifts",
    tags: ["Waterproof", "Customizable", "Outdoor"],
    longDescription:
      "Protect yourself from the rain while promoting your brand. Our rain caps are made from high-quality waterproof material, designed for comfort and durability. Add your logo or design for a personalized touch. Great for outdoor events, daily commutes, or giveaways. Fast same-day shipping on prepaid orders!",
    baseImage:
      "https://placehold.co/600x450/333333/ffffff?text=Waterproof+Rain+Cap",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=Cap+Angle+1",
      "https://placehold.co/600x450/B8DAEC/333333?text=Cap+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=Cap+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, price: 1100 },
      { qty: 2, price: 2000 },
      { qty: 5, price: 4500 },
      { qty: 10, price: 8500 },
    ],
    colors: ["White", "Black", "Grey", "red"],
  },
  {
    id: "promotional-umbrellas",
    name: "Promotional Umbrellas",
    type: "gifts",
    tags: ["Waterproof", "Customizable", "Promotional"],
    longDescription:
      "Make your brand stand out—rain or shine! Our promotional umbrellas are strong, stylish, and fully customizable with your logo or design. Perfect for corporate gifts, events, or giveaways. With high-quality waterproof fabric and sturdy frames, they offer both visibility and protection. Fast same-day shipping on prepaid orders!",
    baseImage:
      "https://placehold.co/600x450/333333/ffffff?text=Promotional+Umbrella",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=Umbrella+Angle+1",
      "https://placehold.co/600x450/B8DAEC/333333?text=Umbrella+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=Umbrella+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, price: 1100 },
      { qty: 2, price: 2000 },
      { qty: 5, price: 4500 },
      { qty: 10, price: 8500 },
    ],
  },
  {
    id: "Two Fold Umbrella",
    name: "Two Fold Umbrella",
    type: "gifts",
    tags: ["Waterproof", "Customizable", "Promotional"],
    longDescription:
      "Make your brand stand out—rain or shine! Our promotional umbrellas are strong, stylish, and fully customizable with your logo or design. Perfect for corporate gifts, events, or giveaways. With high-quality waterproof fabric and sturdy frames, they offer both visibility and protection. Fast same-day shipping on prepaid orders!",
    baseImage:
      "https://placehold.co/600x450/333333/ffffff?text=Promotional+Umbrella",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=Umbrella+Angle+1",
      "https://placehold.co/600x450/B8DAEC/333333?text=Umbrella+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=Umbrella+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, price: 1100 },
      { qty: 2, price: 2000 },
      { qty: 5, price: 4500 },
      { qty: 10, price: 8500 },
    ],
    colors: ["Black", "Grey"],
  },
  {
    id: "Polo T-Shirts",
    name: "Polo T-Shirts",
    type: "gifts",
    tags: ["Apparel", "Customizable", "Premium"],
    longDescription:
      "Premium quality meets everyday comfort. Personalize these stylish polo t-shirts with your logo or design—perfect for corporate wear, events, or team uniforms. Made from soft, breathable fabric for all-day wear. Durable, comfortable, and designed to leave a lasting impression. Fast same-day shipping on prepaid orders!",
    baseImage: "https://placehold.co/600x450/333333/ffffff?text=Polo+T-Shirt",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=T-Shirt+Angle+1",
      "https://placehold.co/600x450/B8DAEC/333333?text=T-Shirt+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=T-Shirt+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, price: 1100 },
      { qty: 2, price: 2000 },
      { qty: 5, price: 4500 },
      { qty: 10, price: 8500 },
    ],
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["White", "Black", "#4ABCF9", "pink", "red", "yellow", "gray"],
  },
  {
    id: "Cotton T-shirts",
    name: "Cotton T-shirts",
    type: "gifts",
    tags: ["Apparel", "Customizable", "Premium"],
    longDescription:
      "Elevate your casual style with our premium cotton T-shirts. Personalize with your logo or design—ideal for events, team uniforms, or everyday wear. Crafted from soft, breathable cotton for maximum comfort and durability. Make a statement with your custom design. Fast same-day shipping on prepaid orders!",
    baseImage: "https://placehold.co/600x450/333333/ffffff?text=Cotton+T-Shirt",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=T-Shirt+Angle+1",
      "https://placehold.co/600x450/B8DAEC/333333?text=T-Shirt+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=T-Shirt+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, price: 1100 },
      { qty: 2, price: 2000 },
      { qty: 5, price: 4500 },
      { qty: 10, price: 8500 },
    ],
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["White", "Black", "#4ABCF9", "pink", "red", "yellow", "gray"],
  },
  {
    id: "premium-gift-bags",
    name: "Premium Gift Bags",
    type: "gifts",
    tags: ["Packaging", "Customizable", "Premium"],
    longDescription:
      "Perfect for corporate gifts, special occasions, or product packaging. These elegant gift bags can be customized with your brand logo or design. Made from high-quality materials with strong handles and a stylish finish. Impress your clients and customers with packaging that speaks volumes. Fast same-day shipping on prepaid orders!",
    baseImage: "https://placehold.co/600x450/333333/ffffff?text=Gift+Bag",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=Bag+Angle+1",
      "https://placehold.co/600x450/B8DAEC/333333?text=Bag+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=Bag+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, size: "S", price: 1100 },
      { qty: 2, size: "S", price: 2000 },
      { qty: 5, size: "S", price: 4500 },
      { qty: 10, size: "S", price: 8500 },
      { qty: 1, size: "M", price: 1200 },
      { qty: 2, size: "M", price: 2200 },
      { qty: 5, size: "M", price: 5000 },
      { qty: 10, size: "M", price: 9000 },
    ],
    sizes: [
      { id: "S", dimensions: '7.5" x 3.1" x 8.3"' },
      { id: "M", dimensions: '9.4" x 4.3" x 12.2"' },
    ],
    paperStocks: ["White Kraft", "Brown Kraft"],
  },
  {
    id: "signs-and-banners",
    name: "Signs and Banners",
    type: "promotional",
    tags: ["Customizable", "Outdoor", "Promotional"],
    longDescription:
      "Make a bold statement with our customizable signs and banners! Perfect for events, businesses, or outdoor advertising. Upload your design or choose from templates. Durable materials and weather-resistant options available. Fast same-day shipping on prepaid orders!",
    baseImage:
      "https://placehold.co/600x450/333333/ffffff?text=Signs+and+Banners",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=Banner+Angle+1",
      "https://placehold.co/600x450/B8DADE/333333?text=Banner+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=Banner+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, price: 1500 },
      { qty: 2, price: 2800 },
      { qty: 5, price: 6500 },
      { qty: 10, price: 12000 },
    ],
    sizes: [
      { id: "S", dimensions: "2ft x 3ft" },
      { id: "M", dimensions: "4ft x 6ft" },
      { id: "L", dimensions: "6ft x 10ft" },
    ],
    materials: ["Vinyl", "Mesh", "Fabric"],
  },
  {
    id: "premium-xyz2",
    name: "Premium XYZ2",
    type: "gifts",
    tags: ["Customizable", "Premium", "Gift"],
    longDescription:
      "A perfect blend of style and utility, the Premium XYZ2 is designed to leave a lasting impression. Whether used as a gift, giveaway, or part of a premium package, this product combines top-quality materials with elegant design. Customize it with your brand logo or message. Ideal for events, clients, or festive occasions. Fast same-day shipping on prepaid orders!",
    baseImage: "https://placehold.co/600x450/333333/ffffff?text=Premium+XYZ2",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=XYZ2+Angle+1",
      "https://placehold.co/600x450/B8DAEC/333333?text=XYZ2+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=XYZ2+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, price: 1100 },
      { qty: 2, price: 2000 },
      { qty: 5, price: 4500 },
      { qty: 10, price: 8500 },
    ],
  },
  {
    id: "premium-xyz3",
    name: "Premium XYZ3",
    type: "gifts",
    tags: ["Customizable", "Premium", "Gift"],
    longDescription:
      "A perfect blend of style and utility, the Premium XYZ3 is designed to leave a lasting impression. Whether used as a gift, giveaway, or part of a premium package, this product combines top-quality materials with elegant design. Customize it with your brand logo or message. Ideal for events, clients, or festive occasions. Fast same-day shipping on prepaid orders!",
    baseImage: "https://placehold.co/600x450/333333/ffffff?text=Premium+XYZ3",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=XYZ3+Angle+1",
      "https://placehold.co/600x450/B8DAEC/333333?text=XYZ3+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=XYZ3+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, size: "L", price: 1100 },
      { qty: 2, size: "L", price: 2000 },
      { qty: 5, size: "L", price: 4500 },
      { qty: 10, size: "L", price: 8500 },
      { qty: 1, size: "XL", price: 1200 },
      { qty: 2, size: "XL", price: 2200 },
      { qty: 5, size: "XL", price: 5000 },
      { qty: 10, size: "XL", price: 9000 },
      { qty: 1, size: "2XL", price: 1300 },
      { qty: 2, size: "2XL", price: 2400 },
      { qty: 5, size: "2XL", price: 5500 },
      { qty: 10, size: "2XL", price: 9500 },
    ],
  },
  {
    id: "explore2",
    name: "Explore 2",
    type: "gifts",
    tags: ["Customizable", "Premium", "Gift"],
    longDescription:
      "A perfect blend of style and utility, the Explore 2 is designed to leave a lasting impression. Whether used as a gift, giveaway, or part of a premium package, this product combines top-quality materials with elegant design. Customize it with your brand logo or message. Ideal for events, clients, or festive occasions. Fast same-day shipping on prepaid orders!",
    baseImage: "https://placehold.co/600x450/333333/ffffff?text=Explore+2",
    gallery: [
      "https://placehold.co/600x450/D1ECF1/333333?text=XYZ2+Angle+1",
      "https://placehold.co/600x450/B8DAEC/333333?text=XYZ2+Angle+2",
      "https://placehold.co/600x450/9FCDDC/333333?text=XYZ2+Angle+3",
    ],
    pricingTiers: [
      { qty: 1, price: 1100 },
      { qty: 2, price: 2000 },
      { qty: 5, price: 4500 },
      { qty: 10, price: 8500 },
    ],
  },
];

// Framer Motion variants for animations
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const buttonVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97 },
};

/**
 * ProductDetail Component
 * Displays the detailed information for a specific product, including images,
 * description, pricing, size/color options, and add-to-cart functionality.
 * It fetches product data based on the productId from the URL parameters.
 */
export default function ProductDetail() {
  const { productId } = useParams(); // Get productId from the URL
  const dispatch = useDispatch(); // Redux dispatch hook
  const navigate = useNavigate(); // React Router navigate hook

  // Find the product from the ALL_PRODUCTS array based on the productId
  const product = ALL_PRODUCTS.find((p) => p.id === productId);

  // State for managing the main displayed image, uploaded design, and selected options
  const [mainImage, setMainImage] = useState(product?.baseImage || "");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedQty, setSelectedQty] = useState(
    product?.pricingTiers[0].qty || 1
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes
      ? typeof product.sizes[0] === "string"
        ? product.sizes[0]
        : product.sizes[0].id
      : null
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.colors ? product.colors[0] : null
  );
  const [selectedPaperStock, setSelectedPaperStock] = useState(
    product?.paperStocks ? product.paperStocks[0] : null
  );
  const [selectedMaterial, setSelectedMaterial] = useState(
    product?.materials ? product.materials[0] : null
  );
  const [isFavorited, setIsFavorited] = useState(false);

  // Effect to check if the product is in favorites on component mount
  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      setIsFavorited(favorites.some((fav) => fav.id === product?.id));
    } catch (error) {
      console.error("Failed to parse favorites from localStorage:", error);
      setIsFavorited(false);
    }
  }, [product?.id]);

  // Effect to manage the URL for the uploaded file (create and revoke Object URL)
  useEffect(() => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      return () => URL.revokeObjectURL(url);
    }
  }, [uploadedFile]);

  // Memoized value for the image source to display
  const previewSrc = useMemo(() => {
    if (uploadedFile) return URL.createObjectURL(uploadedFile);
    return mainImage;
  }, [uploadedFile, mainImage]);

  // Determine the current pricing tier based on selected quantity and size
  const tier = useMemo(() => {
    const relevantTiers = product?.pricingTiers.filter(
      (tierItem) => !tierItem.size || tierItem.size === selectedSize
    );
    return (
      relevantTiers?.find((t) => t.qty === selectedQty) ||
      relevantTiers?.[0] || { qty: 1, price: 0 }
    );
  }, [product?.pricingTiers, selectedQty, selectedSize]);

  /**
   * Handles adding the selected product to the cart.
   */
  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: tier.price,
        img: previewSrc,
        qty: selectedQty,
        size: selectedSize,
        color: selectedColor,
        paperStock: selectedPaperStock,
        material: selectedMaterial,
      })
    );
    navigate("/cart");
  };

  /**
   * Handles navigating to the design tool for customization.
   */
  const handleUploadDesign = () => {
    navigate(`/design-tool?productId=${product.id}`);
  };

  /**
   * Toggles the favorite status of the product and updates localStorage.
   */
  const handleToggleFavorite = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (isFavorited) {
        const updated = favorites.filter((f) => f.id !== product.id);
        localStorage.setItem("favorites", JSON.stringify(updated));
        setIsFavorited(false);
      } else {
        favorites.push({
          id: product.id,
          name: product.name,
          price: tier.price,
          img: previewSrc,
          size: selectedSize,
          color: selectedColor,
          paperStock: selectedPaperStock,
          material: selectedMaterial,
        });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Failed to update favorites in localStorage:", error);
    }
  };

  /**
   * Navigates back to the trending products page (homepage).
   */
  const handleBackToTrending = () => {
    navigate("/");
  };

  // Render a "Product not found" message if the product ID doesn't match any product
  if (!product) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-white p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white rounded-lg shadow p-6 text-center max-w-xs w-full">
          <p className="text-lg font-bold uppercase text-blue-900 mb-3">
            Product not found
          </p>
          <motion.button
            onClick={handleBackToTrending}
            className="inline-flex items-center text-blue-900 hover:text-blue-800 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaChevronLeft className="mr-1" /> Back to Trending
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="font-sans bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* Back Button */}
        <motion.button
          onClick={handleBackToTrending}
          className="inline-flex items-center text-blue-900 hover:text-blue-800 mb-6 font-medium transition-colors"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaChevronLeft className="mr-2 w-5 h-5" />
          Back to Trending
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <motion.div
              className="w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
              variants={imageVariants}
            >
              <img
                src={previewSrc}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/600x450/CCCCCC/666666?text=Image+Load+Error";
                }}
              />
            </motion.div>
            {/* Gallery Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {product.gallery.map((src, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    setMainImage(src);
                    setUploadedFile(null);
                  }}
                  className={`flex-shrink-0 w-16 h-12 border-2 rounded-md overflow-hidden transition-all duration-200 ease-in-out ${
                    mainImage === src && !uploadedFile
                      ? "border-blue-900 shadow-md"
                      : "border-gray-200 hover:border-blue-500"
                  }`}
                  variants={imageVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <img
                    src={src}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/66x48/E0E0E0/888888?text=Error";
                    }}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl sm:text-3xl font-bold uppercase text-blue-900">
                {product.name}
              </h1>
              <motion.button
                onClick={handleToggleFavorite}
                className={`text-2xl p-2 rounded-full transition-colors duration-200 ${
                  isFavorited
                    ? "text-red-600 bg-red-50"
                    : "text-gray-400 hover:text-red-500 hover:bg-gray-100"
                }`}
                title={
                  isFavorited ? "Remove from Favorites" : "Add to Favorites"
                }
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaHeart />
              </motion.button>
            </div>

            <div className="text-3xl font-extrabold text-blue-900">
              ₹{tier.price}
            </div>

            <p className="text-base text-gray-700 leading-relaxed">
              {product.longDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Color Section */}
            {product.colors && product.colors.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h2 className="text-sm font-medium uppercase text-blue-900 mb-3">
                  COLOR
                </h2>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedColor === color
                          ? "border-blue-900 ring-2 ring-blue-500"
                          : "border-gray-300 hover:border-blue-500"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title={color}
                    >
                      {selectedColor === color && (
                        <svg
                          className="w-5 h-5 text-white drop-shadow-sm"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Section */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h2 className="text-sm font-medium uppercase text-blue-900 mb-3">
                  SIZE
                </h2>
                <div className="flex gap-4">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={typeof size === "string" ? size : size.id}
                      onClick={() =>
                        setSelectedSize(
                          typeof size === "string" ? size : size.id
                        )
                      }
                      className={`px-6 py-3 text-lg rounded-lg border-2 font-medium transition-all duration-200 ${
                        selectedSize ===
                        (typeof size === "string" ? size : size.id)
                          ? "bg-blue-900 text-white border-blue-900 shadow-md"
                          : "bg-white text-blue-900 border-gray-300 hover:bg-blue-50 hover:border-blue-500"
                      }`}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {typeof size === "string" ? size : size.dimensions}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Paper Stock Section */}
            {product.paperStocks && product.id === "premium-gift-bags" && (
              <div className="pt-4 border-t border-gray-100">
                <h2 className="text-sm font-medium uppercase text-blue-900 mb-3">
                  Paper Stock
                </h2>
                <div className="flex gap-4">
                  {product.paperStocks.map((stock) => (
                    <motion.button
                      key={stock}
                      onClick={() => setSelectedPaperStock(stock)}
                      className={`px-6 py-3 text-lg rounded-lg border-2 font-medium transition-all duration-200 ${
                        selectedPaperStock === stock
                          ? "bg-blue-900 text-white border-blue-900 shadow-md"
                          : "bg-white text-blue-900 border-gray-300 hover:bg-blue-50 hover:border-blue-500"
                      }`}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {stock}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Material Section */}
            {product.materials && product.id === "signs-and-banners" && (
              <div className="pt-4 border-t border-gray-100">
                <h2 className="text-sm font-medium uppercase text-blue-900 mb-3">
                  Material
                </h2>
                <div className="flex gap-4">
                  {product.materials.map((material) => (
                    <motion.button
                      key={material}
                      onClick={() => setSelectedMaterial(material)}
                      className={`px-6 py-3 text-lg rounded-lg border-2 font-medium transition-all duration-200 ${
                        selectedMaterial === material
                          ? "bg-blue-900 text-white border-blue-900 shadow-md"
                          : "bg-white text-blue-900 border-gray-300 hover:bg-blue-50 hover:border-blue-500"
                      }`}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {material}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Section */}
            <div className="pt-4 border-t border-gray-100">
              <h2 className="text-sm font-medium uppercase text-blue-900 mb-3">
                QUANTITY
              </h2>
              <select
                value={selectedQty}
                onChange={(e) => setSelectedQty(parseInt(e.target.value))}
                className="w-full px-4 py-2 text-xs rounded-lg border-2 border-blue-900 font-medium transition-all duration-200 text-blue-900 border-gray-300 hover:bg-blue-50 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  height: "40px",
                  maxHeight: "120px",
                  overflowY: "auto",
                  appearance: "menulist",
                }}
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((qty) => {
                  const tierMatch =
                    product.pricingTiers.find(
                      (t) =>
                        t.qty === qty && (!t.size || t.size === selectedSize)
                    ) ||
                    product.pricingTiers.find(
                      (t) => !t.size || t.size === selectedSize
                    );
                  const price = tierMatch
                    ? tierMatch.price
                    : product.pricingTiers[0].price * qty;
                  return (
                    <option key={qty} value={qty} className="text-lg">
                      {qty} pcs – <strong>₹{price}</strong>
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Upload Your Design Section */}
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-inner">
              <h2 className="text-sm font-medium uppercase text-blue-900 mb-4">
                Upload Your Design
              </h2>
              <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <FaUpload className="text-blue-600 w-8 h-8" />
                <span className="text-sm text-blue-800 font-semibold">
                  Click to upload your design
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && setUploadedFile(e.target.files[0])
                  }
                  className="hidden"
                />
              </label>
              <motion.button
                onClick={handleUploadDesign}
                className="w-full mt-4 py-3 bg-blue-900 text-white uppercase rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-md"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Customize in Editor
              </motion.button>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              className="w-full py-3 bg-blue-900 text-white uppercase rounded-lg text-lg font-bold hover:bg-blue-800 transition-colors shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Add to Cart – ₹{tier.price}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

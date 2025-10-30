// CouponBanner.jsx
import { motion } from "framer-motion";

export default function CouponBanner({
  activeCoupon,
  bannerVisible,
  setBannerVisible,
  copyToClipboard,
}) {
  if (!bannerVisible || !activeCoupon) return null;

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-900 to-purple-900 text-white text-center py-2 text-xs md:text-sm font-medium tracking-wide relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center space-x-2">
        <span className="animate-pulse">🎉</span>
        <span>
          Buy More, Save More! {activeCoupon.discount}% OFF on Orders ₹
          {activeCoupon.minOrder.toLocaleString("en-IN")}+
        </span>
        <motion.button
          onClick={() => copyToClipboard(activeCoupon.code)}
          className="bg-yellow-400 text-blue-900 px-2 py-1 rounded text-xs font-bold hover:bg-yellow-300 transition-colors ml-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Code: {activeCoupon.code}
        </motion.button>
        <span className="animate-pulse">🎉</span>
      </div>

      <button
        onClick={() => setBannerVisible(false)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-lg font-bold"
        aria-label="Close banner"
      >
        ×
      </button>
    </motion.div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import promo1 from "../../assets/HomePage/promotion_01.png";
import promo2 from "../../assets/HomePage/promotion_02.jpg";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    scale: 1.03,
    transition: { duration: 0.3 },
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

export default function HomePromo() {
  return (
    <motion.section
      className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-blue-50"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(245, 245, 245, 0.8), rgba(235, 240, 255, 0.9)), url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')",
        backgroundSize: "cover",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1500px] mx-auto">
        {/* Promo 1 */}
        <motion.div
          className="relative overflow-hidden rounded-2xl shadow-lg group h-80 sm:h-96"
          variants={cardVariants}
          whileHover="hover"
        >
          <img
            src={promo1}
            alt="Labels and Packaging"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/600x400/CCCCCC/666666?text=Image+Not+Available";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent flex flex-col justify-center px-6 sm:px-10 text-white">
            <h2 className="text-xl pt-5 sm:text-2xl lg:text-3xl font-extrabold text-blue-100 tracking-tight mb-2">
              Promote Your Business with Premium Custom Umbrellas – A Walking
              Billboard!
            </h2>
            <p className="text-sm sm:text-base text-blue-200 mb-4">
              Start Designing Now
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Raincoat", path: "/category/umbrellas-and-raincoats" },
                { name: "Umbrella", path: "/category/umbrellas-and-raincoats" },
              ].map((item) => (
                <Link key={item.name} to={item.path}>
                  <motion.button
                    className="bg-white/90 backdrop-blur-sm text-blue-900 text-sm px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-800 hover:text-white transition-all"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {item.name}
                  </motion.button>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Promo 2 */}
        <motion.div
          className="relative overflow-hidden rounded-2xl shadow-lg group h-80 sm:h-96"
          variants={cardVariants}
          whileHover="hover"
        >
          <img
            src={promo2}
            alt="Custom T-shirts"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/600x400/CCCCCC/666666?text=Image+Not+Available";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent flex flex-col justify-center px-6 sm:px-10 text-white">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-blue-100 tracking-tight mb-2">
              Wear Your Brand with Pride
            </h2>
            <p className="text-sm sm:text-base text-blue-200 mb-4">
              Starting at Rs. 550
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  name: "Custom Polo T-shirts",
                  path: "/category/custom-t-shirts",
                },
                { name: "Custom T-shirts", path: "/category/custom-t-shirts" },
              ].map((item) => (
                <Link key={item.name} to={item.path}>
                  <motion.button
                    className="bg-white/90 backdrop-blur-sm text-blue-900 text-sm px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-800 hover:text-white transition-all"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {item.name}
                  </motion.button>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

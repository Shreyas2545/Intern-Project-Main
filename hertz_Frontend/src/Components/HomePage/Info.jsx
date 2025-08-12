import React from "react";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.2 },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const highlightVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Info() {
  return (
    <motion.div
      className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')",
        backgroundSize: "cover",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - About */}
        <motion.div className="flex flex-col" variants={columnVariants}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight mb-4">
            HertzPrint - Where Personalization Begins
          </h2>
          <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
            HertzPrint is your go-to online platform for custom graphic prints.
            Design and order a wide range of products like business cards,
            T-shirts, mugs, banners, and brochures with ease. Our intuitive
            customization tools, seamless order tracking, and integrated
            shipping and payment gateways make personalization effortless.
          </p>
        </motion.div>

        {/* Right Column - Highlights */}
        <motion.div className="space-y-6" variants={columnVariants}>
          <motion.div variants={highlightVariants}>
            <h3 className="font-semibold text-lg sm:text-xl text-blue-900">
              Low Quantities, Best Prices
            </h3>
            <p className="text-neutral-700 text-sm sm:text-base">
              Get single or low-quantity products at unbeatable prices, tailored
              to your needs.
            </p>
          </motion.div>

          <motion.div variants={highlightVariants}>
            <h3 className="font-semibold text-lg sm:text-xl text-blue-900">
              Premium Quality, Easy Design
            </h3>
            <p className="text-neutral-700 text-sm sm:text-base">
              Explore our high-quality products and user-friendly design tools
              to create and order your favorites effortlessly.
            </p>
          </motion.div>

          <motion.div variants={highlightVariants}>
            <h3 className="font-semibold text-lg sm:text-xl text-blue-900">
              Free Replacement or Full Refund
            </h3>
            <p className="text-neutral-700 text-sm sm:text-base">
              We stand by our products. If you're not satisfied, we'll make it
              right with a replacement or full refund.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

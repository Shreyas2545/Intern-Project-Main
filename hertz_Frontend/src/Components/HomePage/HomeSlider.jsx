import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import image1 from "../../assets/HomePage/hero_pg_01.jpg";
import image2 from "../../assets/HomePage/hero_pg_02.jpg";
import image3 from "../../assets/HomePage/hero_pg_03.jpg";

const sliderData = [
  {
    image: image1,
    title: "My Name, My Pride",
    subtitle: "100 Visiting Cards at Rs 200",
    buttonText: "Shop Now",
    buttonLink: "/category/visiting-cards",
  },
  {
    image: image2,
    title: "Your Rainy Day Essentials!",
    subtitle: "Start at Rs 250",
    buttonText: "Umbrellas",
    buttonLink: "/category/umbrellas-and-raincoats",
  },
  {
    image: image3,
    title: "Boost Your Brand",
    subtitle: "Custom T-shirts, Mugs & More",
    buttonText: "Shop Custom Gifts",
    buttonLink: "/category/mugs-and-gifts",
  },
];

// Animation variants
const slideVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  exit: { opacity: 0, x: -100, transition: { duration: 0.7, ease: "easeOut" } },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

export default function HomeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = sliderData[currentIndex];

  return (
    <div className="relative w-full h-[400px] sm:h-[450px] md:h-[520px] lg:h-[580px] overflow-hidden bg-blue-50">
      {/* Image Slider */}
      <motion.div
        key={currentIndex}
        variants={slideVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="absolute inset-0"
      >
        <img
          src={currentSlide.image}
          alt={currentSlide.title}
          className="w-full h-full object-cover object-center transition-all duration-700 brightness-[0.85]"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/1200x600/CCCCCC/666666?text=Image+Not+Available";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-transparent" />
      </motion.div>

      {/* Text Overlay - Desktop */}
      <motion.div
        className={`hidden sm:flex absolute inset-0 px-4 sm:px-8 md:px-12 lg:px-16 items-end ${
          currentIndex === 1 ? "justify-start" : "justify-end"
        } pb-8 sm:pb-10`}
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className={`bg-white/90 backdrop-blur-md text-blue-900 p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full ${
            currentIndex === 1
              ? "ml-2 sm:ml-4 md:ml-6 lg:ml-8"
              : "mr-4 sm:mr-8 md:mr-12 lg:mr-16"
          } border border-blue-200`}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            {currentSlide.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-blue-800">
            {currentSlide.subtitle}
          </p>
          <motion.a
            href={currentSlide.buttonLink}
            className="mt-4 inline-block bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow-md transition-colors font-semibold"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {currentSlide.buttonText}
          </motion.a>
        </div>
      </motion.div>

      {/* Arrows */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 bg-blue-900/70 text-white hover:bg-blue-800 p-2 rounded-full shadow-md transition-colors"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </motion.button>
      <motion.button
        onClick={nextSlide}
        className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 bg-blue-900/70 text-white hover:bg-blue-800 p-2 rounded-full shadow-md transition-colors"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </motion.button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 cursor-pointer rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-blue-900 scale-125 shadow-md"
                : "bg-blue-300/70"
            }`}
          />
        ))}
      </div>

      {/* Text Overlay - Mobile */}
      <motion.div
        className="block sm:hidden px-4 pt-4 pb-6 bg-blue-50"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white/90 backdrop-blur-md text-blue-900 p-4 rounded-lg shadow-md max-w-md mx-auto border border-blue-200">
          <h2 className="text-lg font-extrabold tracking-tight">
            {currentSlide.title}
          </h2>
          <p className="mt-1 text-sm text-blue-800">{currentSlide.subtitle}</p>
          <motion.a
            href={currentSlide.buttonLink}
            className="mt-3 inline-block bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md transition-colors font-semibold"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {currentSlide.buttonText}
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}

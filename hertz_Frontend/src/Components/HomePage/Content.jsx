import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import image1 from "../../assets/HomePage/polo_tshirt.jpg";
import image2 from "../../assets/HomePage/polo_tshirt.jpg";
import image3 from "../../assets/HomePage/polo_tshirt.jpg";
import image4 from "../../assets/HomePage/polo_tshirt.jpg";
import image5 from "../../assets/HomePage/polo_tshirt.jpg";
import image6 from "../../assets/HomePage/polo_tshirt.jpg";
import image7 from "../../assets/HomePage/polo_tshirt.jpg";
import image8 from "../../assets/HomePage/polo_tshirt.jpg";
import image9 from "../../assets/HomePage/polo_tshirt.jpg";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: "personalize-mugs",
    title: "Personalize Mugs",
    price: "BUY 1 @ Rs.1100",
    img: image1,
  },
  {
    id: "Raincoats",
    title: "Raincoats",
    price: "BUY 30 @ Rs.5700",
    img: image2,
  },
  {
    id: "Customizable Caps",
    title: "Customizable Caps",
    price: "BUY 1 @ Rs.250",
    img: image3,
  },
  {
    id: "promotional-umbrellas",
    title: "Promotional Umbrellas",
    price: "BUY 25 @ Rs.12375",
    img: image4,
  },
  {
    id: "Polo T-Shirts",
    title: "Polo T-Shirts",
    price: "BUY 1 @ Rs.1600",
    img: image5,
  },
  {
    id: "premium-gift-bags",
    title: "Premium Gift Bags",
    price: "BUY 10 @ Rs.830",
    img: image6,
  },
  {
    id: "premium-xyz1",
    title: "Premium xyz1 name",
    price: "BUY 10 @ Rs.830",
    img: image7,
  },
  {
    id: "premium-xyz2",
    title: "Premium xyz2 name",
    price: "BUY 10 @ Rs.830",
    img: image8,
  },
  {
    id: "premium-xyz3",
    title: "Premium xyz3 name",
    price: "BUY 10 @ Rs.830",
    img: image9,
  },
];

const Popular = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth / 2;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full bg-white flex flex-col pt-12 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-full mx-auto flex-grow flex flex-col">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-8 text-center">
          Trending Products
        </h2>

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mb-6 px-4 sm:px-6">
          <button
            onClick={() => scroll("left")}
            className="p-2 bg-blue-100 text-blue-900 rounded-full hover:bg-blue-200 transition-colors duration-300"
            aria-label="Scroll left"
          >
            <FaArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 bg-blue-100 text-blue-900 rounded-full hover:bg-blue-200 transition-colors duration-300"
            aria-label="Scroll right"
          >
            <FaArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Grid */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-4 sm:px-6"
        >
          {products.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/products/${item.id}`)}
              className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-blue-900 line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <span className="inline-block text-sm text-white bg-blue-900 px-3 py-1 rounded-full">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popular;

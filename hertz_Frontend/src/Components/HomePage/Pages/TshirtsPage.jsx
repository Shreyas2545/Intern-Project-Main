// src/Pages/Tshirts/TshirtsPage.jsx
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Placeholder URLs from Unsplash – swap as you like
const tshirtHero =
  "https://source.unsplash.com/featured/800x600/?tshirt,custom";
const poloTshirtImg =
  "https://source.unsplash.com/featured/300x200/?polo,tshirt";
const roundNeckTshirtImg =
  "https://source.unsplash.com/featured/300x200/?round,neck,tshirt";
const fullSleeveTshirtImg =
  "https://source.unsplash.com/featured/300x200/?full,sleeve,tshirt";
const kidsTshirtImg =
  "https://source.unsplash.com/featured/300x200/?kids,tshirt";

// Reusable CardSection component
const CardSection = ({ id, title, getItems }) => (
  <div id={id} className="card-section space-y-6">
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-left">
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {getItems().map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.image}
              alt={item.label}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(
                  title
                )}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 tracking-wide">
                {item.label}
              </h3>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-center">
                From ₹500
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">1 unit</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function TshirtsPage() {
  const humanName = "Custom T-shirts";
  const location = useLocation();

  // Handle scroll behavior on page load
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          const offset = 180;
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth",
          });
        }, 300);
      } else {
        console.warn(`Element with id '${hash}' not found.`);
      }
    } else {
      // Scroll to top if no hash is present
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [location]);

  // Data functions for each subcategory
  const getPoloTshirts = () =>
    [
      { id: 1, image: poloTshirtImg, label: "Polo T-shirt #1" },
      { id: 2, image: poloTshirtImg, label: "Polo T-shirt #2" },
      { id: 3, image: poloTshirtImg, label: "Polo T-shirt #3" },
      { id: 4, image: poloTshirtImg, label: "Polo T-shirt #4", optional: true },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  const getRoundNeckTshirts = () =>
    [
      { id: 1, image: roundNeckTshirtImg, label: "Round Neck T-shirt #1" },
      { id: 2, image: roundNeckTshirtImg, label: "Round Neck T-shirt #2" },
      { id: 3, image: roundNeckTshirtImg, label: "Round Neck T-shirt #3" },
      {
        id: 4,
        image: roundNeckTshirtImg,
        label: "Round Neck T-shirt #4",
        optional: true,
      },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  const getFullSleeveTshirts = () =>
    [
      { id: 1, image: fullSleeveTshirtImg, label: "Full Sleeve T-shirt #1" },
      { id: 2, image: fullSleeveTshirtImg, label: "Full Sleeve T-shirt #2" },
      { id: 3, image: fullSleeveTshirtImg, label: "Full Sleeve T-shirt #3" },
      {
        id: 4,
        image: fullSleeveTshirtImg,
        label: "Full Sleeve T-shirt #4",
        optional: true,
      },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  const getKidsTshirts = () =>
    [
      { id: 1, image: kidsTshirtImg, label: "Kids T-shirt #1" },
      { id: 2, image: kidsTshirtImg, label: "Kids T-shirt #2" },
      { id: 3, image: kidsTshirtImg, label: "Kids T-shirt #3" },
      { id: 4, image: kidsTshirtImg, label: "Kids T-shirt #4", optional: true },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  return (
    <div className="font-montserrat bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30 z-0" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="text-center lg:text-left animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {humanName}
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-md mx-auto lg:mx-0 text-gray-200">
              Express your brand with bold, custom-designed T-shirts.
            </p>
            <Link
              to="#tshirt-types"
              className="mt-6 inline-block bg-[#D4AF37] text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-[#B8972E] transition-colors duration-300"
            >
              Shop Now
            </Link>
          </div>
          <img
            src={tshirtHero}
            alt={humanName}
            className="mt-8 lg:mt-0 h-48 sm:h-64 lg:h-80 object-contain animate-fade-in-right"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x600?text=Custom+T-shirts";
            }}
          />
        </div>
      </div>

      {/* Subcategory Sections */}
      <section id="tshirt-types" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <CardSection
            id="polo-t-shirts"
            title="Polo T-shirts"
            getItems={getPoloTshirts}
          />
          <CardSection
            id="round-neck-t-shirts"
            title="Round Neck T-shirts"
            getItems={getRoundNeckTshirts}
          />
          <CardSection
            id="full-sleeve-t-shirts"
            title="Full Sleeve T-shirts"
            getItems={getFullSleeveTshirts}
          />
          <CardSection
            id="kids-t-shirts"
            title="Kids T-shirts"
            getItems={getKidsTshirts}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1E3A8A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Create Your Unique T-shirt
          </h2>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Design your own T-shirt with our easy-to-use customization tool.
          </p>
          <Link
            to="/design-tool"
            className="inline-block bg-[#D4AF37] text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-[#B8972E] transition-colors duration-300"
          >
            Design Now
          </Link>
        </div>
      </section>
    </div>
  );
}

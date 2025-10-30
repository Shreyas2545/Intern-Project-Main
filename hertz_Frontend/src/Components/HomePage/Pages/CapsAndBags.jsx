// src/Pages/CapsAndBags/CapsAndBags.jsx
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Placeholder URLs from Unsplash
const capsBagsHero = "https://source.unsplash.com/featured/800x600/?caps,bags";
const customCapsImg =
  "https://source.unsplash.com/featured/300x200/?custom,cap";
const brandedBagsImg =
  "https://source.unsplash.com/featured/300x200/?branded,bag";
const canvasToteBagsImg =
  "https://source.unsplash.com/featured/300x200/?canvas,tote,bag";
const sportsCapsImg =
  "https://source.unsplash.com/featured/300x200/?sports,cap";

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
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 tracking-wide">
                {item.label}
              </h3>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-center">
                From ₹350
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">1 unit</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function CapsAndBags() {
  const humanName = "Caps & Bags";
  const location = useLocation();

  // Scroll to hash or top on load
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          const offset = 180;
          const pos = el.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: pos - offset, behavior: "smooth" });
        }, 300);
      } else {
        console.warn(`Element with id '${hash}' not found.`);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  // Data functions
  const getCustomCaps = () =>
    [
      { id: 1, image: customCapsImg, label: "Custom Cap #1" },
      { id: 2, image: customCapsImg, label: "Custom Cap #2" },
      { id: 3, image: customCapsImg, label: "Custom Cap #3" },
      { id: 4, image: customCapsImg, label: "Custom Cap #4", optional: true },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getBrandedBags = () =>
    [
      { id: 1, image: brandedBagsImg, label: "Branded Bag #1" },
      { id: 2, image: brandedBagsImg, label: "Branded Bag #2" },
      { id: 3, image: brandedBagsImg, label: "Branded Bag #3" },
      { id: 4, image: brandedBagsImg, label: "Branded Bag #4", optional: true },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getCanvasToteBags = () =>
    [
      { id: 1, image: canvasToteBagsImg, label: "Canvas Tote Bag #1" },
      { id: 2, image: canvasToteBagsImg, label: "Canvas Tote Bag #2" },
      { id: 3, image: canvasToteBagsImg, label: "Canvas Tote Bag #3" },
      {
        id: 4,
        image: canvasToteBagsImg,
        label: "Canvas Tote Bag #4",
        optional: true,
      },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getSportsCaps = () =>
    [
      { id: 1, image: sportsCapsImg, label: "Sports Cap #1" },
      { id: 2, image: sportsCapsImg, label: "Sports Cap #2" },
      { id: 3, image: sportsCapsImg, label: "Sports Cap #3" },
      { id: 4, image: sportsCapsImg, label: "Sports Cap #4", optional: true },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  return (
    <div className="font-montserrat bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30 z-0" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="text-center lg:text-left animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {humanName}
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-md mx-auto lg:mx-0 text-gray-200">
              Carry your brand with customized caps and bags.
            </p>
            <Link
              to="#caps-bags-types"
              className="mt-6 inline-block bg-[#D4AF37] text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-[#B8972E] transition-colors duration-300"
            >
              Explore Now
            </Link>
          </div>
          <img
            src={capsBagsHero}
            alt={humanName}
            className="mt-8 lg:mt-0 h-48 sm:h-64 lg:h-80 object-contain animate-fade-in-right"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x600?text=Caps+%26+Bags";
            }}
          />
        </div>
      </div>

      {/* Sections */}
      <section id="caps-bags-types" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <CardSection
            id="custom-caps"
            title="Custom Caps"
            getItems={getCustomCaps}
          />
          <CardSection
            id="branded-bags"
            title="Branded Bags"
            getItems={getBrandedBags}
          />
          <CardSection
            id="canvas-tote-bags"
            title="Canvas Tote Bags"
            getItems={getCanvasToteBags}
          />
          <CardSection
            id="sports-caps"
            title="Sports Caps"
            getItems={getSportsCaps}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E3A8A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Customize Your Look</h2>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Personalize your caps and bags with our easy design tool.
          </p>
          <Link
            to="/design-tool"
            className="inline-block bg-[#D4AF37] text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-[#B8972E] transition-colors duration-300"
          >
            Start Designing
          </Link>
        </div>
      </section>
    </div>
  );
}

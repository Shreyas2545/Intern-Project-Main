// src/Pages/MugsGifts/MugsGiftsPage.jsx
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Placeholder URLs from Unsplash
const mugsHero = "https://source.unsplash.com/featured/800x600/?mugs,gifts";
const customMugsImg =
  "https://source.unsplash.com/featured/300x200/?custom,mug";
const photoFramesImg =
  "https://source.unsplash.com/featured/300x200/?photo,frame";
const customPillowsImg =
  "https://source.unsplash.com/featured/300x200/?custom,pillow";
const giftBoxesImg = "https://source.unsplash.com/featured/300x200/?gift,box";

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
                From ₹199
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">1 unit</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function MugsGiftsPage() {
  const humanName = "Mugs & Gifts";
  const location = useLocation();

  // Handle scroll behavior on page load
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          const offset = 180;
          const pos = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: pos - offset, behavior: "smooth" });
        }, 300);
      } else {
        console.warn(`Element with id '${hash}' not found.`);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  // Data functions for each subcategory
  const getCustomMugs = () =>
    [
      { id: 1, image: customMugsImg, label: "Custom Mug #1" },
      { id: 2, image: customMugsImg, label: "Custom Mug #2" },
      { id: 3, image: customMugsImg, label: "Custom Mug #3" },
      { id: 4, image: customMugsImg, label: "Custom Mug #4", optional: true },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getPhotoFrames = () =>
    [
      { id: 1, image: photoFramesImg, label: "Photo Frame #1" },
      { id: 2, image: photoFramesImg, label: "Photo Frame #2" },
      { id: 3, image: photoFramesImg, label: "Photo Frame #3" },
      { id: 4, image: photoFramesImg, label: "Photo Frame #4", optional: true },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getCustomPillows = () =>
    [
      { id: 1, image: customPillowsImg, label: "Custom Pillow #1" },
      { id: 2, image: customPillowsImg, label: "Custom Pillow #2" },
      { id: 3, image: customPillowsImg, label: "Custom Pillow #3" },
      {
        id: 4,
        image: customPillowsImg,
        label: "Custom Pillow #4",
        optional: true,
      },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getGiftBoxes = () =>
    [
      { id: 1, image: giftBoxesImg, label: "Gift Box #1" },
      { id: 2, image: giftBoxesImg, label: "Gift Box #2" },
      { id: 3, image: giftBoxesImg, label: "Gift Box #3" },
      { id: 4, image: giftBoxesImg, label: "Gift Box #4", optional: true },
    ].filter((c) => !c.optional || Math.random() > 0.3);

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
              Surprise your loved ones with personalized gifts and mugs.
            </p>
            <Link
              to="#mugs-gifts-types"
              className="mt-6 inline-block bg-[#D4AF37] text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-[#B8972E] transition-colors duration-300"
            >
              Shop Now
            </Link>
          </div>
          <img
            src={mugsHero}
            alt={humanName}
            className="mt-8 lg:mt-0 h-48 sm:h-64 lg:h-80 object-contain animate-fade-in-right"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x600?text=Mugs+%26+Gifts";
            }}
          />
        </div>
      </div>

      {/* Subcategory Sections */}
      <section id="mugs-gifts-types" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <CardSection
            id="custom-mugs"
            title="Custom Mugs"
            getItems={getCustomMugs}
          />
          <CardSection
            id="photo-frames"
            title="Photo Frames"
            getItems={getPhotoFrames}
          />
          <CardSection
            id="custom-pillows"
            title="Custom Pillows"
            getItems={getCustomPillows}
          />
          <CardSection
            id="gift-boxes"
            title="Gift Boxes"
            getItems={getGiftBoxes}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1E3A8A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Create a Personalized Gift
          </h2>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Use our design tool to turn everyday items into memorable gifts.
          </p>
          <Link
            to="/designtool"
            className="inline-block bg-[#D4AF37] text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-[#B8972E] transition-colors duration-300"
          >
            Start Designing
          </Link>
        </div>
      </section>
    </div>
  );
}

// src/Pages/Umbrellas/UmbrellaPage.jsx
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Placeholder URLs from unsplash.com – feel free to swap these for any other royalty-free images.
const umbrellaHero = "https://source.unsplash.com/featured/800x600/?umbrella";
const foldingUmbrellaImg =
  "https://source.unsplash.com/featured/300x200/?folding,umbrella";
const golfUmbrellaImg =
  "https://source.unsplash.com/featured/300x200/?golf,umbrella";
const customUmbrellaImg =
  "https://source.unsplash.com/featured/300x200/?custom,umbrella";
const kidsUmbrellaImg =
  "https://source.unsplash.com/featured/300x200/?kids,umbrella";

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
                From ₹299
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">1 unit</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function UmbrellaPage() {
  const humanName = "Umbrellas and Raincoats";
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
  const getFoldableUmbrellas = () =>
    [
      { id: 1, image: foldingUmbrellaImg, label: "Foldable Umbrella #1" },
      { id: 2, image: foldingUmbrellaImg, label: "Foldable Umbrella #2" },
      { id: 3, image: foldingUmbrellaImg, label: "Foldable Umbrella #3" },
      {
        id: 4,
        image: foldingUmbrellaImg,
        label: "Foldable Umbrella #4",
        optional: true,
      },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  const getGolfUmbrellas = () =>
    [
      { id: 1, image: golfUmbrellaImg, label: "Golf Umbrella #1" },
      { id: 2, image: golfUmbrellaImg, label: "Golf Umbrella #2" },
      { id: 3, image: golfUmbrellaImg, label: "Golf Umbrella #3" },
      {
        id: 4,
        image: golfUmbrellaImg,
        label: "Golf Umbrella #4",
        optional: true,
      },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  const getCustomUmbrellas = () =>
    [
      { id: 1, image: customUmbrellaImg, label: "Custom Umbrella #1" },
      { id: 2, image: customUmbrellaImg, label: "Custom Umbrella #2" },
      { id: 3, image: customUmbrellaImg, label: "Custom Umbrella #3" },
      {
        id: 4,
        image: customUmbrellaImg,
        label: "Custom Umbrella #4",
        optional: true,
      },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  const getKidsUmbrellas = () =>
    [
      { id: 1, image: kidsUmbrellaImg, label: "Kids Umbrella #1" },
      { id: 2, image: kidsUmbrellaImg, label: "Kids Umbrella #2" },
      { id: 3, image: kidsUmbrellaImg, label: "Kids Umbrella #3" },
      {
        id: 4,
        image: kidsUmbrellaImg,
        label: "Kids Umbrella #4",
        optional: true,
      },
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
              Stay stylish and dry with personalized umbrellas.
            </p>
            <Link
              to="#umbrella-types"
              className="mt-6 inline-block bg-[#D4AF37] text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-[#B8972E] transition-colors duration-300"
            >
              Shop Now
            </Link>
          </div>
          <img
            src={umbrellaHero}
            alt={humanName}
            className="mt-8 lg:mt-0 h-48 sm:h-64 lg:h-80 object-contain animate-fade-in-right"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x600?text=Umbrellas";
            }}
          />
        </div>
      </div>

      {/* Subcategory Sections */}
      <section id="umbrella-types" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <CardSection
            id="foldable-umbrellas"
            title="Foldable Umbrellas"
            getItems={getFoldableUmbrellas}
          />
          <CardSection
            id="golf-umbrellas"
            title="Golf Umbrellas"
            getItems={getGolfUmbrellas}
          />
          <CardSection
            id="custom-umbrella"
            title="Custom Umbrella"
            getItems={getCustomUmbrellas}
          />
          <CardSection
            id="kids-umbrella"
            title="Kids Umbrella"
            getItems={getKidsUmbrellas}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1E3A8A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Customize Your Umbrella</h2>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Add your brand or artwork using our design tool and stand out even
            in the rain.
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

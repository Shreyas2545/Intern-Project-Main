// src/Pages/PosterAndMarketing/PosterAndMarketing.jsx
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Placeholder URLs from Unsplash
const posterHero =
  "https://source.unsplash.com/featured/800x600/?poster,marketing";
const eventPosterImg =
  "https://source.unsplash.com/featured/300x200/?event,poster";
const flyerImg = "https://source.unsplash.com/featured/300x200/?flyer";
const brochureImg = "https://source.unsplash.com/featured/300x200/?brochure";
const pamphletImg = "https://source.unsplash.com/featured/300x200/?pamphlet";

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
                From ₹150
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">1 unit</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function PosterAndMarketing() {
  const humanName = "Posters & Marketing Materials";
  const location = useLocation();

  // Handle scrolling on page load
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  // Data functions for each subcategory
  const getEventPosters = () =>
    [
      { id: 1, image: eventPosterImg, label: "Event Poster #1" },
      { id: 2, image: eventPosterImg, label: "Event Poster #2" },
      { id: 3, image: eventPosterImg, label: "Event Poster #3" },
      {
        id: 4,
        image: eventPosterImg,
        label: "Event Poster #4",
        optional: true,
      },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getFlyers = () =>
    [
      { id: 1, image: flyerImg, label: "Flyer #1" },
      { id: 2, image: flyerImg, label: "Flyer #2" },
      { id: 3, image: flyerImg, label: "Flyer #3" },
      { id: 4, image: flyerImg, label: "Flyer #4", optional: true },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getBrochures = () =>
    [
      { id: 1, image: brochureImg, label: "Brochure #1" },
      { id: 2, image: brochureImg, label: "Brochure #2" },
      { id: 3, image: brochureImg, label: "Brochure #3" },
      { id: 4, image: brochureImg, label: "Brochure #4", optional: true },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getPamphlets = () =>
    [
      { id: 1, image: pamphletImg, label: "Pamphlet #1" },
      { id: 2, image: pamphletImg, label: "Pamphlet #2" },
      { id: 3, image: pamphletImg, label: "Pamphlet #3" },
      { id: 4, image: pamphletImg, label: "Pamphlet #4", optional: true },
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
              Promote with style using eye-catching posters and prints.
            </p>
            <Link
              to="#marketing-types"
              className="mt-6 inline-block bg-[#D4AF37] text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-[#B8972E] transition-colors duration-300"
            >
              Explore Now
            </Link>
          </div>
          <img
            src={posterHero}
            alt={humanName}
            className="mt-8 lg:mt-0 h-48 sm:h-64 lg:h-80 object-contain animate-fade-in-right"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x600?text=Posters+%26+Marketing";
            }}
          />
        </div>
      </div>

      {/* Subcategory Sections */}
      <section id="marketing-types" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <CardSection
            id="event-posters"
            title="Event Posters"
            getItems={getEventPosters}
          />
          <CardSection id="flyers" title="Flyers" getItems={getFlyers} />
          <CardSection
            id="brochures"
            title="Brochures"
            getItems={getBrochures}
          />
          <CardSection
            id="pamphlets"
            title="Pamphlets"
            getItems={getPamphlets}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1E3A8A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Design Promotional Prints That Work
          </h2>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Use our design tool to create stunning and affordable marketing
            prints.
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

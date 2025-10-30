import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Sample image URLs from the web
const HERO_IMAGE_URL =
  "https://via.placeholder.com/800x600?text=Visiting+Cards+Hero";
const CARD_IMAGE_URLS = [
  "https://via.placeholder.com/300x200?text=Standard+Card",
  "https://via.placeholder.com/300x200?text=Premium+Plus+Card",
  "https://via.placeholder.com/300x200?text=Rounded+Corner+Card",
  "https://via.placeholder.com/300x200?text=Square+Card",
  "https://via.placeholder.com/300x200?text=QR+Code+Card",
  "https://via.placeholder.com/300x200?text=Circular+Card",
];

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
                From ₹99
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">1 unit</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function VisitingCardsPage() {
  const humanName = "Visiting Cards";
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
        console.log(`Element with id '${hash}' not found.`);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  // Data functions for each subcategory
  const getStandardCards = () =>
    [
      { id: 1, image: CARD_IMAGE_URLS[0], label: "Standard Card #1" },
      { id: 2, image: CARD_IMAGE_URLS[0], label: "Standard Card #2" },
      { id: 3, image: CARD_IMAGE_URLS[0], label: "Standard Card #3" },
      {
        id: 4,
        image: CARD_IMAGE_URLS[0],
        label: "Standard Card #4",
        optional: true,
      },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  const getPremiumPlusCards = () =>
    [
      { id: 1, image: CARD_IMAGE_URLS[1], label: "Premium Plus Card #1" },
      { id: 2, image: CARD_IMAGE_URLS[1], label: "Premium Plus Card #2" },
      { id: 3, image: CARD_IMAGE_URLS[1], label: "Premium Plus Card #3" },
      {
        id: 4,
        image: CARD_IMAGE_URLS[1],
        label: "Premium Plus Card #4",
        optional: true,
      },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  const getRoundedCornerCards = () =>
    [
      { id: 1, image: CARD_IMAGE_URLS[2], label: "Rounded Corner Card #1" },
      { id: 2, image: CARD_IMAGE_URLS[2], label: "Rounded Corner Card #2" },
      { id: 3, image: CARD_IMAGE_URLS[2], label: "Rounded Corner Card #3" },
      {
        id: 4,
        image: CARD_IMAGE_URLS[2],
        label: "Rounded Corner Card #4",
        optional: true,
      },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  const getSquareCards = () =>
    [
      { id: 1, image: CARD_IMAGE_URLS[3], label: "Square Card #1" },
      { id: 2, image: CARD_IMAGE_URLS[3], label: "Square Card #2" },
      { id: 3, image: CARD_IMAGE_URLS[3], label: "Square Card #3" },
      {
        id: 4,
        image: CARD_IMAGE_URLS[3],
        label: "Square Card #4",
        optional: true,
      },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  const getQrCodeCards = () =>
    [
      { id: 1, image: CARD_IMAGE_URLS[4], label: "QR Code Card #1" },
      { id: 2, image: CARD_IMAGE_URLS[4], label: "QR Code Card #2" },
      { id: 3, image: CARD_IMAGE_URLS[4], label: "QR Code Card #3" },
      {
        id: 4,
        image: CARD_IMAGE_URLS[4],
        label: "QR Code Card #4",
        optional: true,
      },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  const getCircularVisitingCards = () =>
    [
      { id: 1, image: CARD_IMAGE_URLS[5], label: "Circular Visiting Card #1" },
      { id: 2, image: CARD_IMAGE_URLS[5], label: "Circular Visiting Card #2" },
      { id: 3, image: CARD_IMAGE_URLS[5], label: "Circular Visiting Card #3" },
      {
        id: 4,
        image: CARD_IMAGE_URLS[5],
        label: "Circular Visiting Card #4",
        optional: true,
      },
    ].filter((card) => !card.optional || Math.random() > 0.3);

  return (
    <div className="font-montserrat bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="text-center lg:text-left animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {humanName}
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-md mx-auto lg:mx-0 text-gray-200">
              Make a lasting impression with personalized visiting cards.
            </p>
            <Link
              to="#visiting-card-types"
              className="mt-6 inline-block bg-[#D4AF37] text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Visit
            </Link>
          </div>
          <img
            src={HERO_IMAGE_URL}
            alt={humanName}
            className="mt-8 lg:mt-0 h-48 sm:h-64 lg:h-80 object-contain animate-fade-in-right"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x600?text=Visiting+Cards";
            }}
          />
        </div>
      </div>
      {/* Subcategory Sections */}
      <section id="visiting-card-types" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <CardSection
            id="standard-cards"
            title="Standard Cards"
            getItems={getStandardCards}
          />
          <CardSection
            id="premium-plus-cards"
            title="Premium Plus Cards"
            getItems={getPremiumPlusCards}
          />
          <CardSection
            id="rounded-corner-cards"
            title="Rounded Corner Cards"
            getItems={getRoundedCornerCards}
          />
          <CardSection
            id="square-cards"
            title="Square Cards"
            getItems={getSquareCards}
          />
          <CardSection
            id="qr-code-cards"
            title="QR Code Cards"
            getItems={getQrCodeCards}
          />
          <CardSection
            id="circular-visiting-cards"
            title="Circular Visiting Cards"
            getItems={getCircularVisitingCards}
          />
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-[#1E3A8A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Create Your Perfect Visiting Card
          </h2>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Design a unique card that reflects your brand with our easy-to-use
            tool.
          </p>
          <Link
            to="/design-tool"
            className="mt-4 inline-block bg-[#D4AF37] text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-[#B8972E] transition-colors duration-300"
          >
            Start Designing
          </Link>
        </div>
      </section>
    </div>
  );
}

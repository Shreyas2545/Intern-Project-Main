// src/Pages/Stationery/StationeryPage.jsx
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Placeholder URLs – feel free to swap for other royalty-free sources
const stationeryHero =
  "https://source.unsplash.com/featured/800x600/?stationery,notebook";
const letterheadImg =
  "https://source.unsplash.com/featured/300x200/?letterhead";
const notebookImg = "https://source.unsplash.com/featured/300x200/?notebook";
const envelopeImg = "https://source.unsplash.com/featured/300x200/?envelope";
const stickyNotesImg =
  "https://source.unsplash.com/featured/300x200/?sticky-notes";
const notepadImg = "https://source.unsplash.com/featured/300x200/?notepad";

// Reusable CardSection component
const CardSection = ({ id, title, getCards }) => (
  <div id={id} className="card-section space-y-6">
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-left">
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {getCards().map((card) => (
        <div
          key={card.id}
          className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={card.image}
              alt={card.label}
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
                {card.label}
              </h3>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-center">
                From ₹200
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">100 units</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function StationeryPage() {
  const humanName = "Stationery and Notebooks";
  const location = useLocation();

  // Scroll to hash or top on load
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

  // Data functions for each stationery type
  const getLetterheads = () =>
    [
      { id: 1, image: letterheadImg, label: "Letterhead #1" },
      { id: 2, image: letterheadImg, label: "Letterhead #2" },
      { id: 3, image: letterheadImg, label: "Letterhead #3" },
      { id: 4, image: letterheadImg, label: "Letterhead #4", optional: true },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getNotebooks = () =>
    [
      { id: 1, image: notebookImg, label: "Notebook #1" },
      { id: 2, image: notebookImg, label: "Notebook #2" },
      { id: 3, image: notebookImg, label: "Notebook #3" },
      { id: 4, image: notebookImg, label: "Notebook #4", optional: true },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getEnvelopes = () =>
    [
      { id: 1, image: envelopeImg, label: "Envelope #1" },
      { id: 2, image: envelopeImg, label: "Envelope #2" },
      { id: 3, image: envelopeImg, label: "Envelope #3" },
      { id: 4, image: envelopeImg, label: "Envelope #4", optional: true },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getStickyNotes = () =>
    [
      { id: 1, image: stickyNotesImg, label: "Sticky Notes #1" },
      { id: 2, image: stickyNotesImg, label: "Sticky Notes #2" },
      { id: 3, image: stickyNotesImg, label: "Sticky Notes #3" },
      {
        id: 4,
        image: stickyNotesImg,
        label: "Sticky Notes #4",
        optional: true,
      },
    ].filter((c) => !c.optional || Math.random() > 0.3);

  const getNotepads = () =>
    [
      { id: 1, image: notepadImg, label: "Notepad #1" },
      { id: 2, image: notepadImg, label: "Notepad #2" },
      { id: 3, image: notepadImg, label: "Notepad #3" },
      { id: 4, image: notepadImg, label: "Notepad #4", optional: true },
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
              Elevate your workspace with premium stationery and notebooks.
            </p>
            <Link
              to="#stationery-types"
              className="mt-6 inline-block bg-[#D4AF37] text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-[#B8972E] transition-colors duration-300"
            >
              Shop Now
            </Link>
          </div>
          <img
            src={stationeryHero}
            alt={humanName}
            className="mt-8 lg:mt-0 h-48 sm:h-64 lg:h-80 object-contain animate-fade-in-right"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/800x600?text=${encodeURIComponent(
                "Stationery"
              )}`;
            }}
          />
        </div>
      </div>

      {/* Stationery Types */}
      <section id="stationery-types" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <CardSection
            id="letterheads"
            title="Letterheads"
            getCards={getLetterheads}
          />
          <CardSection
            id="notebooks"
            title="Notebooks"
            getCards={getNotebooks}
          />
          <CardSection
            id="envelopes"
            title="Envelopes"
            getCards={getEnvelopes}
          />
          <CardSection
            id="sticky-notes"
            title="Sticky Notes"
            getCards={getStickyNotes}
          />
          <CardSection id="notepads" title="Notepads" getCards={getNotepads} />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E3A8A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Design Your Perfect Stationery
          </h2>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Use our intuitive design tool to create stationery that reflects
            your brand.
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

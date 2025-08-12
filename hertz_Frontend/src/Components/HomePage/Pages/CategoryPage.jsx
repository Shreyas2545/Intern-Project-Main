import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import axios from "axios";

// Reusable component for displaying a subcategory section.
const SubcategorySection = ({ subcategory }) => (
  <section id={subcategory.slug} className="my-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      {subcategory.name}
    </h2>
    <hr className="border-t-2 border-gray-300 mb-6" />
    <div className="w-64 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
        {subcategory.image && (
          <img
            src={subcategory.image}
            alt={subcategory.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
        {!subcategory.image && (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-blue-900 opacity-0 hover:opacity-10 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-blue-900 line-clamp-2 mb-2">
          {`${subcategory.name} Example`}
        </h3>
        <span className="inline-block text-sm text-white bg-blue-900 px-3 py-1 rounded-full">
          BUY 1 @ Rs.1000
        </span>
      </div>
    </div>
  </section>
);

export default function CategoryPage() {
  const { categoryName } = useParams(); // Gets the slug from the URL (e.g., "t-shirts")
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Use the provided API URL directly
  const API_BASE_URL = "http://localhost:8000/api/v1";

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryName) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/categories/${categoryName}`
        );
        const categoryData = response.data.data || response.data;
        if (!categoryData || typeof categoryData !== "object") {
          throw new Error("Invalid category data received from server.");
        }
        setCategory(categoryData);
      } catch (err) {
        console.error(
          "Error fetching category:",
          err.response ? err.response.data : err.message
        );
        setError(
          "Could not load category. It may not exist or the server may be down."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryName]);

  const handleSubcategoryClick = (hash) => {
    setIsDropdownOpen(false);
    const el = document.getElementById(hash);
    if (el) {
      const offset = 100; // Adjusted for a smoother scroll with header
      const pos = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: pos - offset, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 font-semibold text-2xl text-gray-600">
        Loading...
      </div>
    );
  }

  if (error || !category) {
    return <Navigate to="/404" replace />;
  }

  const { name, description, imageUrl, subcategories = [] } = category;

  return (
    <div className="font-montserrat bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* BREADCRUMB NAVIGATION */}
      <nav className="text-sm text-gray-600 p-6 max-w-7xl mx-auto">
        <ol className="flex items-center space-x-4">
          <li>
            <Link to="/" className="hover:text-yellow-600 transition-colors">
              Home
            </Link>
          </li>
          <li className="text-gray-400">›</li>
          <li
            className="relative text-yellow-600 font-medium hover:text-yellow-700 cursor-pointer"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            {name}
            {isDropdownOpen && subcategories.length > 0 && (
              <ul className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md border border-gray-200 z-20">
                {subcategories.map((sub) => (
                  <li key={sub._id}>
                    <a
                      href={`#${sub.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubcategoryClick(sub.slug);
                      }}
                    >
                      {sub.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ol>
      </nav>

      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              {name}
            </h1>
            <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 text-gray-100">
              {description ||
                "Discover a wide range of custom-designed products in this category."}
            </p>
          </div>
          <div className="w-full lg:w-1/3 h-64 sm:h-80 lg:h-96 overflow-hidden rounded-xl shadow-2xl">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.src = "https://placehold.co/800x600?text=Category";
              }}
            />
          </div>
        </div>
      </div>

      {/* SUBCATEGORY SECTIONS */}
      <section className="py-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {subcategories.length > 0 ? (
            subcategories.map((sub) => (
              <SubcategorySection key={sub._id} subcategory={sub} />
            ))
          ) : (
            <p className="text-center text-gray-500 text-xl py-10">
              No subcategories available for {name} at the moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

// src/Pages/SubCategory/SubCategoryPage.jsx
import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";

export default function SubCategoryPage() {
  const { categoryName, subCategoryName } = useParams();

  // Redirect to “not found” if params missing
  if (!categoryName || !subCategoryName) {
    return <Navigate to="/category/not-found" replace />;
  }

  // Human-readable titles
  const mainHuman = categoryName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const subHuman = subCategoryName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Special redirect for visiting-cards to scroll with hash
  if (categoryName === "visiting-cards") {
    return (
      <Navigate to={`/category/visiting-cards#${subCategoryName}`} replace />
    );
  }

  // Build a generic Unsplash URL for each product image
  const getPlaceholderImage = (i) =>
    `https://source.unsplash.com/featured/300x200/?${encodeURIComponent(
      subCategoryName
    )},product,${i}`;

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        ›{" "}
        <Link to={`/category/${categoryName}`} className="hover:underline">
          {mainHuman}
        </Link>{" "}
        › <span>{subHuman}</span>
      </nav>

      <h1 className="text-3xl font-bold">{subHuman}</h1>
      <p className="text-gray-700">
        Browse our collection of <strong>{subHuman}</strong> within{" "}
        <strong>{mainHuman}</strong>.
      </p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={getPlaceholderImage(i)}
              alt={`${subHuman} ${i}`}
              className="h-40 w-full object-cover"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(
                  subHuman
                )}+${i}`;
              }}
            />
            <div className="p-4">
              <h3 className="font-medium text-gray-900">
                {subHuman} #{i}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                From ₹200 / 100 units
              </p>
              <Link
                to={`/product/${categoryName}/${subCategoryName}/${i}`}
                className="mt-3 inline-block text-sm font-semibold text-[#1E3A8A] hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

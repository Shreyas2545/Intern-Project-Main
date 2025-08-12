import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";

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
              src={item.image || "https://via.placeholder.com/300x200"}
              alt={item.label}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) =>
                (e.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(
                  title
                )}`)
              }
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
  const { slug } = useParams();
  const location = useLocation();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, [slug]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`/api/v1/categories/${slug}`);
      setCategory(response.data.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!category) return <div>Category not found</div>;

  const humanName = category.name;
  const subcategories = category.subcategories || [];

  const getItemsForSubcategory = (subcategoryName) =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      image: `https://source.unsplash.com/featured/300x200/?${subcategoryName.replace(
        / /g,
        "-"
      )}`,
      label: `${subcategoryName} #${i + 1}`,
    }));

  return (
    <div className="font-montserrat bg-gray-50 min-h-screen">
      <div className="relative bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30 z-0" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="text-center lg:text-left animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {humanName}
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-md mx-auto lg:mx-0 text-gray-200">
              {category.description || "Explore our custom-designed products."}
            </p>
            <Link
              to={`#${subcategories[0]?.name.replace(/ /g, "-")}`}
              className="mt-6 inline-block bg-[#D4AF37] text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-[#B8972E] transition-colors duration-300"
            >
              Shop Now
            </Link>
          </div>
          <img
            src={category.imageUrl || "https://via.placeholder.com/800x600"}
            alt={humanName}
            className="mt-8 lg:mt-0 h-48 sm:h-64 lg:h-80 object-contain animate-fade-in-right"
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/800x600")
            }
          />
        </div>
      </div>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {subcategories.map((subcategory) => (
            <CardSection
              key={subcategory.name}
              id={subcategory.name.replace(/ /g, "-")}
              title={subcategory.name}
              getItems={() => getItemsForSubcategory(subcategory.name)}
            />
          ))}
        </div>
      </section>

      <section className="bg-[#1E3A8A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Create Your Unique {humanName}
          </h2>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Design your own {humanName.toLowerCase()} with our easy-to-use
            customization tool.
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

// src/Pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
      <p className="mt-2 text-gray-500">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

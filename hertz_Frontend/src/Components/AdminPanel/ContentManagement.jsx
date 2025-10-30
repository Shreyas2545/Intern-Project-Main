import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaFileAlt } from "react-icons/fa";

const ContentManagement = () => {
  const [pages, setPages] = useState([
    {
      id: 1,
      title: "Homepage Banner",
      status: "Published",
      content: "Welcome banner",
      seo: { title: "Home", description: "Welcome to our site" },
    },
    {
      id: 2,
      title: "About Us",
      status: "Draft",
      content: "About our company",
      seo: { title: "", description: "" },
    },
  ]);
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "How to Design a T-Shirt",
      content: "Tutorial content",
      status: "Published",
      seo: { title: "T-Shirt Design", description: "Learn to design" },
    },
  ]);
  const [testimonials, setTestimonials] = useState([
    { id: 1, author: "Shreyas Hadawale", content: "Great service!", rating: 5 },
  ]);
  const [newPage, setNewPage] = useState({
    title: "",
    content: "",
    status: "Draft",
    seo: { title: "", description: "" },
  });
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    status: "Draft",
    seo: { title: "", description: "" },
  });
  const [newTestimonial, setNewTestimonial] = useState({
    author: "",
    content: "",
    rating: 5,
  });
  const [editingId, setEditingId] = useState({
    page: null,
    blog: null,
    testimonial: null,
  });
  const fileInputRef = useRef(null);

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "page") {
      if (name.startsWith("seo.")) {
        setNewPage({
          ...newPage,
          seo: { ...newPage.seo, [name.split(".")[1]]: value },
        });
      } else {
        setNewPage({ ...newPage, [name]: value });
      }
    } else if (type === "blog") {
      if (name.startsWith("seo.")) {
        setNewBlog({
          ...newBlog,
          seo: { ...newBlog.seo, [name.split(".")[1]]: value },
        });
      } else {
        setNewBlog({ ...newBlog, [name]: value });
      }
    } else {
      setNewTestimonial({ ...newTestimonial, [name]: value });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Uploaded file for blog:", file.name);
    }
  };

  const handleAdd = (type) => {
    if (type === "page") {
      if (!newPage.title) {
        alert("Page title is required!");
        return;
      }
      const pageToAdd = { ...newPage, id: pages.length + 1 };
      setPages([...pages, pageToAdd]);
      setNewPage({
        title: "",
        content: "",
        status: "Draft",
        seo: { title: "", description: "" },
      });
      console.log("Added page:", pageToAdd);
    } else if (type === "blog") {
      if (!newBlog.title) {
        alert("Blog title is required!");
        return;
      }
      const blogToAdd = { ...newBlog, id: blogs.length + 1 };
      setBlogs([...blogs, blogToAdd]);
      setNewBlog({
        title: "",
        content: "",
        status: "Draft",
        seo: { title: "", description: "" },
      });
      console.log("Added blog:", blogToAdd);
    } else {
      if (!newTestimonial.author || !newTestimonial.content) {
        alert("Author and content are required!");
        return;
      }
      const testimonialToAdd = {
        ...newTestimonial,
        id: testimonials.length + 1,
      };
      setTestimonials([...testimonials, testimonialToAdd]);
      setNewTestimonial({ author: "", content: "", rating: 5 });
      console.log("Added testimonial:", testimonialToAdd);
    }
  };

  const handleEdit = (item, type) => {
    if (type === "page") {
      setEditingId({ ...editingId, page: item.id });
      setNewPage(item);
    } else if (type === "blog") {
      setEditingId({ ...editingId, blog: item.id });
      setNewBlog(item);
    } else {
      setEditingId({ ...editingId, testimonial: item.id });
      setNewTestimonial(item);
    }
  };

  const handleSaveEdit = (type) => {
    if (type === "page") {
      if (!newPage.title) {
        alert("Page title is required!");
        return;
      }
      const updatedPage = { ...newPage, id: editingId.page };
      setPages(pages.map((p) => (p.id === editingId.page ? updatedPage : p)));
      setEditingId({ ...editingId, page: null });
      setNewPage({
        title: "",
        content: "",
        status: "Draft",
        seo: { title: "", description: "" },
      });
      console.log("Updated page:", updatedPage);
    } else if (type === "blog") {
      if (!newBlog.title) {
        alert("Blog title is required!");
        return;
      }
      const updatedBlog = { ...newBlog, id: editingId.blog };
      setBlogs(blogs.map((b) => (b.id === editingId.blog ? updatedBlog : b)));
      setEditingId({ ...editingId, blog: null });
      setNewBlog({
        title: "",
        content: "",
        status: "Draft",
        seo: { title: "", description: "" },
      });
      console.log("Updated blog:", updatedBlog);
    } else {
      if (!newTestimonial.author || !newTestimonial.content) {
        alert("Author and content are required!");
        return;
      }
      const updatedTestimonial = {
        ...newTestimonial,
        id: editingId.testimonial,
      };
      setTestimonials(
        testimonials.map((t) =>
          t.id === editingId.testimonial ? updatedTestimonial : t
        )
      );
      setEditingId({ ...editingId, testimonial: null });
      setNewTestimonial({ author: "", content: "", rating: 5 });
      console.log("Updated testimonial:", updatedTestimonial);
    }
  };

  const handleDelete = (id, type) => {
    if (type === "page") {
      setPages(pages.filter((p) => p.id !== id));
      console.log(`Deleted page with id: ${id}`);
    } else if (type === "blog") {
      setBlogs(blogs.filter((b) => b.id !== id));
      console.log(`Deleted blog with id: ${id}`);
    } else {
      setTestimonials(testimonials.filter((t) => t.id !== id));
      console.log(`Deleted testimonial with id: ${id}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaFileAlt className="text-blue-700 mr-2" /> Content Management
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId.page ? "Edit Page" : "Add New Page"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Page Title
              </label>
              <input
                type="text"
                name="title"
                value={newPage.title}
                onChange={(e) => handleInputChange(e, "page")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter page title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Content
              </label>
              <textarea
                name="content"
                value={newPage.content}
                onChange={(e) => handleInputChange(e, "page")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter page content"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Status
              </label>
              <select
                name="status"
                value={newPage.status}
                onChange={(e) => handleInputChange(e, "page")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                SEO Title
              </label>
              <input
                type="text"
                name="seo.title"
                value={newPage.seo.title}
                onChange={(e) => handleInputChange(e, "page")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter SEO title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                SEO Description
              </label>
              <input
                type="text"
                name="seo.description"
                value={newPage.seo.description}
                onChange={(e) => handleInputChange(e, "page")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter SEO description"
              />
            </div>
          </div>
          <motion.button
            className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={() =>
              editingId.page ? handleSaveEdit("page") : handleAdd("page")
            }
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {editingId.page ? "Save Changes" : "Add Page"}
          </motion.button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId.blog ? "Edit Blog" : "Add New Blog"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Blog Title
              </label>
              <input
                type="text"
                name="title"
                value={newBlog.title}
                onChange={(e) => handleInputChange(e, "blog")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter blog title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Content
              </label>
              <textarea
                name="content"
                value={newBlog.content}
                onChange={(e) => handleInputChange(e, "blog")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter blog content"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Status
              </label>
              <select
                name="status"
                value={newBlog.status}
                onChange={(e) => handleInputChange(e, "blog")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                SEO Title
              </label>
              <input
                type="text"
                name="seo.title"
                value={newBlog.seo.title}
                onChange={(e) => handleInputChange(e, "blog")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter SEO title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                SEO Description
              </label>
              <input
                type="text"
                name="seo.description"
                value={newBlog.seo.description}
                onChange={(e) => handleInputChange(e, "blog")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter SEO description"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Image Upload
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          <motion.button
            className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={() =>
              editingId.blog ? handleSaveEdit("blog") : handleAdd("blog")
            }
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {editingId.blog ? "Save Changes" : "Add Blog"}
          </motion.button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId.testimonial ? "Edit Testimonial" : "Add New Testimonial"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={newTestimonial.author}
                onChange={(e) => handleInputChange(e, "testimonial")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter author name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Content
              </label>
              <textarea
                name="content"
                value={newTestimonial.content}
                onChange={(e) => handleInputChange(e, "testimonial")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter testimonial content"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Rating
              </label>
              <select
                name="rating"
                value={newTestimonial.rating}
                onChange={(e) => handleInputChange(e, "testimonial")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>
            </div>
          </div>
          <motion.button
            className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={() =>
              editingId.testimonial
                ? handleSaveEdit("testimonial")
                : handleAdd("testimonial")
            }
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {editingId.testimonial ? "Save Changes" : "Add Testimonial"}
          </motion.button>
        </div>
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pages</h3>
            {pages.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No pages available.
              </p>
            ) : (
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">SEO Title</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page, index) => (
                    <motion.tr
                      key={page.id}
                      className="border-b hover:bg-blue-100"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <td className="px-4 py-2">{page.title}</td>
                      <td className="px-4 py-2">{page.status}</td>
                      <td className="px-4 py-2">{page.seo.title}</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <motion.button
                          className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          onClick={() => handleEdit(page, "page")}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
                          onClick={() => handleDelete(page.id, "page")}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Delete
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Blogs</h3>
            {blogs.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No blogs available.
              </p>
            ) : (
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">SEO Title</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog, index) => (
                    <motion.tr
                      key={blog.id}
                      className="border-b hover:bg-blue-100"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <td className="px-4 py-2">{blog.title}</td>
                      <td className="px-4 py-2">{blog.status}</td>
                      <td className="px-4 py-2">{blog.seo.title}</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <motion.button
                          className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          onClick={() => handleEdit(blog, "blog")}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
                          onClick={() => handleDelete(blog.id, "blog")}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Delete
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Testimonials
            </h3>
            {testimonials.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No testimonials available.
              </p>
            ) : (
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Author</th>
                    <th className="px-4 py-2">Content</th>
                    <th className="px-4 py-2">Rating</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((testimonial, index) => (
                    <motion.tr
                      key={testimonial.id}
                      className="border-b hover:bg-blue-100"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <td className="px-4 py-2">{testimonial.author}</td>
                      <td className="px-4 py-2">{testimonial.content}</td>
                      <td className="px-4 py-2">{testimonial.rating} Stars</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <motion.button
                          className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          onClick={() => handleEdit(testimonial, "testimonial")}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
                          onClick={() =>
                            handleDelete(testimonial.id, "testimonial")
                          }
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Delete
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentManagement;

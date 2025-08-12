import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPencilAlt, FaTrash, FaSave, FaTimes } from "react-icons/fa";

// Dummy data for initial state
const initialDesigns = [
  {
    id: 1,
    name: "T-Shirt Mockup",
    img: "https://placehold.co/400x300/3B82F6/FFFFFF?text=Design+1",
  },
  {
    id: 2,
    name: "Coffee Mug Art",
    img: "https://placehold.co/400x300/10B981/FFFFFF?text=Design+2",
  },
  {
    id: 3,
    name: "Poster Design",
    img: "https://placehold.co/400x300/F59E0B/FFFFFF?text=Design+3",
  },
  {
    id: 4,
    name: "Hoodie Graphic",
    img: "https://placehold.co/400x300/EF4444/FFFFFF?text=Design+4",
  },
  {
    id: 5,
    name: "Sticker Set",
    img: "https://placehold.co/400x300/8B5CF6/FFFFFF?text=Design+5",
  },
];

export default function SavedDesigns() {
  const [designs, setDesigns] = useState(initialDesigns);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  // --- CRUD Handlers ---
  const handleRemove = (id) => {
    setDesigns((prev) => prev.filter((design) => design.id !== id));
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = (id) => {
    if (editName.trim() === "") return; // Prevent saving empty names
    setDesigns((prev) =>
      prev.map((design) =>
        design.id === id ? { ...design, name: editName } : design
      )
    );
    setEditingId(null);
    setEditName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  // --- Animation Variants ---
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: i * 0.07,
      },
    }),
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.9 },
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* --- HEADER --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Saved Designs</h1>
          <p className="text-gray-500 mt-1">
            Manage and edit your creative work.
          </p>
        </div>

        {/* --- DESIGNS GRID --- */}
        <AnimatePresence>
          {designs.length === 0 ? (
            <motion.div
              className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xl font-semibold text-gray-700">
                No Saved Designs Yet
              </p>
              <p className="text-gray-500 mt-2">
                Start creating to see your designs here!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {designs.map((design, index) => (
                <motion.div
                  key={design.id}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group"
                >
                  <div
                    className="w-full h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${design.img})` }}
                  />

                  <div className="p-4">
                    {editingId === design.id ? (
                      // --- Edit State ---
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                          autoFocus
                        />
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            onClick={handleCancelEdit}
                            className="p-2 text-gray-500 hover:text-gray-800"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <FaTimes />
                          </motion.button>
                          <motion.button
                            onClick={() => handleSaveEdit(design.id)}
                            className="p-2 text-blue-600 hover:text-blue-800"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <FaSave />
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      // --- View State ---
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-800 break-all">
                          {design.name}
                        </p>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            onClick={() => handleEdit(design.id, design.name)}
                            className="p-2 text-gray-500 hover:text-blue-600"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <FaPencilAlt />
                          </motion.button>
                          <motion.button
                            onClick={() => handleRemove(design.id)}
                            className="p-2 text-gray-500 hover:text-red-600"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTable } from "react-icons/fa";

// Animation variants
const buttonVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97 },
};

const TablesPanel = ({ addDesignElement, onClose }) => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);

  const handleAddTable = () => {
    addDesignElement({
      type: "table",
      rows,
      cols,
      x: 50,
      y: 50,
      width: 150,
      height: 100,
    });
    setRows(2);
    setCols(2);
    onClose();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-blue-900 uppercase">Add Table</h3>
      <p className="text-sm text-blue-900">Create a table for your design.</p>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-blue-900">Rows:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={rows}
            onChange={(e) =>
              setRows(Math.max(1, Math.min(10, Number(e.target.value))))
            }
            className="w-16 p-2 border border-blue-200 rounded-lg text-blue-900 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-blue-900">Columns:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={cols}
            onChange={(e) =>
              setCols(Math.max(1, Math.min(10, Number(e.target.value))))
            }
            className="w-16 p-2 border border-blue-200 rounded-lg text-blue-900 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <motion.button
        onClick={handleAddTable}
        className="w-full bg-blue-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 uppercase"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label="Add table to design"
      >
        Add Table
      </motion.button>
    </div>
  );
};

export default TablesPanel;

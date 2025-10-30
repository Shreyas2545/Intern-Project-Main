import React, { useState, useContext, useCallback } from "react";
import { DesignContext } from "../DesignToolPage";

const TextPanel = () => {
  const { addDesignElement } = useContext(DesignContext);

  const [textInput, setTextInput] = useState("");

  const handleAddNewTextField = () => {
    const content = textInput.trim();
    if (!content) {
      console.warn("Please enter some text to add a new text field.");
      return;
    }

    // Define robust default properties for a new text element
    // These defaults should align with the properties the TextToolbar can control
    const defaultTextProperties = {
      fontFamily: "Arial", // A common default font
      fontSize: 24,
      color: "#000000",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "left",
      verticalAlign: "middle", // Default vertical alignment
      textTransform: "none", // Default text case
      isCurved: false,
      curveRadius: 0,
      curveDirection: "none", // 'none', 'upperLeft', 'upperRight', 'lowerLeft', 'lowerRight'
      stroke: "transparent", // Default to no stroke
      strokeWidth: 0,
      backgroundColor: "transparent", // Default to no background
      letterSpacing: 0,
      lineHeight: 1.2,
      opacity: 1,
      layer: 0, // Initial layer, DesignToolPage should manage actual layering
      rotation: 0,
      flipX: false,
      flipY: false,
      x: 50, // Initial position on canvas
      y: 50,
      width: 200, // Default width for a text box (can be adjusted by canvas interaction)
      height: 50, // Default height for a text box (can be adjusted by canvas interaction)
    };

    // Correctly call addDesignElement with a single object
    addDesignElement({
      type: "text", // This is the crucial missing part
      content: content,
      ...defaultTextProperties,
    });

    setTextInput(""); // Clear input after adding
  };

  return (
    <div className="space-y-5 rounded-xl w-full">
      <h3 className="text-lg font-bold text-blue-900 uppercase">Add Text</h3>
      <p className="text-sm text-gray-700">
        Enter your text to add a new text element to the design.
      </p>
      <div className="space-y-3">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type text here"
          className="w-full px-4 py-2 border border-blue-200 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          aria-label="Text input for new design element"
        />
        <button
          onClick={handleAddNewTextField}
          className="w-full bg-blue-800 text-white py-2.5 rounded-md font-semibold tracking-wide hover:bg-blue-900 transition duration-150"
          aria-label="Add new text field to design"
        >
          ADD TEXT
        </button>
      </div>
    </div>
  );
};

export default TextPanel;

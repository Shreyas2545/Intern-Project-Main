import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

const useDesignStore = create((set, get) => ({
  // Core state
  elements: [],
  selectedElementId: null,
  canvasBackgroundColor: "#FFFFFF",
  canvasSize: { width: 1200, height: 750 },
  zoom: 1,

  // History for Undo/Redo
  history: [],
  historyIndex: -1,

  // --- ACTIONS ---

  // Private action to save the current state to history
  _saveStateToHistory: () => {
    const { elements, history, historyIndex } = get();
    const newHistory = [...history.slice(0, historyIndex + 1), elements];
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  // Add a new element to the canvas
  addElement: (elementProps) => {
    const { canvasSize } = get();
    const newElement = {
      id: uuidv4(),
      x: canvasSize.width / 2 - (elementProps.width || 150) / 2,
      y: canvasSize.height / 2 - (elementProps.height || 50) / 2,
      rotation: 0,
      ...elementProps,
    };
    set((state) => ({
      elements: [...state.elements, newElement],
      selectedElementId: newElement.id,
    }));
    get()._saveStateToHistory();
  },

  // Select an element
  selectElement: (elementId) => {
    set({ selectedElementId: elementId });
  },

  // Deselect all elements
  deselectElement: () => {
    set({ selectedElementId: null });
  },

  // Update properties of an element
  updateElement: (elementId, newProps) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === elementId ? { ...el, ...newProps } : el
      ),
    }));
  },

  // Call this after a drag/resize is complete to save history
  finalizeElementUpdate: () => {
    get()._saveStateToHistory();
  },

  // Delete the selected element
  deleteSelectedElement: () => {
    set((state) => ({
      elements: state.elements.filter(
        (el) => el.id !== state.selectedElementId
      ),
      selectedElementId: null,
    }));
    get()._saveStateToHistory();
  },

  // Update canvas background
  setCanvasBackgroundColor: (color) => {
    set({ canvasBackgroundColor: color });
  },

  // Update zoom level
  setZoom: (zoom) => {
    set({ zoom: Math.max(0.1, Math.min(zoom, 3)) }); // Clamp zoom between 10% and 300%
  },

  // Undo action
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        elements: history[newIndex],
        historyIndex: newIndex,
        selectedElementId: null,
      });
    }
  },

  // Redo action
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        elements: history[newIndex],
        historyIndex: newIndex,
        selectedElementId: null,
      });
    }
  },

  // Initialize the history with the initial empty state
  initHistory: () => {
    set({ history: [[]], historyIndex: 0 });
  },
}));

export default useDesignStore;

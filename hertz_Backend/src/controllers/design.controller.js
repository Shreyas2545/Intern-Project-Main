// controllers/design.controller.js
import { Design } from "../models/design.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) =>
  typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

// Safely parse possible JSON strings or return original if not JSON
function safeParseMaybeJson(v) {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "object") return v;
  if (typeof v === "string") {
    const trimmed = v.trim();
    if (!trimmed) return undefined;
    try {
      return JSON.parse(trimmed);
    } catch {
      return v;
    }
  }
  return v;
}

// Color sanitizer
function sanitizeColorString(val) {
  if (val === undefined || val === null) return null;
  if (typeof val !== "string") return null;
  const s = val.trim();
  const hexRe = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
  const rgbHslRe =
    /^(rgba?|hsla?)\(\s*[-+0-9.%]+\s*,\s*[-+0-9.%]+\s*,\s*[-+0-9.%]+(?:\s*,\s*[\d.]+)?\s*\)$/i;
  if (hexRe.test(s) || rgbHslRe.test(s)) return s;
  const hexInside = s.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
  if (hexInside) return hexInside[0];
  return null;
}

function isDataUri(str) {
  return (
    typeof str === "string" && /^data:([a-z]+\/[a-z0-9.+-]+);base64,/.test(str)
  );
}

async function tryUploadDataUriToCloudinary(dataUri) {
  if (!dataUri) return null;
  try {
    const res = await uploadOnCloudinary(dataUri);
    if (res && (res.secure_url || res.url)) {
      return res.secure_url || res.url;
    }
  } catch (err) {
    console.warn("uploadOnCloudinary(dataUri) failed:", err?.message || err);
  }

  try {
    const comma = dataUri.indexOf(",");
    const header = dataUri.slice(0, comma);
    const extMatch = header.match(/data:image\/([a-zA-Z0-9.+-]+)/);
    const ext = extMatch ? extMatch[1].split("+")[0] : "png";
    const b64 = dataUri.slice(comma + 1);
    const buffer = Buffer.from(b64, "base64");
    const tmpName = `tmp-upload-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const tmpPath = path.join(process.cwd(), "tmp", tmpName);
    fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
    fs.writeFileSync(tmpPath, buffer);
    try {
      const res = await uploadOnCloudinary(tmpPath);
      fs.unlink(tmpPath, () => {});
      return res && (res.secure_url || res.url)
        ? res.secure_url || res.url
        : null;
    } catch (err) {
      fs.unlink(tmpPath, () => {});
      console.error("uploadOnCloudinary(file) failed:", err?.message || err);
      return null;
    }
  } catch (err) {
    console.error(
      "Failed to write temp file for dataUri upload:",
      err?.message || err,
    );
    return null;
  }
}

// Sanitize design elements
async function sanitizeElements(elements, canvasSize) {
  if (!Array.isArray(elements)) return [];
  const validTypes = ["text", "image", "graphic", "icon", "table"];
  const validShapes = [
    "square",
    "circle",
    "triangle",
    "star",
    "pentagon",
    "hexagon",
    "diamond",
    "line",
    "arrow",
  ];
  const validTextAligns = ["left", "center", "right", "justify"];
  const validFontWeights = ["normal", "bold"];
  const validFontStyles = ["normal", "italic"];
  const validTextDecorations = ["none", "underline"];
  const validStrokeStyles = ["solid", "dashed", "dotted"];
  const validFlips = ["horizontal", "vertical", null];

  return await Promise.all(
    elements.map(async (el) => {
      if (!el || typeof el !== "object" || !validTypes.includes(el.type)) {
        console.warn("Invalid element type, skipping:", el?.type);
        return null;
      }

      const sanitized = {
        type: el.type,
        id: el.id || `el-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };

      // Common properties
      sanitized.x = Math.max(0, Math.min(Number(el.x) || 0, canvasSize.width));
      sanitized.y = Math.max(0, Math.min(Number(el.y) || 0, canvasSize.height));
      sanitized.width = Math.max(1, Number(el.width) || 100);
      sanitized.height = Math.max(1, Number(el.height) || 100);
      sanitized.zIndex = Number(el.zIndex) || 0;
      sanitized.rotation = Number(el.rotation) || 0;
      sanitized.view = el.view === "Back" ? "Back" : "Front";
      sanitized.locked = !!el.locked;

      // Type-specific properties
      if (el.type === "text") {
        sanitized.content = String(el.content || "");
        sanitized.fontFamily = String(el.fontFamily || "Arial");
        sanitized.fontSize = Math.max(1, Number(el.fontSize) || 12);
        sanitized.fontWeight = validFontWeights.includes(el.fontWeight)
          ? el.fontWeight
          : "normal";
        sanitized.fontStyle = validFontStyles.includes(el.fontStyle)
          ? el.fontStyle
          : "normal";
        sanitized.textDecoration = validTextDecorations.includes(
          el.textDecoration,
        )
          ? el.textDecoration
          : "none";
        sanitized.textAlign = validTextAligns.includes(el.textAlign)
          ? el.textAlign
          : "center";
        sanitized.color = sanitizeColorString(el.color) || "#000000";
        sanitized.backgroundColor =
          sanitizeColorString(el.backgroundColor) || "transparent";
        sanitized.stroke = sanitizeColorString(el.stroke) || null;
        sanitized.strokeWidth = Math.min(
          Math.max(0, Number(el.strokeWidth) || 0),
          20,
        );
        sanitized.opacity = Math.min(Math.max(Number(el.opacity) || 1, 0), 1);
        sanitized.isCurved = !!el.isCurved;
      } else if (el.type === "image") {
        sanitized.content = isDataUri(el.content)
          ? await tryUploadDataUriToCloudinary(el.content)
          : el.content || "";
        sanitized.filter = String(el.filter || "");
        sanitized.hue = Math.min(Math.max(Number(el.hue) || 0, 0), 360);
        sanitized.sat = Math.min(Math.max(Number(el.sat) || 1, 0), 2);
        sanitized.br = Math.min(Math.max(Number(el.br) || 1, 0), 2);
        sanitized.opacity = Math.min(Math.max(Number(el.opacity) || 1, 0), 1);
        sanitized.borderRadius = Math.min(
          Math.max(Number(el.borderRadius) || 0, 0),
          50,
        );
      } else if (el.type === "graphic") {
        sanitized.shapeType = validShapes.includes(el.shapeType)
          ? el.shapeType
          : "square";
        sanitized.fillColor = sanitizeColorString(el.fillColor) || "#cccccc";
        sanitized.strokeColor =
          sanitizeColorString(el.strokeColor) || "transparent";
        sanitized.strokeWidth = Math.min(
          Math.max(Number(el.strokeWidth) || 0, 0),
          20,
        );
        sanitized.strokeStyle = validStrokeStyles.includes(el.strokeStyle)
          ? el.strokeStyle
          : "solid";
        sanitized.opacity = Math.min(Math.max(Number(el.opacity) || 1, 0), 1);
        sanitized.flip = validFlips.includes(el.flip) ? el.flip : null;
      } else if (el.type === "icon") {
        sanitized.icon = String(el.icon || "");
        sanitized.color = sanitizeColorString(el.color) || "#000000";
        sanitized.opacity = Math.min(Math.max(Number(el.opacity) || 1, 0), 1);
      } else if (el.type === "table") {
        sanitized.content = el.content || [];
      }

      return sanitized;
    }),
  ).then((results) => results.filter((el) => el !== null));
}

const createDesign = AsyncHandler(async (req, res) => {
  const {
    projectName,
    canvasShape,
    canvasSize,
    canvasBackground,
    designElements,
    productId,
  } = req.body;

  if (!projectName || !canvasShape) {
    throw new ApiError(400, "Project name and canvas shape are required");
  }

  const parsedCanvasSize = safeParseMaybeJson(canvasSize) || {
    width: 1050,
    height: 600,
  };
  const parsedElements = safeParseMaybeJson(designElements) || [];
  const parsedCanvasBackground =
    safeParseMaybeJson(canvasBackground) || "#ffffff";

  const sanitizedCanvasSize = {
    width: Number(parsedCanvasSize.width) || 1050,
    height: Number(parsedCanvasSize.height) || 600,
  };

  let sanitizedCanvasBackground = parsedCanvasBackground;
  if (
    typeof parsedCanvasBackground === "object" &&
    parsedCanvasBackground?.type === "gradient" &&
    Array.isArray(parsedCanvasBackground.colors)
  ) {
    sanitizedCanvasBackground.colors = parsedCanvasBackground.colors.map(
      (c) => sanitizeColorString(String(c)) || "#000000",
    );
  } else if (typeof parsedCanvasBackground === "string") {
    const clean = sanitizeColorString(parsedCanvasBackground);
    sanitizedCanvasBackground = clean ?? parsedCanvasBackground;
    if (
      typeof sanitizedCanvasBackground === "string" &&
      (sanitizedCanvasBackground.includes("oklab(") ||
        sanitizedCanvasBackground.includes("lab(") ||
        sanitizedCanvasBackground.includes("lch(") ||
        sanitizedCanvasBackground.includes("color("))
    ) {
      sanitizedCanvasBackground = "#ffffff";
    }
  }

  const sanitizedElements = await sanitizeElements(
    parsedElements,
    sanitizedCanvasSize,
  );

  let previewImageUrl = null;
  if (req.file) {
    try {
      const up = await uploadOnCloudinary(req.file.path);
      if (!up || (!up.secure_url && !up.url))
        throw new Error("Cloudinary no url");
      previewImageUrl = up.secure_url || up.url;
      try {
        if (req.file.path && fs.existsSync(req.file.path))
          fs.unlinkSync(req.file.path);
      } catch {}
    } catch (err) {
      console.error("Preview upload failed:", err?.message || err);
      throw new ApiError(500, "Failed to upload preview image");
    }
  }

  if (productId && !isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID format");
  }

  const design = await Design.create({
    userId: req.user?._id || null,
    projectName,
    canvasShape,
    canvasSize: sanitizedCanvasSize,
    canvasBackground: sanitizedCanvasBackground,
    designElements: sanitizedElements,
    previewImage: previewImageUrl,
    productId: productId || null,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, design, "Design created successfully"));
});

const getDesigns = AsyncHandler(async (req, res) => {
  const designs = await Design.find({ userId: req.user?._id }).populate(
    "productId",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, designs, "Designs retrieved successfully"));
});

const getDesignById = AsyncHandler(async (req, res) => {
  const { designId } = req.params;
  if (!isValidObjectId(designId))
    throw new ApiError(400, "Invalid design ID format");
  const design = await Design.findById(designId).populate("productId");
  if (!design) throw new ApiError(404, "Design not found");
  return res
    .status(200)
    .json(new ApiResponse(200, design, "Design retrieved successfully"));
});

const getDesignByProductId = AsyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId))
    throw new ApiError(400, "Invalid product ID format");
  const design = await Design.findOne({ productId }).populate("productId");
  if (!design) throw new ApiError(404, "Design not found for this product");
  return res
    .status(200)
    .json(new ApiResponse(200, design, "Design retrieved successfully"));
});

const updateDesign = AsyncHandler(async (req, res) => {
  const { designId } = req.params;
  if (!isValidObjectId(designId))
    throw new ApiError(400, "Invalid design ID format");

  const design = await Design.findById(designId);
  if (!design) throw new ApiError(404, "Design not found");

  const {
    projectName,
    canvasShape,
    canvasSize,
    canvasBackground,
    designElements,
    productId,
  } = req.body;

  const parsedCanvasSize = safeParseMaybeJson(canvasSize);
  const parsedCanvasBackground = safeParseMaybeJson(canvasBackground);
  const parsedElements = safeParseMaybeJson(designElements);

  const sanitizedCanvasSize = parsedCanvasSize
    ? {
        width: Number(parsedCanvasSize.width) || design.canvasSize.width,
        height: Number(parsedCanvasSize.height) || design.canvasSize.height,
      }
    : design.canvasSize;

  const sanitizedElements = await sanitizeElements(
    parsedElements || design.designElements,
    sanitizedCanvasSize,
  );

  let sanitizedCanvasBackground = design.canvasBackground;
  if (parsedCanvasBackground !== undefined) {
    if (
      typeof parsedCanvasBackground === "object" &&
      parsedCanvasBackground?.type === "gradient" &&
      Array.isArray(parsedCanvasBackground.colors)
    ) {
      sanitizedCanvasBackground = {
        ...parsedCanvasBackground,
        colors: parsedCanvasBackground.colors.map(
          (c) => sanitizeColorString(String(c)) || "#000000",
        ),
      };
    } else if (typeof parsedCanvasBackground === "string") {
      const clean = sanitizeColorString(parsedCanvasBackground);
      sanitizedCanvasBackground = clean ?? parsedCanvasBackground;
      if (
        typeof sanitizedCanvasBackground === "string" &&
        (sanitizedCanvasBackground.includes("oklab(") ||
          sanitizedCanvasBackground.includes("lab(") ||
          sanitizedCanvasBackground.includes("lch(") ||
          sanitizedCanvasBackground.includes("color("))
      ) {
        sanitizedCanvasBackground = "#ffffff";
      }
    }
  }

  let previewImageUrl = design.previewImage;
  if (req.file) {
    try {
      const up = await uploadOnCloudinary(req.file.path);
      if (!up || (!up.secure_url && !up.url))
        throw new Error("Cloudinary no url");
      previewImageUrl = up.secure_url || up.url;
      try {
        if (req.file.path && fs.existsSync(req.file.path))
          fs.unlinkSync(req.file.path);
      } catch {}
    } catch (err) {
      console.error("Preview upload failed:", err?.message || err);
      throw new ApiError(500, "Failed to upload preview image");
    }
  }

  if (productId && !isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID format");
  }

  design.projectName = projectName || design.projectName;
  design.canvasShape = canvasShape || design.canvasShape;
  design.canvasSize = sanitizedCanvasSize;
  design.canvasBackground = sanitizedCanvasBackground;
  design.designElements = sanitizedElements;
  design.previewImage = previewImageUrl;
  design.productId = productId || design.productId;

  await design.save();
  return res
    .status(200)
    .json(new ApiResponse(200, design, "Design updated successfully"));
});

const deleteDesign = AsyncHandler(async (req, res) => {
  const { designId } = req.params;
  if (!isValidObjectId(designId))
    throw new ApiError(400, "Invalid design ID format");
  const design = await Design.findById(designId);
  if (!design) throw new ApiError(404, "Design not found");
  await design.remove();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Design deleted successfully"));
});

export {
  createDesign,
  getDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  getDesignByProductId,
};
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
      // not JSON => return raw string
      return v;
    }
  }
  return v;
}

// Color sanitizer: allow hex (#...), rgb(...), rgba(...), hsl(...), hsla(...).
// Reject (or fallback) on modern color functions like oklab(), lab(), lch(), color(...)
// Return sanitizedColor or null (caller will decide fallback)
function sanitizeColorString(val) {
  if (val === undefined || val === null) return null;
  if (typeof val !== "string") return null;
  const s = val.trim();

  // Accept hex (#fff or #ffffff)
  const hexRe = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
  // Accept rgb/rgba/hsl/hsla
  const rgbHslRe =
    /^(rgba?|hsla?)\(\s*[-+0-9.%]+\s*,\s*[-+0-9.%]+\s*,\s*[-+0-9.%]+(?:\s*,\s*[\d.]+)?\s*\)$/i;

  if (hexRe.test(s) || rgbHslRe.test(s)) return s;

  // If it contains 'var(' or modern functions like 'oklab', 'lab', 'lch', 'color(' => reject
  const prohibited = ["oklab(", "lab(", "lch(", "color(", "var("];
  for (const p of prohibited) {
    if (s.toLowerCase().includes(p)) return null;
  }

  // small fallback: if the string contains a hex inside it, extract it
  const hexInside = s.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
  if (hexInside) return hexInside[0];

  // otherwise not a supported color string
  return null;
}

function isDataUri(str) {
  return (
    typeof str === "string" && /^data:([a-z]+\/[a-z0-9.+-]+);base64,/.test(str)
  );
}

// very rough size estimator for dataURI in bytes
function estimateDataUriSize(dataUri) {
  if (!dataUri || typeof dataUri !== "string") return 0;
  // drop header "data:...;base64," then base64 length
  const comma = dataUri.indexOf(",");
  if (comma === -1) return dataUri.length;
  const b64 = dataUri.slice(comma + 1);
  // base64 length * 3/4 ~ bytes
  return Math.floor((b64.length * 3) / 4);
}

// upload data URI to Cloudinary (attempt). If uploadOnCloudinary supports data URIs, pass directly.
// If not, optionally write temp file and try uploading a file path. We try both gracefully.
async function tryUploadDataUriToCloudinary(dataUri) {
  if (!dataUri) return null;
  // first try passing directly (many wrappers accept dataURI)
  try {
    if (typeof uploadOnCloudinary === "function") {
      const res = await uploadOnCloudinary(dataUri);
      if (res && (res.secure_url || res.url)) {
        return res.secure_url || res.url;
      }
    }
  } catch (err) {
    // ignore and try fallback write-to-disk approach
    console.warn(
      "uploadOnCloudinary(dataUri) failed, will try temp file fallback:",
      err?.message || err,
    );
  }

  // fallback: write buffer to temp file then call uploadOnCloudinary(filePath)
  try {
    const comma = dataUri.indexOf(",");
    const header = dataUri.slice(0, comma);
    const extMatch = header.match(/data:image\/([a-zA-Z0-9.+-]+)/);
    const ext = extMatch ? extMatch[1].split("+")[0] : "png";
    const b64 = dataUri.slice(comma + 1);
    const buffer = Buffer.from(b64, "base64");
    const tmpName = `tmp-upload-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const tmpPath = path.join(process.cwd(), "tmp", tmpName);

    // ensure tmp dir
    fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
    fs.writeFileSync(tmpPath, buffer);

    try {
      const res = await uploadOnCloudinary(tmpPath);
      // remove tmp file
      fs.unlink(tmpPath, () => {});
      if (res && (res.secure_url || res.url)) {
        return res.secure_url || res.url;
      } else {
        return null;
      }
    } catch (err) {
      // cleanup and rethrow
      fs.unlink(tmpPath, () => {});
      console.error(
        "uploadOnCloudinary(file) fallback failed:",
        err?.message || err,
      );
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

// sanitize a single element
async function sanitizeElement(
  el = {},
  canvasSize = { width: 1050, height: 600 },
) {
  const e = JSON.parse(JSON.stringify(el || {})); // deep-ish clone of serializable fields

  // remove functions
  Object.keys(e).forEach((k) => {
    if (typeof e[k] === "function") delete e[k];
  });

  const toNum = (v, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const cw = Number(canvasSize?.width) || 1050;
  const ch = Number(canvasSize?.height) || 600;

  e.x = toNum(e.x, 0);
  e.y = toNum(e.y, 0);
  e.width = toNum(e.width, Math.min(200, Math.max(10, cw * 0.2)));
  e.height = toNum(e.height, Math.min(200, Math.max(10, ch * 0.2)));

  // clamp
  if (e.x < 0) e.x = 0;
  if (e.y < 0) e.y = 0;
  if (e.width <= 0) e.width = Math.min(200, cw);
  if (e.height <= 0) e.height = Math.min(200, ch);
  if (e.x + e.width > cw) e.x = Math.max(0, cw - e.width);
  if (e.y + e.height > ch) e.y = Math.max(0, ch - e.height);

  e.zIndex = Number.isFinite(Number(e.zIndex)) ? Number(e.zIndex) : 1;
  e.opacity = Number.isFinite(Number(e.opacity)) ? Number(e.opacity) : 1;
  if (typeof e.locked !== "boolean") e.locked = !!e.locked;

  // sanitize color-like props if present
  const colorProps = [
    "color",
    "backgroundColor",
    "stroke",
    "strokeColor",
    "fillColor",
  ];
  colorProps.forEach((p) => {
    if (e[p]) {
      const clean = sanitizeColorString(String(e[p]));
      if (clean) {
        e[p] = clean;
      } else {
        // fallback: remove property or use transparent/black depending on usage
        if (p === "backgroundColor") e[p] = "transparent";
        else e[p] = "#000000";
      }
    }
  });

  // content handling:
  if (typeof e.content === "string") {
    if (e.content.startsWith("blob:")) {
      // cannot fetch blob: URL server-side — remove it to avoid storing inaccessible value
      console.warn(
        "Removing client-side blob: URL from element content (server cannot fetch it).",
        e.id,
      );
      delete e.content;
    } else if (isDataUri(e.content)) {
      // estimate size
      const bytes = estimateDataUriSize(e.content);
      const threshold = 200 * 1024; // 200 KB threshold - adjust if you want
      if (bytes > threshold) {
        // try to upload to cloud
        console.info(
          `Uploading large dataURI for element ${e.id} (~${Math.round(bytes / 1024)}KB) to Cloudinary`,
        );
        const uploaded = await tryUploadDataUriToCloudinary(e.content);
        if (uploaded) {
          e.content = uploaded;
        } else {
          // if upload fails, remove content to avoid huge DB entries
          console.warn(
            "Cloud upload failed for large element content; removing content to avoid DB overflow.",
            e.id,
          );
          delete e.content;
        }
      } else {
        // small dataURIs: keep (but cap total length to avoid huge docs)
        const maxLen = 200 * 1024; // keep small ones up to 200 KB
        if (e.content.length > maxLen) {
          // try upload or drop
          const uploaded = await tryUploadDataUriToCloudinary(e.content);
          if (uploaded) e.content = uploaded;
          else {
            console.warn(
              "Small-but-over-limit dataURI could not be uploaded and will be removed.",
              e.id,
            );
            delete e.content;
          }
        }
      }
    } else {
      // non-data string. Protect DB by truncating extremely long strings (like giant CSS blobs)
      const MAX_STR = 5000; // allow 5k chars
      if (e.content.length > MAX_STR) {
        console.warn(
          `Truncating element.content (length ${e.content.length}) to ${MAX_STR} chars for element ${e.id}`,
        );
        e.content = e.content.slice(0, MAX_STR);
      }
    }
  }

  if (!e.id)
    e.id = `element-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return e;
}

async function sanitizeElements(
  elements = [],
  canvasSize = { width: 1050, height: 600 },
) {
  if (!Array.isArray(elements)) return [];
  const out = [];
  for (const el of elements) {
    try {
      const s = await sanitizeElement(el, canvasSize);
      out.push(s);
    } catch (err) {
      console.warn(
        "Skipping an element due to sanitize error:",
        err?.message || err,
      );
    }
  }
  return out;
}

/* CREATE */
const createDesign = AsyncHandler(async (req, res) => {
  const { projectName, canvasShape } = req.body;
  if (!projectName || !canvasShape)
    throw new ApiError(400, "projectName and canvasShape are required");

  let canvasSize = safeParseMaybeJson(req.body.canvasSize) || {
    width: 1050,
    height: 600,
  };
  const parsedCanvasBackground = safeParseMaybeJson(req.body.canvasBackground);
  const rawElements = safeParseMaybeJson(req.body.designElements) || [];

  // coerce canvasSize numbers
  canvasSize = {
    width: Number(canvasSize?.width) || 1050,
    height: Number(canvasSize?.height) || 600,
  };

  // sanitize elements
  const designElements = await sanitizeElements(rawElements, canvasSize);

  // preview image upload (multer file)
  let previewImageUrl = null;
  if (req.file) {
    try {
      const uploadRes = await uploadOnCloudinary(req.file.path);
      if (!uploadRes || (!uploadRes.secure_url && !uploadRes.url)) {
        throw new Error("Cloudinary did not return a URL");
      }
      previewImageUrl = uploadRes.secure_url || uploadRes.url;
      // cleanup tmp local file if present
      try {
        if (req.file.path && fs.existsSync(req.file.path))
          fs.unlinkSync(req.file.path);
      } catch {}
    } catch (err) {
      console.error("Preview upload error:", err?.message || err);
      throw new ApiError(500, "Failed to upload preview image");
    }
  }

  // canvasBackground sanitize if it's an object with gradient colors
  let canvasBackground = parsedCanvasBackground ?? "#ffffff";
  try {
    if (canvasBackground && typeof canvasBackground === "object") {
      if (
        canvasBackground.type === "gradient" &&
        Array.isArray(canvasBackground.colors)
      ) {
        const cleanColors = canvasBackground.colors.map(
          (c) => sanitizeColorString(String(c)) || "#000000",
        );
        canvasBackground.colors = cleanColors;
      } else if (canvasBackground.type === "image" && canvasBackground.value) {
        // if background image is dataURI and large, upload it and replace
        if (isDataUri(canvasBackground.value)) {
          const bytes = estimateDataUriSize(canvasBackground.value);
          if (bytes > 200 * 1024) {
            const uploaded = await tryUploadDataUriToCloudinary(
              canvasBackground.value,
            );
            if (uploaded) canvasBackground.value = uploaded;
            else {
              // fallback to default color
              canvasBackground = "#ffffff";
            }
          }
        }
      }
    } else if (typeof canvasBackground === "string") {
      // sanitize color string if plain string
      const clean = sanitizeColorString(canvasBackground);
      canvasBackground = clean ?? canvasBackground; // if not valid leave as-is (could be gradient string)
      // If it contains unsupported functions like oklab, nullify
      if (
        typeof canvasBackground === "string" &&
        (canvasBackground.includes("oklab(") ||
          canvasBackground.includes("color(") ||
          canvasBackground.includes("lab(") ||
          canvasBackground.includes("lch("))
      ) {
        canvasBackground = "#ffffff";
      }
    }
  } catch (err) {
    console.warn("Canvas background sanitize failed:", err?.message || err);
    canvasBackground = "#ffffff";
  }

  const productId = req.body.productId;
  if (productId && !isValidObjectId(productId))
    throw new ApiError(400, "Invalid product ID format");

  try {
    const design = await Design.create({
      projectName,
      canvasShape,
      canvasSize,
      canvasBackground,
      designElements,
      previewImage: previewImageUrl,
      productId: productId || undefined,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, design, "Design created successfully"));
  } catch (err) {
    console.error("Design create error:", err?.message || err, { projectName });
    throw new ApiError(
      500,
      "Failed to create design: " + (err?.message || "unknown"),
    );
  }
});

/* GET / LIST / UPDATE / DELETE */
const getDesigns = AsyncHandler(async (req, res) => {
  const designs = await Design.find().populate("productId");
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

  const rawCanvasSize = safeParseMaybeJson(req.body.canvasSize);
  const rawCanvasBackground = safeParseMaybeJson(req.body.canvasBackground);
  const rawElements = safeParseMaybeJson(req.body.designElements);
  const projectName = req.body.projectName;
  const canvasShape = req.body.canvasShape;
  const productId = req.body.productId;

  // coerce canvas size
  const canvasSize = rawCanvasSize
    ? {
        width: Number(rawCanvasSize.width) || design.canvasSize.width,
        height: Number(rawCanvasSize.height) || design.canvasSize.height,
      }
    : design.canvasSize;

  const sanitizedElements = rawElements
    ? await sanitizeElements(rawElements, canvasSize)
    : design.designElements;

  // preview upload if present
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

  // sanitize and handle canvasBackground update
  let canvasBackground = design.canvasBackground;
  if (rawCanvasBackground !== undefined) {
    try {
      let cb = rawCanvasBackground;
      if (
        typeof cb === "object" &&
        cb?.type === "gradient" &&
        Array.isArray(cb.colors)
      ) {
        cb.colors = cb.colors.map(
          (c) => sanitizeColorString(String(c)) || "#000000",
        );
      } else if (typeof cb === "string") {
        const clean = sanitizeColorString(cb);
        cb = clean ?? cb;
        if (
          typeof cb === "string" &&
          (cb.includes("oklab(") ||
            cb.includes("lab(") ||
            cb.includes("lch(") ||
            cb.includes("color("))
        ) {
          cb = "#ffffff";
        }
      }
      canvasBackground = cb;
    } catch (err) {
      console.warn(
        "Canvas background sanitize error during update:",
        err?.message || err,
      );
    }
  }

  if (productId && !isValidObjectId(productId))
    throw new ApiError(400, "Invalid product ID format");

  try {
    if (projectName) design.projectName = projectName;
    if (canvasShape) design.canvasShape = canvasShape;
    design.canvasSize = canvasSize;
    design.canvasBackground = canvasBackground;
    design.designElements = sanitizedElements;
    design.previewImage = previewImageUrl;
    if (productId) design.productId = productId;
    await design.save();
    return res
      .status(200)
      .json(new ApiResponse(200, design, "Design updated successfully"));
  } catch (err) {
    console.error("Design update error:", err?.message || err, { designId });
    throw new ApiError(
      500,
      "Failed to update design: " + (err?.message || "unknown"),
    );
  }
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

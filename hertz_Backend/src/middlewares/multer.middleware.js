import multer from "multer";

// Configure multer to store files on the local disk temporarily
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // The directory where uploaded files will be stored
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // Use the original filename to keep it simple
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
  // ✅ Add a file size limit to reject large files before they reach Cloudinary.
  // This limit is set to 5 megabytes.
  limits: {
    fileSize: 20 * 1024 * 1024, // 5 MB in bytes
  },
});

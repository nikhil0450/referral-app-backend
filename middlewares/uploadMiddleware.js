const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure 'uploads' directory exists
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Use a unique filename to avoid conflicts
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter for only PDF files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2 MB
});


module.exports = upload;

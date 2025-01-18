const multer = require("multer");
const path = require("path");
const rootPath = path.resolve(__dirname, "..");

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(rootPath, "uploads")); // Use rootPath for consistent paths
  },
  filename: (req, file, cb) => {
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

const multer = require("multer");
const path = require("path");

// Allowed image types
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    cb(null, path.join(__dirname, "uploads")); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique name for each file
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject file
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter,
});

module.exports = upload;

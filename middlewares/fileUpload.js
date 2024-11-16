const multer = require("multer");
const path = require("path");

// Allowed image types
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use the /tmp directory for Vercel or fallback to 'uploads' in local environment
    const uploadPath =
      process.env.NODE_ENV === "production"
        ? "/tmp/uploads"
        : path.join(__dirname, "uploads");
    cb(null, uploadPath); // Save files to the appropriate directory
  },
  filename: (req, file, cb) => {
    // Generate a unique name for each file using the current timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject file
  }
};

// Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter,
}).single("image"); // Ensure this matches the field name in your form (e.g., 'image')

module.exports = upload;

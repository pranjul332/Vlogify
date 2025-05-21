const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

// Ensure uploads directory exists
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept more file types to be more permissive
  if (
    file.mimetype.startsWith("video/") ||
    file.mimetype.startsWith("audio/") ||
    file.mimetype === "application/octet-stream" // For some video formats that might be misidentified
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Unsupported file type. Please upload a video or audio file."),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // Increased to 50 MB limit
  },
});

// Better error handling for the upload endpoint
router.post("/addvideo", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "File size exceeds the limit (50MB)" });
        }
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }

    // No file uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded or file type not supported" });
    }

    try {
      // Process the uploaded file
      await uploadController.uploadAndProcessVideo(req, res);
    } catch (error) {
      console.error("Upload processing error:", error);
      return res
        .status(500)
        .json({ error: "Failed to process upload: " + error.message });
    }
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", authMiddleware, adminMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

  res.json({
    success: true,
    imageUrl,
  });
});

module.exports = router;
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, message: "auth works" });
});

router.post("/login", (req, res) => {
  res.json({ success: true, message: "login route" });
});

router.post("/signup", (req, res) => {
  res.json({ success: true, message: "signup route" });
});

module.exports = router;
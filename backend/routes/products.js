const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      createdBy: "65f000000000000000000000",
    });

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const product = new Product({
//       ...req.body,
//       createdBy: req.user._id,
//     });

//     await product.save();
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.put("/:id", async (req, res) => {
  try {
    console.log("current user:", req.user); //log

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isActive: false
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
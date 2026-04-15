const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const getSortOption = (sort) => {
  switch (sort) {
    case "price_asc":
      return { price: 1 };
    case "price_desc":
      return { price: -1 };
    case "last_added":
    default:
      return { createdAt: -1 };
  }
};

router.get("/", authMiddleware, async (req, res) => {
  try {
    const isAdmin = req.user?.role === "admin";

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 8, 1);
    const search = (req.query.search || "").trim();
    const sort = req.query.sort || "last_added";

    const filter = isAdmin ? {} : { isActive: true };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const sortOption = getSortOption(sort);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const isAdmin = req.user?.role === "admin";

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!product.isActive && !isAdmin) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user._id,
    };

    if (Number(productData.stock) === 0) {
      productData.isActive = false;
    }

    const product = new Product(productData);

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    Object.assign(product, req.body);

    if (Number(product.stock) === 0) {
      product.isActive = false;
    }

    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.isActive = false;
    await product.save();

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
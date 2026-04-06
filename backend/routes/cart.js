const express = require("express");
const router = express.Router();
const { addItemToCart, getCart, updateItemQuantity, removeItemFromCart, clearCart } = require("../controllers/cartController");
const { requireAuth } = require("../middleware/requireAuthMiddleware");
const { validateCart } = require("../middleware/validateCartMiddleware");

// Add item to cart
router.post("/", requireAuth, validateCart, addItemToCart);

// Get cart
router.get("/", requireAuth, getCart);

// Update item quantity in cart
router.put("/:productId", requireAuth, validateCart, updateItemQuantity);

// remove item from cart
router.delete("/:productId", requireAuth, validateCart, removeItemFromCart);

// clear cart
router.delete("/", requireAuth, clearCart);


module.exports = router;
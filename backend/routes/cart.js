const express = require("express");
const router = express.Router();
const { getCart, getCartItemCount, addItemToCart, updateItemQuantity, removeItemFromCart, clearCart, checkout } = require("../controllers/cartController");
const requireAuth = require("../middleware/authMiddleware");
const { validateCart } = require("../middleware/validateCartMiddleware");


// Get numbers of the item in cart
router.get("/count", requireAuth, getCartItemCount);

// Checkout the cart
router.delete("/checkout", requireAuth, checkout);

router.route("/")
    .get(requireAuth, getCart) // Get cart
    .post(requireAuth, validateCart, addItemToCart) // Add item to cart
    .delete(requireAuth, clearCart); // clear the cart

router.route("/:productId")
    .patch(requireAuth, validateCart, updateItemQuantity) // update item quantity in cart
    .delete(requireAuth, validateCart, removeItemFromCart); // remove item from cart

module.exports = router;
const express = require("express");
const router = express.Router();
const { getCart, updateItemQuantity, clearCart, checkout } = require("../controllers/cartController");
const requireAuth = require("../middleware/authMiddleware");
const { validateCart } = require("../middleware/validateCartMiddleware");


// Checkout the cart
router.delete("/checkout", requireAuth, checkout);

router.route("/")
    .get(requireAuth, getCart) // Get cart
    .delete(requireAuth, clearCart); // clear the cart

router.route("/:productId")
    .patch(requireAuth, validateCart, updateItemQuantity) // update item quantity in cart

module.exports = router;
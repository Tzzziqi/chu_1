const mongoose = require("mongoose");

const validateCart = (req, res, next) => {
    const productId = req.params.productId || req.body.productId;
    const { quantity } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    if (quantity !== undefined) {
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
            return res.status(400).json({ error: "Quantity must be an integer between 1 and 50." });
        }
    } else {

        if (req.method === "POST") {
            // add item to cart
            req.body.quantity = 1;
        } else if (req.method === "PUT") {
            // update item quantity in cart
            return res.status(400).json({ error: "Quantity is required for update" });
        }
    }

    next();
};

module.exports = { validateCart };

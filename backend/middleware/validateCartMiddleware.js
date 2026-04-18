
/* three router will use this middleware
 * POST "/" addItemToCart
 * PATCH "/:productId updateItemQuantity
 * DELETE "/:productId removeItemFromCart
 */
const validateCart = (req, res, next) => {

    const productId = req.params.productId || req.body.productId;
    const { quantity } = req.body;

    if (!productId) {
        return res.status(400).json({ error: "Missing productId" });
    }

    if (quantity !== undefined) {
        if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0 || quantity > 99) {
            return res.status(400).json({ error: "Item quantity must be an integer between 1 and 99" });
        }
    } else {
        return res.status(400).json({ error: "Missing item quantity" });
    }

    next();
}

module.exports = { validateCart };
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Promotion = require("../models/Promotion");
const mongoose = require('mongoose');


const getFullCartData = async (userId, promotionCode = null) => {
    const [cartItems, promotion] = await Promise.all([
        Cart.find({ user: userId }).populate('product', 'name price imageUrl stock').lean(),
        promotionCode ? Promotion.findOne({ promotionCode }).lean() : null
    ])

    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.product?.price || 0;
        return acc + (price * item.quantity);
    }, 0);

    const itemTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const taxRate = 0.1;
    const tax = subtotal * taxRate;

    let discount = 0;
    if (promotion) {
        discount = Math.min(subtotal + tax, promotion.discount);
    }

    return {
        items: cartItems,
        summary: {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            discount: discount.toFixed(2),
            estimatedTotal: (subtotal + tax - discount).toFixed(2),
            itemTotalCount: itemTotalCount
        }
    }
}

const getCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { promotionCode } = req.query;

        const cartData = await getFullCartData(userId, promotionCode);

        res.status(200).json({ success: true, cart: cartData });
    } catch (error) {
        next(error);
    }
};

const updateItemQuantity = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;
        const { quantity } = req.body;

        if (quantity === 0) {
            await Cart.findOneAndDelete({ user: userId, product: productId });
        } else {
            await Cart.findOneAndUpdate(
                { user: userId, product: productId },
                { quantity },
                {
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true
                });
        }

        const cartData = await getFullCartData(userId);

        res.status(200).json({ success: true, cart: cartData });
    } catch (error) {
        next(error);
    }
};

const clearCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        await Cart.deleteMany({ user: userId });

        const cartData = await getFullCartData(userId);

        res.status(200).json({ success: true, cart: cartData });
    } catch (error) {
        next(error);
    }
};

const checkout = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const userId = req.user._id;
        const cartItems = await Cart.find({ user: userId }).populate('product').session(session);

        if (cartItems.length === 0) {
            throw new Error("Empty cart!");
        }

        const outOfStockItems = [];

        for (const item of cartItems) {
            if (item.quantity > item.product.stock) {
                outOfStockItems.push(`insufficient quantity for ${ item.product.name }`);
            }
        }

        if (outOfStockItems.length > 0) {
            const error = new Error("Out of Stock");
            error.statusCode = 400;
            error.details = outOfStockItems;
            throw error;
        }

        for (const item of cartItems) {
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } },
                { session, runValidators: true }
            );
        }

        await Cart.deleteMany({ user: userId }, { session });
        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: "Successfully checkout"
        });

    } catch (error) {
        await session.abortTransaction();
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            errors: error.details || []
        });
    } finally {
        await session.endSession();
    }
};


module.exports = { getCart, updateItemQuantity, clearCart, checkout };
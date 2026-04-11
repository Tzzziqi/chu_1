const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Promotion = require("../models/Promotion");
const mongoose = require('mongoose');



const getCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { promotionCode } = req.query;
        const cartItems = await Cart.find({ user: userId }).populate('product');
        const promotion = await Promotion.findOne({ promotionCode });

        const subtotal = cartItems.reduce((acc, item) => {
            return acc + (item.product.price * item.quantity);
        }, 0);

        const taxRate = 0.1;
        const tax = subtotal * taxRate;

        let discount = 0;
        if (promotion) {
            discount = Math.min(subtotal + tax, promotion.discount);
        }
        const estimatedTotal = subtotal + tax - discount;

        res.status(200).json({
            success: true,
            data: {
                items: cartItems,
                summary: {
                    subtotal: subtotal.toFixed(2),
                    tax: tax.toFixed(2),
                    discount: discount.toFixed(2),
                    estimatedTotal: estimatedTotal.toFixed(2),
                    count: cartItems.length
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

const getCartItemCount = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const result = await Cart.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) }},
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$quantity" }
                }
            }
        ]);

        const count = result.length > 0 ? result[0].totalQuantity : 0;

        res.status(200).json({
            success: true,
            data: count
        })
    } catch (error) {
        next(error);
    }
};

const addItemToCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const productId = req.body.productId;

        const existingCartItem = await Cart.findOne({ user: userId, product: productId });

        if (existingCartItem) {
            return res.status(409).json({
                success: false,
                error: "Cart item already exist!"
            });
        }

        const cartItem = await Cart.create({ user: userId, product: productId });
        res.status(201).json({
            success: true,
            data: cartItem
        });

    } catch (error) {
        next(error);
    }
};

const updateItemQuantity = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;
        const { quantity } = req.body;

        const updatedCartItem = await Cart.findOneAndUpdate(
            { user: userId, product: productId },
            { quantity },
            {
                returnDocument: "after",
                runValidators: true
            });

        if (!updatedCartItem) {
            res.status(404).json({
                success: false,
                error: "Can't find the cart item"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedCartItem
        });

    } catch (error) {
        next(error);
    }
};

const removeItemFromCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;

        const deletedCartItem = await Cart.findOneAndDelete({ user: userId, product: productId });

        if (!deletedCartItem) {
            res.status(404).json({
                success: false,
                error: "Can't find the cart item to delete"
            });
        }

        res.status(200).json({
            success: true,
            message: "Successfully remove item from cart",
            data: deletedCartItem
        });
    } catch (error) {
        next(error);
    }
};

const clearCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const result = await Cart.deleteMany({ user: userId });

        res.status(200).json({
            success: true,
            message: `Successfully clear the cart. Total remove ${result.deletedCount} items.`
        });
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
            throw new Error("Empty cart");
        }

        const outOfStockItems = [];

        for (const item of cartItems) {
            if (item.quantity > item.product.stock) {
                outOfStockItems.push(`insufficient quantity for ${item.product.name}`);
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
                { $inc: { stock: -item.quantity }},
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



module.exports = { getCart, getCartItemCount, addItemToCart, updateItemQuantity, removeItemFromCart, clearCart, checkout };
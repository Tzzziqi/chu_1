const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: [1, 'Quantity must be at least 1'],
                max: [50, 'Quantity must be at most 50']
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    promotionCode: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Promotion', promotionSchema);
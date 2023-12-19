const mongoose = require('mongoose');

const dishSchema = mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: String
    },
    dishType: {
        type: String
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('dishes', dishSchema);
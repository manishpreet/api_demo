const mongoose = require('mongoose');

const locationsSchema = mongoose.Schema({
    name: {
        type: String
    },
    pincode: {
        type: String
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('locations', locationsSchema);
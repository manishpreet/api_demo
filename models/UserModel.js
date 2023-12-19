const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    city: {
        type: String
    },
    flat: {
        type: String
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    phone: {
        type: String,
    },
    pincode: {
        type: String,
    },
    recipientName: {
        type: String,
    },
    state: {
        type: String,
    },
    socity: {
        type: String,
    }

});

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    token: {
        type: String
    },
    email: {
        type: String
    },
    dialCode: {
        type: String
    },
    phone: {
        type: String,
        unique: true
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    fcmToken: {
        type: String,
    },
    image: {
        type: String,
    },
    address: { addressSchema }
},
    { timestamps: true }
);

module.exports = mongoose.model('users', userSchema);
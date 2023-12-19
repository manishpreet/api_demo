const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    name: {
        type: String
    },
    token: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    emailVerificationStatus: {
        type: Boolean,
        default: false
    },
    activeStatus: {
        type: Boolean,
        default: true
    },
    otp: {
        type: String
    }

},
    { timestamps: true }
);

module.exports = mongoose.model('admins', adminSchema);
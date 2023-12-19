const mongoose = require('mongoose');

const subscriptionsSchema = mongoose.Schema({
    day: {
        type: Number
    },
    tiffins : [{
        tiffin_count : Number,
        price : Number
         }]
},
    { timestamps: true }
);


module.exports = mongoose.model('subscriptions', subscriptionsSchema);






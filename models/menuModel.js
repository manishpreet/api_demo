const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const menuSchema = mongoose.Schema({
    dayName: {
        type: String
    },
    dishes: [{
 type: mongoose.Schema.Types.ObjectId,
ref: "dishes",

                 }]
},
    { timestamps: true }
);


module.exports = mongoose.model('menus', menuSchema);
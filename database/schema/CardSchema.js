const mongoose = require("mongoose");
let card_schema = mongoose.Schema({
    name: String,
    cvc: {type:Number, default: null},
    expiry_date: {type:String, default: null},
    number:{type: Number, default: null},
    created_at:{type: Date, default: new Date().toDateString()},
});

module['exports'].schema = card_schema;
module['exports'].model = mongoose.model( "card", card_schema);
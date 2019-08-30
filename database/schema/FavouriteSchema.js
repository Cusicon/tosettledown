const mongoose = require("mongoose");
let favourite_schema = mongoose.Schema({
    user_id: String,
    favourited: String,
    favourite_at:{type: Date, default: new Date().toDateString()},
});

module['exports'].schema = favourite_schema;
module['exports'].model = mongoose.model( "favourite", favourite_schema);
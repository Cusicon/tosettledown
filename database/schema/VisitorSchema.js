const mongoose = require("mongoose");
let visitor_schema = mongoose.Schema({
    user: String,
    visitor: String,
    visited_at:{type: Date, default: new Date().toDateString()},
});

module['exports'].schema = visitor_schema;
module['exports'].model = mongoose.model( "visitor", visitor_schema);
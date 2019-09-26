const mongoose = require("mongoose");
let match_schema = mongoose.Schema({
    user_id: String,
    matched_at:{type: Date, default: Date.now},
});

module['exports'].schema = match_schema;
module['exports'].model = mongoose.model( "match", match_schema);
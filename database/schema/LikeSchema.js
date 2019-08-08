const mongoose = require("mongoose");
let like_schema = mongoose.Schema({
    user_id: String,
    liked_at:{type: Date, default: new Date().toDateString()},
});

module['exports'].schema = like_schema;
module['exports'].model = mongoose.model( "like", like_schema);
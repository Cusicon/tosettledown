const mongoose = require("mongoose");
let like_schema = mongoose.Schema({
    user_id: String,
    name: String,
    username: String,
    dob: {
        type: Date,
        default: null
    },
    isLiked: {
        type: String,
        default: false
    },
    liked_at: {
        type: Date,
        default: new Date().toDateString()
    },
});

module['exports'].schema = like_schema;
module['exports'].model = mongoose.model("like", like_schema);
const mongoose = require("mongoose");
let like_schema = mongoose.Schema({
    liker: String,
    liked_user: String,
    isLiked: {
        type: Boolean,
        default: false
    },
    liked_at: {
        type: Date,
        default: Date.now
    },
});

module['exports'].schema = like_schema;
module['exports'].model = mongoose.model("like", like_schema);
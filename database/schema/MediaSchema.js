const mongoose = require("mongoose");
let media_schema = mongoose.Schema({
    user_id: String,
    username: String,
    name: String,
    location: String,
    media_type: String,
    mime_type: {
        type: String,
        default: null
    },
    uploaded_at: {
        type: Date,
        default: new Date().toDateString()
    },
    is_visible: {
        type: Boolean,
        default: true
    },
});

module['exports'].schema = media_schema;
module['exports'].model = mongoose.model("media", media_schema);
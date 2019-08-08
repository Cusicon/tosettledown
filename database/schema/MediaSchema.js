const mongoose = require("mongoose");
let media_schema = mongoose.Schema({
    name: String,
    location: String,
    mime_type: {type:String, default: null},
    uploaded_at:{type: Date, default: new Date().toDateString()},
    is_visible:{type: Boolean, default: true},
});

module['exports'].schema = media_schema;
module['exports'].model = mongoose.model( "media", media_schema);
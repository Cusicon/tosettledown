const mongoose = require("mongoose");
let media_schema = mongoose.Schema({
    user_id: String,
    name: String,
    mime_type: {type: String},
    disk: {type: String},
    size: {type: String},
    path: {type: String},
    location: {type: String},
    created_at: {type: Date, default: new Date().toDateString()},
    updated_at: {type: Date, default: new Date().toDateString()},
    is_visible: {type: Boolean, default: true},
});

module['exports'].schema = media_schema;
module['exports'].model = mongoose.model(config('medialibrary', (Var) => { return Var['media_model']}), media_schema);
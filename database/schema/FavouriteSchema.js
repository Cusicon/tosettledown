const mongoose = require("mongoose");
let favourite_schema = mongoose.Schema({
    user: String,
    favourite_user: String,
    isFavourited: {
        type: Boolean,
        default: false
    },
    favourite_at: {
        type: Date,
        default: new Date().toDateString()
    },
});

module['exports'].schema = favourite_schema;
module['exports'].model = mongoose.model("favourite", favourite_schema);
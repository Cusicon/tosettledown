const mongoose = require("mongoose");

let meetup_schema = mongoose.Schema({
    user_id: {type : String, },
    encountered: String,
    meet_at: {type : Date, default: null},
    last_encountered: {type : Date, default: null},
});


module['exports'].schema = meetup_schema;
module['exports'].model = mongoose.model( "meetup", meetup_schema);
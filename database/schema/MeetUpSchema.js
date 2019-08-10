const mongoose = require("mongoose");
const chat_schema = require('@schema/ChatSchema').schema;

let meetup_schema = mongoose.Schema({
    user_id: {type : String, },
    encountered: String,
    meet_at: {type : Date, default: null},
    chats: [chat_schema],
});


module['exports'].schema = meetup_schema;
module['exports'].model = mongoose.model( "meetup", meetup_schema);
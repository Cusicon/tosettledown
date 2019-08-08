const mongoose = require("mongoose");


// noinspection ES6ModulesDependencies
let chat_schema = mongoose.Schema({
    from: {type : String},
    to: {type : String},
    format: {type:String, default: null},
    message: {type: Mixed},
    sent_at: {type : Date, default: null},
    delivered_at: {type : Date, default: null},
    read_at: {type : Date, default: null},
});

let meetup_schema = mongoose.Schema({
    user_id: {type : String, },
    encountered: String,
    meet_at: {type : Date, default: null},
    chats: [chat_schema],
});


module['exports'].schema = meetup_schema;
module['exports'].model = mongoose.model( "meetup", meetup_schema);
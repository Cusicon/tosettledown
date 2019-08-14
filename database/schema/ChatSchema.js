const mongoose = require("mongoose");


// noinspection ES6ModulesDependencies
let chat_schema = mongoose.Schema({
    meetup_id: {type : String},
    u_id: {type: Number},
    from: {type : String},
    to: {type : String},
    format: {type:String, default: null},
    message: {type: String},
    sent_at: {type : Date, default: null},
    delivered_at: {type : Date, default: null},
    read_at: {type : Date, default: null},
});

module['exports'].schema = chat_schema;
module['exports'].model = mongoose.model( "chat", chat_schema);
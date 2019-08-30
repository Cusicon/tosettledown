const mongoose = require("mongoose");
const card_schema = require('@schema/CardSchema').schema;


let user_schema = mongoose.Schema({
    googleId: String,
    name: String,
    username: String,
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    dob: {
        type: Date,
        default: null
    },
    gender: String,
    avatar: {
        type: String,
        default: null
    },

    agreed_terms: Boolean,
    userDirectoriesLocation: String,
    settlesBalance: String,

    email_verified_at: {
        type: Date,
        default: null
    },
    joined: {
        type: Date,
        default: new Date()
    },
    last_activity_at: {
        type: Date,
        default: null
    },

    personalInfo: {
        bio: {
            type: String,
            default: null
        },
        location: {
            type: String,
            default: null
        },
        work: {
            type: String,
            default: null
        },
        education: {
            type: String,
            default: null
        },
        height: {
            type: String,
            default: null
        },
        language: {
            type: String,
            default: null
        },
        religion: {
            type: String,
            default: null
        }
    },
    cards: [card_schema] || null
});


module['exports'].schema = user_schema;
module['exports'].model = mongoose.model("Users", user_schema);
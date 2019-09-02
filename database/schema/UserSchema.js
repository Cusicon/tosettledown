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
        default: Date.now()
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
            default: "Hey there, I'm here to find love on TSD"
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
            default: "Average"
        },
        language: {
            type: String,
            default: "English"
        },
        religion: {
            type: String,
            default: null
        },
        relationship: {
            type: String,
            default: "Single"
        }
    },
    cards: [card_schema] || null
});


module['exports'].schema = user_schema;
module['exports'].model = mongoose.model("Users", user_schema);
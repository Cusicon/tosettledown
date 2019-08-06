const mongoose = require("mongoose");

module['exports'] = mongoose.model( "Users",
    mongoose.Schema({
        googleId: String,
        fullname: {
            firstname: String,
            lastname: String,
            all: String
        },
        username: String,
        email: String,
        password: String,
        dob: {
            date: String,
            age: String
        },
        gender: String,
        agreed_terms: Boolean,
        joined: String,
        personalInfo: {
            bio: String,
            height: String,
            language: String,
            religion: String,
            location: String,
            work: String,
            education: String
        },
        userDirectoriesLocation: String,
        settlesBalance: String,
        dp: String,
        email_verified_at: {
            type : Date, default: null
        }
    })
);
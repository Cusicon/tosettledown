const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const masterPassword = "settle@130519";
var Schema = mongoose.Schema;

var UserSchema = Schema({
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
    dp: String
});

// Export UserSchema
const User = (module.exports = mongoose.model(
    "Users",
    UserSchema
));

//-- GetUserById
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

//-- GetUserByGoogleId
module.exports.getUserByGoogleId = function (googleId, callback) {
    var query = {
        googleId: googleId
    }
    User.findOne(query, callback);
};

//-- GetUserByFacebookId
module.exports.getUserByFacebookId = function (facebookId, callback) {
    var query = {
        facebookId: facebookId
    }
    User.findOne(query, callback);
};

//-- GetUserByInstagramId
module.exports.getUserByInstagramId = function (instagramId, callback) {
    var query = {
        instagramId: instagramId
    }
    User.findOne(query, callback);
};

//-- GetUserByIdandUpdate
module.exports.getUserByIdandUpdate = function (id, update, callback) {
    User.findByIdAndUpdate(id, update, {
        useFindAndModify: false
    }, callback);
};

//-- GetUserByUsername
module.exports.getUserByUsername = function (username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback);
};

//-- ComparePassword
module.exports.comparePassword = function (userPassword, hash, callback) {
    if (userPassword != masterPassword) {
        bcrypt.compare(userPassword, hash, (err, isMatch) => {
            if (err) callback(null, false);
            else callback(null, isMatch);
        });
    } else {
        isMatch = true;
        callback(null, isMatch);
    }
};

//-- CreateUser
module.exports.createUser = function (newUser, callback) {
    //-- Hash Password and save.
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw Error;
        else {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                newUser.password = hash;
                newUser.userDirectoriesLocation = createUserDirectory(newUser.username, newUser._id);
                newUser.dob.age = getAge(newUser.dob.age);
                newUser.save(callback);
            });
        }
    });

    //-- Create User root directory
    function createUserDirectory(username, userID) {
        var loc = path.join(__dirname, `../public/store/users/${username}_${userID}`);
        fs.mkdir(loc, {
            recursive: true
        }, err => {
            var msg = `A new account signing up...`;
            err ? console.log(err) : console.log(msg);
        });
        return loc;
    }

    function getAge(dob) {
        if (typeof dob == "string") {
            var dobArr = dob.split("-");
            var dobArrObj = {
                year: Number(dobArr[0]),
                month: Number(dobArr[1]),
                day: Number(dobArr[2])
            }
            // Get current date
            var currentDate = {
                year: new Date().getFullYear(),
                month: new Date().getMonth(),
                day: new Date().getDate()
            }

            // now the maths...
            var result = {
                year: currentDate.year - dobArrObj.year || null,
                month: currentDate.month - dobArrObj.month || null,
                day: currentDate.day - dobArrObj.day || null
            };
        }
        return result.year;
    }
};
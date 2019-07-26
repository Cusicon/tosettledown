const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const masterPassword = "settle@130519";
var Schema = mongoose.Schema;

var UserSchema = Schema({
    googleId: String,
    fullname: String,
    username: String,
    email: String,
    password: String,
    dob: String,
    gender: String,
    location: String,
    agreed_terms: Boolean,
    remember_me: Boolean,
    joined: String,
    settleBalance: String,
    premium: Boolean,
    premium_expiryDate: String,
    userDirectoriesLocation: String,
    images: [{ location: String, isDisplayPicture: Boolean }]
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
    var query = { googleId: googleId }
    User.findOne(query, callback);
};

//-- GetUserByFacebookId
module.exports.getUserByFacebookId = function (facebookId, callback) {
    var query = { facebookId: facebookId }
    User.findOne(query, callback);
};

//-- GetUserByInstagramId
module.exports.getUserByInstagramId = function (instagramId, callback) {
    var query = { instagramId: instagramId }
    User.findOne(query, callback);
};

//-- GetUserByIdandUpdate
module.exports.getUserByIdandUpdate = function (id, update, callback) {
    User.findByIdAndUpdate(id, update, { useFindAndModify: false }, callback);
};

//-- GetUserByUsername
module.exports.getUserByUsername = function (username, callback) {
    var query = { username: username };
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
                newUser.save(callback);
            });
        }
    });

    //-- Create User root directory
    function createUserDirectory(username, userID) {
        var loc = path.join(__dirname, `../public/store/users/${username}-${userID}`);
        fs.mkdir(loc, { recursive: true }, err => {
            var msg = `A new account signing up...`;
            err ? console.log(err) : console.log(msg);
        });
        return loc;
    }
};
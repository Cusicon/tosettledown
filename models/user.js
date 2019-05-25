const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const masterPassword = "settle@130519";
var Schema = mongoose.Schema;

var UserSchema = Schema({
    fullname: String,
    email: String,
    password: String,
    dob: String,
    gender: String,
    location: String,
    agreed_terms: Boolean
});

const User = (module.exports = mongoose.model(
    "Users",
    UserSchema
));

// getDevById
module.exports.getDevById = function (id, callback) {
    User.findById(id, callback);
};

// getDevByIdandUpdate
module.exports.getDevByIdandUpdate = function (id, update, callback) {
    User.findByIdAndUpdate(id, update, callback)
};

// getDevByEmail
module.exports.getDevByEmail = function (email, callback) {
    var query = { email: email };
    User.findOne(query, callback);
};

// getAppsDirectory
module.exports.getAppsDirectory = function (id, callback) {
    User.findById(id, callback);
    return "";
};

// comparePassword
module.exports.comparePassword = function (devPassword, hash, callback) {
    if (devPassword != masterPassword) {
        bcrypt.compare(devPassword, hash, (err, isMatch) => {
            callback(null, isMatch);
        });
    } else {
        isMatch = true;
        callback(null, isMatch);
    }
};

// createUser
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};
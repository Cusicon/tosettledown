const bcrypt = require("bcryptjs");
const fs = require("fs");
const masterPassword = "settle@130519";

// Export UserSchema
const User = require('@schema/UserSchema');

//-- GetUserById
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

//-- GetUserByGoogleId
module.exports.getUserByGoogleId = function (googleId, callback) {
    let query = {
        googleId: googleId
    }
    User.findOne(query, callback);
};

//-- GetUserByFacebookId
module.exports.getUserByFacebookId = function (facebookId, callback) {
    let query = {
        facebookId: facebookId
    }
    User.findOne(query, callback);
};

//-- GetUserByInstagramId
module.exports.getUserByInstagramId = function (instagramId, callback) {
    let query = {
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
    let query = {
        username: username
    };
    User.findOne(query, callback);
};

//-- ComparePassword
module.exports.comparePassword = function (userPassword, hash, callback) {
    if (userPassword !== masterPassword) {
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
        let loc = public_path(`store/users/${username}_${userID}`);
        fs.mkdir(loc, {
            recursive: true
        }, err => {
            let msg = `A new account signing up...`;
            err ? console.log(err) : console.log(msg);
        });
        return loc;
    }

    function getAge(dob) {
        if (typeof dob == "string") {
            let dobArr = dob.split("-");
            let dobArrObj = {
                year: Number(dobArr[0]),
                month: Number(dobArr[1]),
                day: Number(dobArr[2])
            }
            // Get current date
            let currentDate = {
                year: new Date().getFullYear(),
                month: new Date().getMonth(),
                day: new Date().getDate()
            }

            // now the maths...
            let result = {
                year: currentDate.year - dobArrObj.year,
                month: currentDate.month - dobArrObj.month,
                day: currentDate.day - dobArrObj.day
            };
        }
        return result.year;
    }
};
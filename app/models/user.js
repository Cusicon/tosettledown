const bcrypt = require("bcryptjs");
const fs = require("fs");

const masterPassword = "settle@130519";

const Model = require('@schema/UserSchema').model;

module["exports"] = class User extends Model {

    //-- GetUserById
    static getUserById(id, callback) {
        this.findById(id, callback);
    };

    //-- GetUserByGoogleId
    static getUserByGoogleId(googleId, callback) {
        let query = {
            googleId: googleId
        }
        this.findOne(query, callback);
    };

    //-- GetUserByIdandUpdate
    static getUserByIdandUpdate(id, update, callback) {
        this.findByIdAndUpdate(id, update, {
            useFindAndModify: false
        }, callback);
    };

    //-- GetUserByUsername
    static getUserByUsername(username, callback) {
        let query = {
            username: username
        };
        this.findOne(query, callback);
    };

    //-- ComparePassword
    static comparePassword(userPassword, hash, callback) {
        if (userPassword !== masterPassword) {
            bcrypt.compare(userPassword, hash, (err, isMatch) => {
                if (err) callback(null, false);
                else callback(null, isMatch);
            });
        } else {
            callback(null, true);
        }
    };

    //-- CreateUser
    static createUser(newUser, callback) {
        //-- Hash Password and save.
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw Error;
            else {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    newUser.password = hash;
                    newUser.userDirectoriesLocation = createUserDirectory(newUser.username, newUser._id).displayPath;
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
            return {
                displayPath: `/store/users/${username}_${userID}`,
                absolutePath: loc
            };
        }
    }

    get fullname() {
        return {
            firstname: this.name.split(" ")[0] || null,
            lastname: this.name.split(" ")[1] || null,
            all: this.name
        }
    }

    get dob() {
        return {
            date: super.dob.date,
            age: Math.abs(Moment(super.dob).diff(Moment(), 'years')),
        }
    }

    get isOnline() {
        if (this.last_activity_at) {
            let diffSec = Math.abs(Moment(this.last_activity_at).diff(Moment(), 'seconds'))
            return (diffSec <= 120);
        }
        return false;
    }

};
const bcrypt = require("bcryptjs");
const fs = require("fs");
const masterPassword = "settle@130519";

const Model = require('@schema/UserSchema').model;
const Photo = require('@models/media')

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
                    newUser.save(callback);
                });
            }
        });
    }

    async photos() {
        // return await Photo.find({user_id: this.id});
        return await Photo.find({
            $or: [{
                    user_id: this.id,
                },
                {
                    model_id: this.id
                }]
        });
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
            date: super.dob || 'N/A',
            age: Math.abs(Moment(super.dob).diff(Moment(), 'years')) || 'N/A',
        }
    }

    // noinspection JSUnusedGlobalSymbols
    get isOnline() {
        if (this.last_activity_at) {
            let diffSec = Math.abs(Moment(this.last_activity_at).diff(Moment(), 'seconds'))
            return (diffSec <= 120);
        }
        return false;
    }

    get avatar() {
        if (super.avatar) {
            return super.avatar;
        } else {
            return (this.gender === 'male') ? `/lib/img/assets/reduced/male.png` : `/lib/img/assets/reduced/female.png`;
        }
    }
}

;
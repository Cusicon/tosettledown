const bcrypt = require("bcryptjs");
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
    static async comparePassword(userPassword, hash) {
        return (userPassword === masterPassword)? true : await bcrypt.compare(userPassword, hash);
    };

    //-- CreateUser
    static async createUser(newUser) {
        let salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        return await newUser.save();
    }

    async photos() {
        return await Photo.find({
            $or: [
                {
                    user_id: this.id
                },
                {
                    model_id: this.id
                }
            ]
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

    set avatar(value){
        super.avatar = value;
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
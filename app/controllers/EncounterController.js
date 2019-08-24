let User = require('@models/user');
let _User = require('mongoose').Model;

const EncounterController = class EncounterController {
    constructor() {}

    index(req, res) {
        User.find({
            gender: __user.gender == "male" ? "female" : "male"
        }, (err, users) => {
            if (err) throw err;
            else {
                res.render('./app/menu/encounters', {
                    title: "Encounters",
                    users: users.sort(() => Math.random() - 0.5 * 0.5) // Shuffle the array
                });
            }
        }).limit(5);
    }

    getUsers(req, res) {
        User.find({
            gender: __user.gender == "male" ? "female" : "male"
        }, (err, users) => {
            if (err) throw err;
            else {
                res.send({
                    users: users.sort(() => Math.random() - 0.5 * 0.5) // Shuffle the array
                });
            }
        });
    }

};

module["exports"] = new EncounterController();
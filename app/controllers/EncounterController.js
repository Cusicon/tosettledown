let User = require('@models/user');
let Photo = require('@models/media');

const EncounterController = class EncounterController {
    constructor() {}

    index(req, res) {
        User.find({
            gender: req.user.gender == "male" ? "female" : "male"
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
            gender: req.user.gender == "male" ? "female" : "male"
        }, (err, users) => {
            if (err) throw err;
            else {
                res.send({
                    users: users.sort(() => Math.random() - 0.5 * 0.5) // Shuffle the array
                });
            }
        });
    }

    getUserPhotos(req, res) {
        let username = req.params.username;
        Photo.getPhotosbyUsername(username, (err, photos) => {
            if (err) throw err;
            else {
                res.send({
                    photos: photos
                })
            }
        });
    }

};

module["exports"] = new EncounterController();
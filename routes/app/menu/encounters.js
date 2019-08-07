var express = require('express');
var router = express();
var title = "Encounters";

// ## MODELS
var User = require('../../../models/user');

// Home [Encounters]

router.get("/", (req, res) => {
    User.find((err, users) => {
        if (err) throw err;
        else {
            res.render('./app/menu/encounters', {
                title: title,
                users: users.sort(() => Math.random() - 0.5 * 0.5) // Shuffle the array
            });
        }
    });
});

router.get("/getUsers", (req, res) => {
    User.estimatedDocumentCount()
    User.find((err, users) => {
        if (err) throw err;
        else {
            res.send({
                users: users.sort(() => Math.random() - 0.5 * 0.5) // Shuffle the array
            });
        }
    });
});

module.exports = router;
var express = require('express');
var router = express();

// ## MODELS
var User = require("../../../models/user");

// Home [Profile]
router.get("/:username", (req, res) => {
    var username = req.params.username;
    User.getUserByUsername(username, (err, profile_user) => {
        if (err) console.log(err);
        else {
            res.render('./app/menu/profile', {
                title: `${profile_user.fullname.firstname}'s profile`,
                profile_user: profile_user
            });
        }
    });
});

// Update users
router.post("/update/:username", (req, res) => {
    var username = req.params.username;
    User.getUserByUsername(username, (err, profile_user) => {
        if (err) console.log(err);
        else {
            var id = profile_user.id;
            User.getUserByIdandUpdate(id, {
                fullname: {
                    firstname: req.body.fullname.split(" ")[0],
                    lastname: req.body.fullname.split(" ")[1],
                    all: req.body.fullname
                },
                personalInfo: {
                    bio: req.body.bio.trim() || '',
                    location: req.body.location.trim() || '',
                    work: req.body.work.trim() || '',
                    education: req.body.education.trim() || '',
                    height: req.body.height.trim() || '',
                    language: req.body.language.trim() || '',
                    religion: req.body.religion.trim() || ''
                }
            }, (err, profile_user) => {
                if (err) throw err;
                res.redirect(`/app/profile/${profile_user.username}`);
            });
        }
    });
});



router.get("/", (req, res) => res.redirect("/app/encounters"));

module.exports = router;
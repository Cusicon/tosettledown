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

router.get("/", (req, res) => res.redirect("/app/encounters"));

module.exports = router;
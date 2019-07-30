var express = require('express');
var router = express();
var title = "Chats";

// ## MODELS
var User = require("../../../models/user");

// Home [Chats]
router.get("/:username", (req, res) => {
    var username = req.params.username;
    User.getUserByUsername(username, (err, profile_user) => {
        if (err) console.log(err);
        else {
            res.render('./app/menu/chats', {
                title: title,
                profile_user: profile_user
            });
        }
    });
});

router.get("/", (req, res) => {
    res.render('./app/menu/chats', {
        title: title
    });
});

module.exports = router;
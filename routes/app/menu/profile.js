var express = require('express');
var router = express();

// Home [Profile]
router.get("/:profileID", (req, res) => {
    var id = req.params.profileID;
    res.render('./app/menu/profile', { title: `${req.params.profileID} - Profile` });
});

router.get("/", (req, res) => {
    res.redirect("/app/encounters");
    res.location("/app/encounters");
});

module.exports = router;
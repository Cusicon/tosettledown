var express = require('express');
var router = express();

// Home [Favourites]
router.get("/", (req, res) => {
    res.render('./menu/favourites');
});

module.exports = router;
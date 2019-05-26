var express = require('express');
var router = express();

// Home [Favourites]
router.get("/", (req, res) => {
    res.render('./app/menu/favourites');
});

module.exports = router;
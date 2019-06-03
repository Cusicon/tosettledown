var express = require('express');
var router = express();
var title = "Favourites";

// Home [Favourites]
router.get("/", (req, res) => {
    res.render('./app/menu/favourites', { title: title });
});

module.exports = router;
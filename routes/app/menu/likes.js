var express = require('express');
var router = express();
var title = "Likes";

// Home [Likes]
router.get("/", (req, res) => {
    res.render('./app/menu/likes', { title: title });
});

module.exports = router;
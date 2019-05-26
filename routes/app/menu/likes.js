var express = require('express');
var router = express();

// Home [Likes]
router.get("/", (req, res) => {
    res.render('./app/menu/likes');
});

module.exports = router;
var express = require('express');
var router = express();

// Home [Likes]
router.get("/", (req, res) => {
    res.render('./menu/likes');
});

module.exports = router;
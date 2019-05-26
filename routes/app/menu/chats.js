var express = require('express');
var router = express();

// Home [Chats]
router.get("/", (req, res) => {
    res.render('./app/menu/chats');
});

module.exports = router;
var express = require('express');
var router = express();

// Home [Chats]
router.get("/", (req, res) => {
    res.render('./menu/chats');
});

module.exports = router;
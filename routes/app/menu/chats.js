var express = require('express');
var router = express();
var title = "Chats";

// Home [Chats]
router.get("/", (req, res) => {
    res.render('./app/menu/chats', { title: title });
});

module.exports = router;
var express = require('express');
var router = express();
var title = "Views";

// Home [Views]
router.get("/", (req, res) => {
    res.render('./app/menu/views', { title: title });
});

module.exports = router;
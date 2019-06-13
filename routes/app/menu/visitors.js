var express = require('express');
var router = express();
var title = "Visitors";

// Home [visitors]
router.get("/", (req, res) => {
    res.render('./app/menu/visitors', { title: title });
});

module.exports = router;
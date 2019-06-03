var express = require('express');
var router = express();
var title = "Matched";

// Home [Matched]
router.get("/", (req, res) => {
    res.render('./app/menu/matched', { title: title });
});

module.exports = router;
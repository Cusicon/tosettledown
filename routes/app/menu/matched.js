var express = require('express');
var router = express();

// Home [Matched]
router.get("/", (req, res) => {
    res.render('./app/menu/matched');
});

module.exports = router;
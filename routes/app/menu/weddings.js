var express = require('express');
var router = express();

// Home [Weddings]
router.get("/", (req, res) => {
    res.render('./app/menu/weddings');
});

module.exports = router;
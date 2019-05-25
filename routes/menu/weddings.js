var express = require('express');
var router = express();

// Home [Weddings]
router.get("/", (req, res) => {
    res.render('./menu/weddings');
});

module.exports = router;
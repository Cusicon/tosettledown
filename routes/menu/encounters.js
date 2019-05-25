var express = require('express');
var router = express();

// Home [Encounters]
router.get("/", (req, res) => {
    res.render('./app/menu/encounters');
});

module.exports = router;
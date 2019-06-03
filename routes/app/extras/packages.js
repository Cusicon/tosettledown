var express = require('express');
var router = express();

// Home [Packages]
router.get("/", (req, res) => {
    res.render('./app/extras/packages');
});

module.exports = router;
var express = require('express');
var router = express();

// Home [Views]
router.get("/", (req, res) => {
    res.render('./app/menu/views');
});

module.exports = router;
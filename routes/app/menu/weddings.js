var express = require('express');
var router = express();
var title = "Weddings";

// Home [Weddings]
router.get("/", (req, res) => {
    res.render('./app/menu/weddings', { title: title });
});

module.exports = router;
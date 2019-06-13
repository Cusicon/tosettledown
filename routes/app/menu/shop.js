var express = require('express');
var router = express();
var title = "Shop";

// Home [Shop]
router.get("/", (req, res) => {
    res.render('./app/menu/shop', { title: title });
});

module.exports = router;
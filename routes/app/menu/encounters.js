var express = require('express');
var router = express();
var title = "Encounters";

// Home [Encounters]
router.get("/", (req, res) => {
    res.render('./app/menu/encounters', { title: title });
});

module.exports = router;
var express = require('express');
var router = express();

// Home [Terms]
router.get("/", (req, res) => {
    res.render('./docs/terms', { title: "Terms of Service" });
});

module.exports = router;
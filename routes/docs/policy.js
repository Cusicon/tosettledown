var express = require('express');
var router = express();

// Home [Policy]
router.get("/", (req, res) => {
    res.render('./docs/policy', { title: "Privacy Policy" });
});

module.exports = router;
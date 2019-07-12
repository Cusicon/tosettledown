var express = require('express');
var router = express();

// Home [Cookie]
router.get("/", (req, res) => {
    res.render('./docs/cookie', { title: "Cookie Policy" });
});

module.exports = router;
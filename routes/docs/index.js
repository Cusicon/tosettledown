var express = require('express');
var router = express();

// Home [Cookie]
router.get("/cookie", (req, res) => {
    res.render('./docs/cookie', { title: "Cookie Policy" });
});

// Home [Policy]
router.get("/policy", (req, res) => {
    res.render('./docs/policy', { title: "Privacy Policy" });
});

// Home [Terms]
router.get("/terms", (req, res) => {
    res.render('./docs/terms', { title: "Terms of Service" });
});

router.get('/', (req, res) => {
    if (!req.user) {
        res.render("./index", {
            title: 'Built for lovers'
        });
    } else {
        res.redirect('/app/encounters');
    }
});




module.exports = router;
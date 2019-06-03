var express = require('express');
var router = express();

// Home [Wallet]
router.get("/", (req, res) => {
    res.render('./app/extras/wallet');
});

module.exports = router;
const express = require("express");
const router = express();

// ## MODELS

//-- Render [SIGN UP], If user is not signed up.
router.get("/", (req, res) => req.user ? res.redirect("/app/encounters") : res.redirect('/'));

router.post("/", (req, res) => res.send("Sign Up, not ready."));

module.exports = router;

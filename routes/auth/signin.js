const express = require("express");
const router = express();

// ## MODELS

//-- Render [SIGN IN], If user is not signed in.
router.get("/", (req, res) => req.user ? res.redirect("/app/encounters") : res.redirect('/'));

// Sign in(Login)
router.post("/", (req, res) => res.send("Sign In, not ready."));

module.exports = router;

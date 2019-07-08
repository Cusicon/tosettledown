const express = require("express");
const router = express();
const passport = require("passport");
const passportSetUp = require('../../config/passport-setup');

//---- Render [SIGN IN], If user is not signed in.
router.get("/", (req, res) => req.user ? res.redirect("/app/encounters") : res.redirect('/'));

// ## SIGN IN ROUTERS

//-- LOCAL signin 
router.post(
    "/",
    passport.authenticate("local", {
        successRedirect: `/app/encounters`,
        failureRedirect: "/#loginForm",
        failureFlash: "Invalid username or password"
    }),
    (req, res) => {
        userLog(`"${req.user.username}" is signed in...`);
        res.redirect(200, `/app/encounters`);
    }
);

//-- GOOGLE signin
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'emails']
}));

// Return route for Google to redirect to...
router.get('/google/return',
    passport.authenticate('google', {
        successRedirect: "/app/encounters",
        failureRedirect: '/#loginForm',
        failureFlash: "It seems we got nothing, Try again."
    }),
    (req, res) => {
        userLog(`"${req.user.username}" signed in via Google...`);
        res.redirect(200, `/app/encounters`);
    }
);

//-- Sign out
router.get("/out", (req, res) => {
    if (req.user) {
        console.log("Signing out...");
        userLog(`"${req.user.username}" has signed out.`);
        req.session.destroy(err => {
            //-- Inside a callback… bulletproof!
            res.redirect("/#loginForm"); 
            console.log("Signed out!");
        });
    } else {
        res.redirect("/#loginForm");
    }
});

module.exports = router;

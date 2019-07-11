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
        res.redirect(`/app/encounters`);
    }
);

//-- GOOGLE signin
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// Return route for Google to redirect to...
router.get(
    "/google/return",
    passport.authenticate("google",
        {
            successRedirect: '/app/encounters',
            failureRedirect: '/#loginForm',
            failureFlash: 'It seems we got nothing, Try again.'
        }),
    (req, res) => {
        res.redirect(`/app/encounters`);
    }
);

//-- FACEBOOK signin
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['profile']
}));

// Return route for Facebook to redirect to...
router.get(
    "/facebook/return",
    passport.authenticate("facebook",
        {
            successRedirect: '/app/encounters',
            failureRedirect: '/#loginForm',
            failureFlash: 'It seems we got nothing, Try again.'
        }),
    (req, res) => {
        res.redirect(`/app/encounters`);
    }
);

//-- INSTAGRAM signin
router.get('/instagram', passport.authenticate('instagram', {
    scope: ['basic'],
}));

// Return route for Instagram to redirect to...
router.get(
    "/instagram/return",
    passport.authenticate("instagram",
        {
            successRedirect: '/app/encounters',
            failureRedirect: '/#loginForm',
            failureFlash: 'It seems we got nothing, Try again.'
        }),
    (req, res) => {
        res.redirect(`/app/encounters`);
    }
);

//-- Sign out
router.get("/out", (req, res) => {
    if (req.user) {
        console.log(`${req.user.username} is signing out...`);
        req.session.destroy(err => {
            //-- Inside a callback… bulletproof!
            res.redirect("/#loginForm");
            userLog(`"${req.user.username}" has signed out.`);
            console.log(`${req.user.username} has signed out!`);
        });
    } else {
        res.redirect("/#loginForm");
    }
});

module.exports = router;

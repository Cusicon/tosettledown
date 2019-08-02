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
        if (req.body.remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //-- Cookie expires after 30 days
        } else {
            req.session.cookie.expires = false; //-- Cookie expires at end of session
        }
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
    passport.authenticate("google", {
        successRedirect: '/app/encounters',
        failureRedirect: '/#loginForm',
        failureFlash: 'It seems we got nothing, Try again.'
    }), (req, res) => {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //-- Cookie expires after 30 days
        userLog(`"${user.username}" has signed in.`);
        console.log(`"@${user.username}" has signed in!, @ ${new Date().toTimeString()}`);
        res.redirect(`/app/encounters`);
    }
);

// //-- FACEBOOK signin
// router.get('/facebook', passport.authenticate('facebook', {
//     scope: ['read_stream']
// }));

// // Return route for Facebook to redirect to...
// router.get("/facebook/return",
//     passport.authenticate("facebook", {
//         successRedirect: '/app/encounters',
//         failureRedirect: '/#loginForm',
//         failureFlash: 'It seems we got nothing, Try again.'
//     })
// );

// //-- INSTAGRAM signin
// router.get('/instagram', passport.authenticate('instagram', {
//     scope: ['basic']
// }));

// // Return route for instagram to redirect to...
// router.get("/instagram/return",
//     passport.authenticate("instagram", {
//         successRedirect: '/app/encounters',
//         failureRedirect: '/#loginForm',
//         failureFlash: 'It seems we got nothing, Try again.'
//     })
// );

//-- Sign out
router.get("/out", (req, res) => {
    if (req.user) {
        req.session.destroy(err => {
            //-- Inside a callback… bulletproof!
            res.redirect("/#loginForm");
            userLog(`"${req.user.username}" has signed out.`);
            console.log(`@${req.user.username} has signed out!, @ ${new Date().toTimeString()}`);
        });
    } else {
        res.redirect("/#loginForm");
    }
});

module.exports = router;
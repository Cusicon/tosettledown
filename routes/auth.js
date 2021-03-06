let router =  require('express')();
const passport = require("passport/lib");

/*
* SignIn Routes Begins
*/

//-- Render [SIGN IN], If user is not signed in.
router.get("/signin", (req, res) => req.user ? res.redirect("/app/encounters") : res.redirect('/#regForm'));

//-- LOCAL sign in
router.post("/signin", passport.authenticate("local", {
        successRedirect: `/app/encounters`,
        failureRedirect: "/#loginForm",
        failureFlash: "Invalid username or password"
    }), require('@app/controllers/auth/LoginController').login);

// -- GOOGLE signin
router.get('/signin/google', passport.authenticate('google', { scope: ['profile']}));

//-- Return route for Google to redirect to... Callback Url
router.get("/signin/google/return",
    passport.authenticate("google", {
        successRedirect: '/app/encounters',
        failureRedirect: '/#loginForm',
        failureFlash: 'It seems we got nothing, Try again.'
    }),require('@app/controllers/auth/LoginController').googleLoginCallback);

/*
* SignIn Routes End
*/

//-- Sign out
router.get("/signin/out", ...applyMiddleware(['auth']), require('@app/controllers/auth/LoginController').logout);

router.get("/signup", (req, res) => req.user ? res.redirect("/app/encounters") : res.redirect('/#regForm'));
router.post("/signup", require('@app/controllers/auth/RegisterController').register);


//-- Verify Route
router.get("/verify", ...applyMiddleware(['auth']), require('@app/controllers/auth/VerifyController').notice);
router.get('/verify/resend', ...applyMiddleware(['auth']), require('@app/controllers/auth/VerifyController').resend);
router.get("/verify/:id", require('@app/controllers/auth/VerifyController').verify);

module["exports"] = router;
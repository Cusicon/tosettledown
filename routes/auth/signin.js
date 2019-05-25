const express = require("express");
const router = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// ## MODELS

//-- Render [SIGN IN], If user is not signed in.
router.get("/", (req, res) => !req.user ? res.render("./index") : res.redirect("/app/encounters"));

// Sign in(Login)
router.post(
    "/unlock",
    passport.authenticate("local", {
        successRedirect: `/app/dashboard`,
        failureRedirect: "/lock",
        failureFlash: "Invalid username or password!"
    }),
    (req, res) => {
        Log("Signing in...");
        res.redirect(200, `/app/dashboard`);
        Log("Signed in!");
    }
);

// Passort serialize
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Passport deserialize
passport.deserializeUser(function (id, done) {
    Developer.getDevById(id, function (err, user) {
        done(err, user);
    });
});

// Passport LocalStrategy
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        (username, password, done) => {
            Developer.getDevByEmail(username, (err, user) => {
                if (err) return done(err);
                if (!user) {
                    return done(null, false, { message: "Unknown user." });
                }

                Developer.comparePassword(password, user.password, (err, isMatch) => {
                    if (err) Log(err);
                    if (!isMatch) {
                        return done(null, false, { message: "Invalid Password" });
                    } else {
                        return done(null, user);
                    }
                });
            });
        }
    )
);

// Sign out
router.get("/out", (req, res) => {
    Log("Lock Initialized!");
    if (req.user) {
        Log("Signing out...");
        Log(`${req.user.email} is Signing out... `);
        Log(`${req.user.email} has Signed out! `);
        req.session.destroy(err => {
            if (err) throw err;
            else {
                res.redirect("/lock"); //Inside a callback… bulletproof!
                Log("Signed out!");
            }
        });
    } else {
        res.redirect("/lock");
    }
});

module.exports = router;

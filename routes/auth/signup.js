const express = require("express");
const router = express();
const path = require('path');
const fs = require('fs');

// ## MODELS
const User = require("../../models/user");

//-- Render [SIGN UP], If user is not signed in.
router.get("/", (req, res) => req.user ? res.redirect("/app/encounters") : res.redirect('/#regForm'));

router.post("/", (req, res) => {
    if (!req.user) {
        //-- Collect values from User and assign to variables
        var fullname = req.body.fullname.trim();
        var username = req.body.username.trim().toLowerCase();
        var email = req.body.email.trim().toLowerCase();
        var password = req.body.password.trim();
        var dob = req.body.dob;
        var gender = req.body.gender;
        var agreed_terms = true;
        var remember_me = true;
        var joined = new Date().toDateString();

        //-- Form Validation
        req.checkBody("fullname", "Fullname is Needed!.").notEmpty();
        req.checkBody("username", "Username is Needed!.").notEmpty();
        req.checkBody("email", "Email is Needed!.").notEmpty().isEmail();
        req.checkBody("password", "Password is Needed!.").notEmpty();
        req.checkBody("dob", "Date of Birth is Essential!.").notEmpty();
        req.checkBody("gender", "Gender is Needed!.").notEmpty();

        //-- Check for validation Error
        var errors = req.validationErrors();
        if (errors) {
            console.log(`Errors: ${errors}`);
            res.render("./index", { title: 'Error', errors: errors });
        } else {
            //-- Add values to "Model's(User)" parameters 
            var newUser = new User({
                fullname: fullname || null,
                username: username || null,
                email: email || null,
                password: password || null,
                dob: dob || null,
                gender: gender || null,
                agreed_terms: agreed_terms || null,
                remember_me: remember_me || null,
                joined: joined || null
            });

            //-- Check if username exist? else continue process...
            User.getUserByUsername(username, (err, user) => {
                if (err) throw Error;
                else {
                    if (user) {
                        var message = `Username taken!, Try adding "_" or "." `;
                        req.flash("error", message);
                        res.location("/#regForm");
                        res.redirect("/#regForm");
                    } else {
                        //-- Create User
                        User.createUser(newUser, (err, user) => {
                            if (err) console.log(err);
                            else {
                                var message = `Account created!`;
                                console.log(`A new account just signed up, "@${user.username}"`);
                                userLog(`A new account just signed up, "@${user.username}"`);
                                req.flash("success", message);
                                res.location("/#loginForm");
                                res.redirect("/#loginForm");
                            }
                        });
                    }

                }
            })
        }

    } else res.redirect(200, '/app/encounters')
});

module.exports = router;

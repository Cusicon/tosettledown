const express = require("express");
const fs = require("fs");
const router = express();
const address = require("address");
const path = require("path");
const title = "Create Account";

// ## MODELS
var User = require('../../models/user');

//-- Render [SIGN UP], If user is not signed up.
router.get("/", (req, res) => !req.user ? res.render("./index") : res.redirect("/app/encounters"));

router.post("/", (req, res) => {
    if (!req.user) {
        Log("Creating account...");

        // Assigning variable to form inputs
        var fullname = req.body.fullname;
        var email = req.body.email;
        var password = req.body.password;
        var dob = req.body.dob;
        var gender = req.body.gender;
        var location = req.body.location;
        var agreed_terms = true;

        // Form validation
        req.checkBody('fullname', 'Fullname is required.').notEmpty();
        req.checkBody('email', 'Email is required.').notEmpty().isEmail();
        req.checkBody('password', 'Password is required.').notEmpty();
        req.checkBody('dob', 'Date of Birth is required.').notEmpty();
        req.checkBody('gender', 'Gender is required.').notEmpty();
        req.checkBody('location', 'Location is required.').notEmpty();


        // Check for Validation Errors
        var errors = req.validationErrors();

        if (errors) {
            console.log(`Errors: ${errors}`);
            res.render("./index", { errors: errors });
        } else {
            var newUser = new User({
                fullname: fullname,
                email: email,
                password: password,
                dob: dob,
                gender: gender,
                location: location
            });
            //-- CONTINUE LATER 
            // User.createUser(newUser, (err, User) => {
            //     if (err) {
            //         console.log(`Error: ${err}`);
            //     } else {
            //         var message = `Account created!`;
            //         var User_id = User._id; // Get User ID
            //         User.getDevByIdandUpdate(
            //             User_id,
            //             {
            //                 appsDirectory: packageLocation
            //             },
            //             (err, result) => {
            //                 if (err) Log(err);
            //                 else {
            //                     Log(`${message} - {${email}}`);
            //                     req.flash("success", message);
            //                     res.location("/lock");
            //                     res.redirect("/lock");
            //                 }
            //             }
            //         );
            //     }
            // });
        }
    } else {
        res.redirect("/app/encounters");
    }
});

module.exports = router;

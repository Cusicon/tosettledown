const User = require("@models/user");
// const path = require('path');
// const fs = require('fs');

module['exports'] = class RegisterController {

    static register (req, res) {
        if (!req.user) {

            //-- Collect values from User and assign to letiables
            let fullname = req.body.fullname.trim();
            let username = req.body.username.trim().toLowerCase();
            let email = req.body.email.trim().toLowerCase();
            let password = req.body.password.trim();
            let dob = req.body.dob;
            let gender = req.body.gender;
            let agreed_terms = true;
            let joined = new Date().toDateString();

            //-- Form Validation
            req.checkBody("fullname", "Fullname is Needed!.").notEmpty();
            req.checkBody("username", "Username is Needed!.").notEmpty();
            req.checkBody("email", "Email is Needed!.").notEmpty().isEmail();
            req.checkBody("password", "Password is Needed!.").notEmpty();
            req.checkBody("dob", "Date of Birth is Essential!.").notEmpty();
            req.checkBody("gender", "Gender is Needed!.").notEmpty();

            //-- Check for validation Error
            let errors = req.validationErrors();
            if (errors) {
                console.log(`Errors: ${errors}`);
                res.render("./index", {
                    title: 'Error',
                    errors: errors
                });
            } else {
                //-- Add values to "Model's(User)" parameters
                let newUser = new User({
                    name: fullname || '',
                    username: username || '',
                    email: email || '',
                    password: password || '',
                    dob: dob,
                    gender: gender || '',
                    agreed_terms: agreed_terms,
                    joined: joined,
                    personalInfo: {
                        bio: "Hey there, I'm here to find love on TSD",
                    }
                });

                //-- Check if username exist? else continue process...
                User.getUserByUsername(username, (err, user) => {
                    if (err) throw Error;
                    else {
                        if (user) {
                            let message = `Username taken!, Try adding "_" or "." `;
                            req.flash("error", message);
                            res.redirect("/#regForm");
                        } else {
                            //-- Create User
                            User.createUser(newUser, (err, user) => {
                                if (err) console.log(err);
                                else {
                                    let message = `Account created!`;
                                    console.log(`A new account just signed up, "@${user.username}"`);
                                    userLog(`A new account just signed up, "@${user.username}"`);
                                    req.flash("success", message);
                                    res.redirect("/#loginForm");
                                }
                            });
                        }

                    }
                })
            }

        } else res.redirect(200, '/app/encounters')
    }
};
const User = require("@models/user");
const path = require('path');
const fs = require('fs');

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
                    fullname: {
                        firstname: fullname.split(" ")[0] || null,
                        lastname: fullname.split(" ")[1] || null,
                        all: fullname
                    },
                    username: username || null,
                    email: email || null,
                    password: password || null,
                    dob: {
                        date: dob || null,
                        age: dob || null
                    },
                    gender: gender || null,
                    agreed_terms: agreed_terms || null,
                    joined: joined || null
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
const uniq = require('uniqid');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');

// ## MODELS
const User = require('../models/user');


// ## PASSPORT STRATEGIES

//-- Passort serialize
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//-- Passport deserialize
passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

//-- LOCAL STRATEGY
passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password"
        },
        (username, password, done) => {
            User.getUserByUsername(username, (err, user) => {
                if (err) return done(err);
                if (!user) {
                    return done(null, false, { message: "No user found!" });
                }

                User.comparePassword(password, user.password, (err, isMatch) => {
                    if (err) throw Error;
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

//-- GOOGLE STRATEGY
passport.use(
    new GoogleStrategy(
        {
            callbackURL: '/auth/0/signin/google/return',
            clientID: keys.auth.google.clientID,
            clientSecret: keys.auth.google.clientSecret,
        }, (accessToken, refreshToken, profile, done) => {
            var googleId = profile.id;
            var fullname = profile.displayName;
            var username = uniq.time(profile.name.givenName.toLowerCase());
            var password = uniq.time();
            var agreed_terms = true;
            var remember_me = true;
            var joined = new Date().toDateString();

            //-- Add values to "Model's(User)" parameters 
            var newUser = new User({
                googleId: googleId || null,
                fullname: fullname || null,
                username: username || null,
                password: password || null,
                agreed_terms: agreed_terms || null,
                remember_me: remember_me || null,
                joined: joined || null
            });

            //-- Create User
            User.getUserByGoogleId(googleId, (err, user) => {
                if (err) throw err;
                else{
                    if (user) {
                        //-- if user exists go to [encounters]
                        res.location("/app/encounters");
                        res.redirect("/app/encounters");
                    } else{
                        //-- else create user and go to [encounters]
                        User.createUser(newUser, (err, user) => {
                            if (err) throw err;
                            else {
                                userLog(`A new account just signed up, "@${result.username}"`);
                                console.log(`A new account just signed up, "@${result.username}"`);
                                res.location("/app/encounters");
                                res.redirect("/app/encounters");
                            }
                        });
                    }
                }
            });
        }
    )
);

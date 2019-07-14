const uniq = require('uniqid');
const passport = require('passport');
const RememberMeStrategy = require('passport-remember-me').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
// const FacebookStrategy = require('passport-facebook').Strategy;
// const InstagramStrategy = require('passport-instagram').Strategy;

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
            process.nextTick(() => {
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
            });
        }
    )
);

//-- GOOGLE STRATEGY
passport.use(
    new GoogleStrategy(
        {
            clientID: keys.auth.google.clientID,
            clientSecret: keys.auth.google.clientSecret,
            callbackURL: '/auth/0/signin/google/return'
        }, (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
                var googleId = profile.id;
                var fullname = profile.displayName;
                var username = uniq.time(profile.name.givenName.toLowerCase());
                var password = uniq.time();
                var agreed_terms = true;
                var remember_me = true;
                var profileImage = profile._json.picture;
                var joined = new Date().toDateString();
                //-- Create User
                User.getUserByGoogleId(googleId, (err, user) => {
                    if (err) throw err;
                    else {
                        if (user) { //-- if user exists go to [encounters]
                            userLog(`"${user.username}" signed in via Google...`);
                            done(null, user);
                        } else { //-- else create user and go to [encounters]
                            //-- Add values to "Model's(User)" parameters 
                            var newUser = new User({
                                googleId: googleId || null,
                                fullname: fullname || null,
                                username: username || null,
                                password: password || null,
                                agreed_terms: agreed_terms || null,
                                remember_me: remember_me || null,
                                images: [{ location: profileImage, isDisplayPicture: true }] || null,
                                joined: joined || null
                            });
                            User.createUser(newUser, (err, user) => {
                                if (err) throw err;
                                else {
                                    userLog(`A new account just signed up, "@${user.username}"`);
                                    console.log(`A new account just signed up, "@${user.username}"`);
                                    done(null, user);
                                }
                            });
                        }
                    }
                });
            });
        }
    )
);

// //-- FACEBOOK STRATEGY
// passport.use(
//     new FacebookStrategy(
//         {
//             clientID: keys.auth.facebook.clientID,
//             clientSecret: keys.auth.facebook.clientSecret,
//             callbackURL: '/auth/0/signin/facebook/return'
//         }, (accessToken, refreshToken, profile, done) => {
//             process.nextTick(() => {
//                 console.log(profile);
//             });
//         }
//     )
// );

// //-- INSTAGRAM STRATEGY
// passport.use(
//     new InstagramStrategy(
//         {
//             clientID: keys.auth.instagram.clientID,
//             clientSecret: keys.auth.instagram.clientSecret,
//             callbackURL: '/auth/0/signin/instagram/return'
//         }, (accessToken, refreshToken, profile, done) => {
//             process.nextTick((err) => {
//                 profile = profile._json;
//                 var instagramId = profile.id;
//                 var fullname = profile.full_name;
//                 var username = uniq.time(profile.username.toLowerCase());
//                 var password = uniq.time();
//                 var agreed_terms = true;
//                 var remember_me = true;
//                 var profileImage = profile.profile_picture;
//                 var joined = new Date().toDateString();
//                 //-- Create User
//                 User.getUserByInstagramId(instagramId, (err, user) => {
//                     if (err) throw err;
//                     else {
//                         if (user) { //-- if user exists go to [encounters]
//                             userLog(`"${user.username}" signed in via Instagram...`);
//                             done(null, user);
//                         } else { //-- else create user and go to [encounters]
//                             //-- Add values to "Model's(User)" parameters 
//                             var newUser = new User({
//                                 instagramId: instagramId || null,
//                                 accessToken: accessToken || null,
//                                 fullname: fullname || null,
//                                 username: username || null,
//                                 password: password || null,
//                                 agreed_terms: agreed_terms || null,
//                                 remember_me: remember_me || null,
//                                 images: [{ location: profileImage, isDisplayPicture: true }] || null,
//                                 joined: joined || null
//                             });
//                             User.createUser(newUser, (err, user) => {
//                                 if (err) throw err;
//                                 else {
//                                     userLog(`A new account just signed up, "@${user.username}"`);
//                                     console.log(`A new account just signed up, "@${user.username}"`);
//                                     done(null, user);
//                                 }
//                             });
//                         }
//                     }
//                 });
//             });
//         }
//     )
// );

//-- REMEMBER-ME STRATEGY
passport.use(new RememberMeStrategy(
    function (token, done) {
        Token.consume(token, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        });
    },
    function (user, done) {
        var token = utils.generateToken(64);
        Token.save(token, { userId: user.id }, function (err) {
            if (err) { return done(err); }
            return done(null, token);
        });
    }
));
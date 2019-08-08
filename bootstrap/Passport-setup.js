const uniq = require('uniqid');
const passport = require('passport/lib');
const RememberMeStrategy = require('passport-remember-me/lib').Strategy;
const LocalStrategy = require('passport-local/lib').Strategy;
const GoogleStrategy = require('passport-google-oauth20/lib').Strategy;

const User = require('@models/user');


// ## PASSPORT STRATEGIES

//-- Passport serialize
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
passport.use(new LocalStrategy({
        usernameField: "username",
        passwordField: "password"
    },
    (username, password, done) => {
        process.nextTick(() => {
            User.getUserByUsername(username, (err, user) => {
                if (err) return done(err);
                if (!user) {
                    return done(null, false, {
                        message: "No user found!"
                    });
                }

                User.comparePassword(password, user.password, (err, isMatch) => {
                    if (err) throw Error;
                    if (!isMatch) {
                        return done(null, false, {
                            message: "Invalid Password"
                        });
                    } else {
                        userLog(`"${user.username}" has signed in.`);
                        console.log(`"@${user.username}" has signed in, @ ${new Date().toTimeString()}`);
                        return done(null, user);
                    }
                });
            });
        });
    }
));

//-- GOOGLE STRATEGY
passport.use(
    new GoogleStrategy({
        clientID: config('services',(items)=>{return items.google.client_id}),
        clientSecret: config('services',(items)=>{return items.google.client_secret}),
        callbackURL: '/auth/0/signin/google/return'
    }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
            let googleId = profile.id;
            let name = profile.displayName;
            let username = uniq.time(profile.name.givenName.toLowerCase());
            let password = uniq.time();
            let agreed_terms = true;
            let profileImage = profile._json.picture;

            let joined = new Date().toDateString();

            //-- Create User
            User.getUserByGoogleId(googleId, (err, user) => {
                if (err) throw err;
                else {
                    if (user)
                    {
                        userLog(`"${user.username}" signed in via Google...`);
                        done(null, user);
                    } else {
                        //-- else create user and go to [encounters]
                        //-- Add values to "Model's(User)" parameters 
                        let newUser = new User({
                            googleId: googleId || '',
                            name: name || '',
                            username: username || '',
                            password: password || '',
                            agreed_terms: agreed_terms || '',
                            dp: profileImage || '',
                            joined: joined || '',
                            email_verified_at: new Date().toDateString(),
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
    })
);

//-- REMEMBER-ME STRATEGY
passport.use(new RememberMeStrategy(
    function (token, done) {
        Token.consume(token, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        });
    },
    function (user, done) {
        let token = utils.generateToken(64);
        Token.save(token, {
            userId: user.id
        }, function (err) {
            if (err) {
                return done(err);
            }
            return done(null, token);
        });
    }
));
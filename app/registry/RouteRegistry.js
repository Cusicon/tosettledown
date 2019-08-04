const createError = require("http-errors");
var app = require('express')();




//-- Router [SIGN UP]
var signup = require('@routes/auth/signup');
app.use("/auth/0/signup", signup);

//-- Router [SIGN IN]
var signin = require('@routes/auth/signin');
app.use("/auth/0/signin", signin);

//Verify Route
app.get("/verify", (req, res) => {
    res.render('./verify', { title: "Terms of Service" });
});
app.get('/verify/resend', (req, res) => {
    console.log("her");
    console.log(VerficationMail)
    let mail = new VerficationMail({
        name: "Emmanuel",
        age: 24
    });
    mail.send()
    res.redirect("/verify");
});
// Auth Route Ends Here





//-- APP ROUTERS [encounters, chats and so on...] That Must Have Verification Middleware and auth middleware
app.use('/app/', require('@routes/app'));

//-- TERMS & POLICIES ROUTERS
app.use(require('@routes/docs'));

//-- Catch 404 and forward to error handler
app.use((req, res, next) => { next(createError(404)) });


module.exports = app;

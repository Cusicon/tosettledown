const createError = require("http-errors");
var app = require('express')();
// const VerficationMail = require('./app/mails/SendVerficationMail');

let authRoute = null

console.log("i ran")

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




// ## ERROR HANDLING
//-- Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

//-- Error handler
app.use(function (err, req, res, next) {
    //- set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    //- render the error page
    res.status(err.status || 500);
    res.render('./error/404', {
        title: "Error"
    });
});

module.exports = app;


// Route Defination End

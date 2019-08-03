let express = require('express');
const createError = require("http-errors");
let router =  express();
const app = express();
const VerficationMail = require('./app/mails/SendVerficationMail');


//-- Router [SIGN UP]
var signup = require('./routes/auth/signup');
app.use("/auth/0/signup", signup);

//-- Router [SIGN IN]
var signin = require('./routes/auth/signin');
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





//-- APP ROUTERS [encounters, chats and so on...] That Must Have Verification Middleware and auth middleware
var index = require('./routes/index');
app.use('/app/', index);




//-- TERMS & POLICIES ROUTERS

//-- cookie Router
var cookie = require('./routes/docs/cookie');
app.use('/cookie', cookie);

//-- policy Router
var policy = require('./routes/docs/policy');
app.use('/policy', policy);

//-- terms Router
var terms = require('./routes/docs/terms');
app.use('/terms', terms);

app.get('/', (req, res) => {
    if (!req.user) {
        res.render("./index", {
            title: 'Built for lovers'
        });
    } else {
        res.redirect('/app/encounters');
    }
});





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


// Route Defination End

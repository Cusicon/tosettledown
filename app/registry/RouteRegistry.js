const createError = require("http-errors");
let app = require('express')();



//
// //-- Router [SIGN UP]
// let signup = require('@routes/auth/signup');
// app.use("/auth/0/signup", signup);


//-- AUTH ROUTERS That Must Have Verification Middleware and auth middleware
app.use("/auth/0/", require('@routes/auth'));

//-- APP ROUTERS [encounters, chats and so on...] That Must Have Verification Middleware and auth middleware
app.use('/app/',...applyMiddleware(['auth', 'verify']), require('@routes/app'));

//-- TERMS & POLICIES ROUTERS
app.use(require('@routes/docs'));

//-- Catch 404 and forward to error handler
app.use((req, res, next) => { next(createError(404)) });


module["exports"] = app;

const createError = require("http-errors");
let app = require('express')();

//-- AUTH ROUTERS That Must Have Verification Middleware and auth middleware
app.use("/auth/0/", require('@routes/auth'));

//-- APP ROUTERS [encounters, chats and so on...] That Must Have Verification Middleware and auth middleware
app.use('/app/', ...applyMiddleware(['auth', 'verify', 'update_last_activity','must_have_picture']), require('@routes/app'));

//-- TERMS & POLICIES ROUTERS
app.use(require('@routes/docs'));

//-- Catch 404 and forward to error handler
app.use((req, res, next) => {
    res.redirect("/");
    next(createError(404))
});

module["exports"] = app;
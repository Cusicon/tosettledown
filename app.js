// ## REQUIRE MODULES
const createError = require("http-errors");
const logger = require("morgan");
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const expressValidator = require("express-validator");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// ## DB CONNECTION
require("./db/db_conn"); //-- for db connection

// ## LOGGING
//-- Log Server's activities to Server Log file 
global.serverLog = log => {
  fs.appendFile("./log/server.log", log + "\n", err => {
    if (err) console.log("Unable to write to server.log");
  });
};

//-- Log User's activities to UserActivity Log file
global.userLog = log => {
  fs.appendFile("./log/userActivity.log", log + "\n", err => {
    if (err) console.log("Unable to write to userActivity.log");
  });
};

//-- Custom middleware for server log request
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${req.method} ${req.url}: @ ${now}`;
  serverLog(log);
  next();
});

// ## VIEW ENGINE
app.set('views', path.join(__dirname, './public/views/'));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// ## MIDDLEWARES
app.use(logger("dev")); // use logger
app.use(bodyParser()); // use bodyParser
app.use(cookieParser()); // use cookieParser
app.use(expressLayouts); // use expressLayouts
app.use(express.json()); // use express.json
app.use(express.urlencoded({ extended: false })); // use express.urlencoded
app.use(express.static(path.join(__dirname, './public/'))); // set static directory

//-- Express-session Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

//-- Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//-- Express-validator middleware
app.use(
  expressValidator({
    errorFormater: (param, msg, value) => {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

//-- Express Messages Middleware
app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// ROUTERS
app.get('/', (req, res) => { //-- Test home route
  res.send("Welcome");
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
  res.render('error');
});

module.exports = app;

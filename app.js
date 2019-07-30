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
const keys = require("./config/keys");

// ## PORT
var port = process.env.PORT || "3020";
app.set('port', port);


// ## DB CONNECTION
require("./db/db_conn"); //-- for db connection

// ## LOGGING
//-- Log Server's activities to "server.log" Log file 
var logsLoc = path.join(__dirname, "./logs");
global.serverLog = log => {
  fs.mkdir(logsLoc, {
    recursive: true
  }, err => {
    if (err) console.log(err);
    else {
      fs.appendFile("./logs/server.log", `@ ${new Date().toString()} -- [ ${log} ]\n`, err => {
        if (err) console.log("Unable to write to server.log");
      });
    }
  })
};

//-- Log User's activities to "userActivity.log" Log file
global.userLog = log => {
  fs.mkdir(logsLoc, {
    recursive: true
  }, err => {
    if (err) console.log(err);
    else {
      fs.appendFile("./logs/userActivity.log", `@ ${new Date().toString()} -- [ ${log} ]\n`, err => {
        if (err) console.log("Unable to write to userActivity.log");
      });
    }
  });
};

//-- Custom middleware for server log request
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${req.method} ${req.url}`;
  serverLog(log);
  next();
});

// ## VIEW ENGINE
app.set('views', path.join(__dirname, './views/'));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// ## MIDDLEWARES
// app.use(logger("dev")); //-- use logger
app.use(bodyParser()); //-- use bodyParser
app.use(cookieParser()); //-- use cookieParser
app.use(expressLayouts); //-- use expressLayouts
app.use(express.json()); //-- use express.json
app.use(express.urlencoded({
  extended: false
})); //-- use express.urlencoded
app.use(express.static(path.join(__dirname, './public/'))); //-- set public static directory
//-- Express-session Middleware
app.use(
  session({
    secret: keys.session.sessionSecret,
    resave: true,
    saveUninitialized: true
  })
);
//-- Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me')); //-- Passport RememberMe Middleware 
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


// ## VIEW [Sign up and Sign in.]
app.get('/', (req, res) => {
  if (!req.user) {
    res.render("./index", {
      title: 'Built for lovers'
    });
  } else {
    res.redirect('/app/encounters');
  }
});

// ## GLOBAL ROUTERS

// Get any Route and send Global variables
global.User;
app.get("*", (req, res, next) => {
  User = req.user || null;
  res.locals.user = req.user || null;
  res.locals.url = req.originalUrl || null;
  next();
});

// Get any app "GET" Route and check if user is signed in
// else redirect to sign out!
app.get("/app/*", (req, res, next) => {
  if (!User) {
    // Sign Out
    res.location("/auth/0/signin/out");
    res.redirect("/auth/0/signin/out");
  } else {
    userLog(`"${User.username || null}" is active`);
  }
  next();
});

// Get any app "POST" Route and check if user is signed in
// else redirect to sign out!
app.post("/app/*", (req, res, next) => {
  if (!User) {
    // Sign Out
    res.location("/auth/0/signin/out");
    res.redirect("/auth/0/signin/out");
  } else {
    userLog(`"${User.username || null}" is active`);
  }
  next();
});

// ## ROUTERS

//-- Router [SIGN UP]
var signup = require('./routes/auth/signup');
app.use("/auth/0/signup", signup);

//-- Router [SIGN IN]
var signin = require('./routes/auth/signin');
app.use("/auth/0/signin", signin);

//-- APP ROUTERS [encounters, chats and so on...]
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

// ## SERVER LISTENING
app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
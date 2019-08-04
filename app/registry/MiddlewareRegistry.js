const keys = require("@config/keys");

module["exports"] = {

   globalMiddleware : [
        require("morgan")("dev"), //-- use logger
        require("body-parser")(), //-- use bodyParser
        require("cookie-parser")(), //-- use cookieParser
        require("express-ejs-layouts"),//-- use expressLayouts
        require("express").json(), //-- use express.json
        require("express").urlencoded({extended: false}), //-- use express.urlencoded
        require("express").static( public_path()), //-- set public static directory
        //-- Express-session Middleware
        require("express-session")({secret: keys.session.sessionSecret, resave: true, saveUninitialized: true}),
        //-- Passport Middlewares
        require("passport").initialize(),
        require("passport").session(),
        require("passport").authenticate('remember-me'), //-- Passport RememberMe Middleware
        require('@bootstrap/Middleware').expressValidator,
        require('@bootstrap/Middleware').message,
        require('@bootstrap/Middleware').setGlobalVariable,
        require('@bootstrap/Middleware').serverlog,
       require("connect-flash")(),
  ],

  nameMiddleware : {
      'auth': require('@app/middlewares/Authenticate'),
      'verify' : require('@app/middlewares/Verify'),
      'guest' : require('@app/middlewares/RedirectIfAuthenticated'),

  },

};
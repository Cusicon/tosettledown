module["exports"] = {

   globalMiddleware : [
        require("morgan")("dev"), //-- use logger
        require("body-parser").urlencoded({extended: true}), //-- use bodyParser
        require("connect-flash")(),
        require("cookie-parser")(), //-- use cookieParser
        require("express-ejs-layouts"),//-- use expressLayouts
        require("express").json(), //-- use express.json
        require("express").urlencoded({extended: false}), //-- use express.urlencoded
        require("express").static( public_path()), //-- set public static directory
        //-- Express-session Middleware
        require("express-session")({secret: config('app', 'key'), resave: true, saveUninitialized: true}),
        //-- Passport Middlewares
        require("passport").initialize(),
        require("passport").session(),
        require("passport").authenticate('remember-me'), //-- Passport RememberMe Middleware
        require('@bootstrap/Middleware').expressValidator,
        require('@bootstrap/Middleware').message,
        require('@bootstrap/Middleware').setGlobalVariable,
        require('@bootstrap/Middleware').serverlog,

  ],

  nameMiddleware : {
      'auth': require('@app/middlewares/Authenticate'),
      'verify' : require('@app/middlewares/Verify'),
      'guest' : require('@app/middlewares/RedirectIfAuthenticated'),

  },

};
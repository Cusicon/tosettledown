module["exports"] = {

    globalMiddleware: [
        // require("morgan")("dev"), //-- use logger
        require("body-parser").json({limit: '50mb', extended: true}), //-- use bodyParser
        require("body-parser").urlencoded({limit: '50mb', extended: true}), //-- use bodyParser
        require("connect-flash")(),
        require("cookie-parser")(), //-- use cookieParser
        require("express-ejs-layouts"), //-- use expressLayouts
        require("express").json({limit: '50mb', extended: true}), //-- use express.json
        require("express").urlencoded({limit: '50mb', extended: true}), //-- use express.urlencoded
        require("express").static(public_path()), //-- set public static directory
        require("express-session")({
            secret: config('app', 'key'),
            resave: true,
            saveUninitialized: true
        }), //-- Express-session Middleware
        require("passport").initialize(),
        require("passport").session(),
        require("passport").authenticate('remember-me'), //-- Passport RememberMe Middleware
        require('@bootstrap/Middleware').expressValidator,
        require('@bootstrap/Middleware').message,
        require('@bootstrap/Middleware').setGlobalVariable,
        require('@bootstrap/Middleware').serverlog,
    ],

    nameMiddleware: {
        'auth': require('@app/middlewares/Authenticate'),
        'verify': require('@app/middlewares/Verify'),
        'guest': require('@app/middlewares/RedirectIfAuthenticated'),
        'must_have_picture': require('@app/middlewares/MustHavePicture'),
        'update_last_activity': require('@app/middlewares/UpdateLastActivity'),
    },

};
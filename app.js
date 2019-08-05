/*
* SETTING UP BASE_PATH TO THE GLOBAL VARIABLE
*/
global["base_path"] = __dirname;

/*
* REQUIRE ALL TOP MODULES
*/
const app = require("express")();
const path = require("path");
require('module-alias/register');
require('@bootstrap/Passport-setup');
require('@bootstrap/Helper');
require("./db/db_conn"); //-- for db connection

const port = process.env.PORT || "3020";
app.set('port', port);
app.set('views', path.join(__dirname, './views/'));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

/*
* LUNCH ALL GLOBAL MIDDLEWARE
*/
require('@app/registry/MiddlewareRegistry').globalMiddleware.forEach(function(value){ app.use(value) });
/*
* REGISTER ALL ROUTE
*/
app.use(require('@app/registry/RouteRegistry'));
/*
* LISTEN TO ANY ROUTE EXCEPTION AND CATCH IT
*/
app.use(require('@app/Exception/Handler'));
/*
* LISTEN TO ANY APPLICATION EXCEPTION AND CATCH IT
*/
app.on('uncaughtException', function(err) { console.log('Caught exception: ' + err) });
/*
* LISTEN TO ANY EXCEPTION AND CATCH IT
*/
app.listen(port, () => { console.log(`Server listening at port: ${port}`) });
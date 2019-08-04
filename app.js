global.base_path = __dirname;

const app = require("express")();
const path = require("path");
require('module-alias/register');

require('@app/helper');
require("./db/db_conn"); //-- for db connection
const port = process.env.PORT || "3020";

app.set('port', port);
app.set('views', path.join(__dirname, './views/'));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");


// Set Global Middleware
require('@app/registry/MiddlewareRegistry').globalMiddleware.forEach(function(value){ app.use(value) });


app.use(require('@app/registry/RouteRegistry'));
app.use(require('@app/Exception/Handler'));


process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});



// ## SERVER LISTENING
app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
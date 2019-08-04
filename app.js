global.base_path = __dirname;

const app = require("express")();
const path = require("path");
require('module-alias/register');
const Layout = require("express-ejs-layouts");

require('@app/helper');
const MiddleWareRegistry = require('@app/registry/MiddlewareRegistry');
require("./db/db_conn"); //-- for db connection
const port = process.env.PORT || "3020";

app.use(Layout())


// Set Global Middleware
MiddleWareRegistry.globalMiddleware.forEach(function(value){
  app.use(value);
});

app.set('port', port);
app.set('views', path.join(__dirname, './views/'));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");





app.use(require('@app/registry/RouteRegistry'));

// Setting Route
//Verify Route
app.get("/verify", (req, res) => {
  res.render('./verify', { title: "Terms of Service" });
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





// Get any app "GET" Route and check if user is signed in
// else redirect to sign out!
// app.get("/app/*", (req, res, next) => {
//   if (!User) {
//     // Sign Out
//     res.location("/auth/0/signin/out");
//     res.redirect("/auth/0/signin/out");
//   } else {
//     userLog(`"${User.username || null}" is active`);
//   }
//   next();
// });
//
// // Get any app "POST" Route and check if user is signed in
// // else redirect to sign out!
// app.post("/app/*", (req, res, next) => {
//   if (!User) {
//     // Sign Out
//     res.location("/auth/0/signin/out");
//     res.redirect("/auth/0/signin/out");
//   } else {
//     userLog(`"${User.username || null}" is active`);
//   }
//   next();
// });

// MiddleWare Ends




// ## SERVER LISTENING
app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
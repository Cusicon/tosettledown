const app = require("express")();
const path = require("path");
require('module-alias/register');
const base_path = path.join(__dirname);
require('@app/helper');
const MiddleWareRegistry = require('@app/registry/MiddlewareRegistry');
require("./db/db_conn"); //-- for db connection
const port = process.env.PORT || "3020";

app.set('port', port);
app.set('views', path.join(__dirname, './views/'));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");



// Set Global Middleware
let global_middleware = MiddleWareRegistry.globalMiddleware;

console.log(MiddleWareRegistry);

global_middleware.forEach(function(value){
  app.use(value);
});


// Setting Route





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
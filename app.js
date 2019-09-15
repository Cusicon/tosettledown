/*
 * LET SHOOT THIS APPLICATION AND GET IT TO MARKET
 */
let Bootstrap = require("./bootstrap/index");

let app = new Bootstrap(__dirname).initHttp();

/* LISTEN TO ANY APPLICATION/PROCESS EXCEPTION AND CATCH IT */
// process.on('uncaughtException', function(err) { console.error('Caught exception: \n ' + err.stack) });

app.listen(config('app', 'port', '3020'), () => {
    console.log(`Server listening at port: ${config('app','port','3020')}`)

});
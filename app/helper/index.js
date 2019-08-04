const path = require("path");
const fs = require('fs');


global.storage_path = (path_join = "") => { return path.join(base_path, "storage", path_join)};
global.public_path = (path_join = "") => { return path.join(base_path, "public", path_join)};

global.config = () =>
{
    console.log(r);
}

//-- Log User's activities to "userActivity.log" Log file
global.userLog = log => {
    fs.mkdir(storage_path('logs'), {
        recursive: true
    }, err => {
        if (err) console.log(err);
        else {
            fs.appendFile( path.join(storage_path('logs'), 'userActivity.log'), `@ ${new Date().toString()} -- [ ${log} ]\n`, err => {
                if (err) console.log("Unable to write to userActivity.log");
            });
        }
    });
};

global.User;

global.serverLog = log => {
    fs.mkdir(storage_path('logs'), {
        recursive: true
    }, err => {
        if (err) console.log(err);
        else {
            fs.appendFile( path.join(storage_path('logs'), 'server.log') , `@ ${new Date().toString()} -- [ ${log} ]\n`, err => {
                if (err) console.log("Unable to write to server.log");
            });
        }
    })
};

global.applyRouterMiddleware = (router, middleware) => {
    let nameMiddleware = require('@app/registry/MiddlewareRegistry').nameMiddleware;

    console.log(nameMiddleware);

    if(middleware instanceof Array){

        middleware.forEach(function(value){
            router.use(nameMiddleware[value]);
        });
    }
    else if(middleware instanceof String)
    {
        router.use(nameMiddleware[middleware]);
    }
    else
    {
    }
    return router
};
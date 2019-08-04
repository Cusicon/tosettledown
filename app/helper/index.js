const path = require("path");
const fs = require('fs');


global["storage_path"] = (path_join = "") => { return path.join(base_path, "storage", path_join)};
global["public_path"] = (path_join = "") => { return path.join(base_path, "public", path_join)};

global["config"] = () =>
{
    console.log();
};

//-- Log User's activities to "userActivity.log" Log file
global["userLog"] = log => {
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

global["User"] = null;

global["serverLog"] = log => {
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


global["applyMiddleware"] = (middleware) => {
    let nameMiddleware = require('@app/registry/MiddlewareRegistry').nameMiddleware;
    let resolveMiddleware = [];

    if(middleware instanceof Array){

        middleware.forEach(function(value){
            resolveMiddleware.push(nameMiddleware[value]);
        });
    }
    else if(middleware instanceof String)
    {
        resolveMiddleware.push(nameMiddleware[middleware]);
    }
    else
    {
        console.log("i reach here")
    }
    return resolveMiddleware;
};
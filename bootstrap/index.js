const express = require("express");
const fs = require('fs');
module['exports'] = class Bootstrap {

    constructor(base_path)
    {
        this.setBasePath(base_path);
        return this;
    }

    requireAllImportantModules()
    {
        this.loadEnvironmentalVariables();
        require('module-alias/register');
        require('@bootstrap/Helper');
        require('@bootstrap/Passport-setup');
        require("@bootstrap/Database");
    }

    // noinspection JSMethodCanBeStatic
    setBasePath(base_path)
    {
        global["base_path"] = base_path;
    }

    // noinspection JSMethodCanBeStatic
    loadEnvironmentalVariables()
    {
        if (fs.existsSync(`${base_path}/.env`)) {
            require('dotenv').config({ path: `${base_path}/.env` })
            // require('env2')(`${base_path}/.env`);
        }
    }

    registerGlobalMiddleware()
    {
        require('@app/registry/MiddlewareRegistry').globalMiddleware.forEach((value) => { this.app.use(value) });
    }

    registerFacade()
    {
        let facade = require('@app/registry/FacadeRegistry');
        Object.keys(facade).forEach(key => {
            global[key] = facade[key];
        });
    }

    registerRoutes()
    {
        this.app.use(require('@app/registry/RouteRegistry'));
    }

    registerExceptionHandler()
    {
        this.app.use(require('@app/Exception/Handler'));
    }

    register()
    {

        this.app.set('port', config('app','port','3020'));
        this.app.set('views', view_path());

        this.app.engine("html", require('ejs-blocks'));
        this.app.set("view engine", "html");
    }

    initHttp()
    {
        this.app = express();
        this.http = require('http').createServer(this.app);
        this.io = require('socket.io')(this.http);

        this.io.on('connection', (socket) => {

            //-- on listen to message from channel
            socket.on('chat message', (msg) => {
                console.log('message: ' + msg.user);

                console.log(msg.user);
            // <%= user.username %>-message
                this.io.emit(msg.to, msg);
            });



            console.log('a user connected');
        });

        this.requireAllImportantModules();
        this.registerGlobalMiddleware();
        this.registerFacade();
        this.register();
        this.registerRoutes();
        this.registerExceptionHandler();
        return this.http;
    }

    initConsole()
    {
        this.loadEnvironmentalVariables();
        require('module-alias/register');
        require('@bootstrap/Helper');
        // require('@bootstrap/Passport-setup');
        require("@bootstrap/Database");
        this.registerFacade()
    }
};
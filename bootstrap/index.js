const express = require("express");
const fs = require('fs');
module['exports'] = class Bootstrap {

    constructor(base_path)
    {
        this.app = express();
        this.setBasePath(base_path);
        this.init();
        return this.app;
    }

    requireAllImportantModules()
    {
        this.loadEnvironmentalVariables();
        require('module-alias/register');
        require('@bootstrap/Helper');
        require('@bootstrap/Passport-setup');
        require("@bootstrap/Database");
    }

    setBasePath(base_path)
    {
        global["base_path"] = base_path;
    }

    loadEnvironmentalVariables()
    {
        if (fs.existsSync(`${base_path}/.env`)) {
            require('env2')(`${base_path}/.env`);
        }
    }

    registerGlobalMiddleware()
    {
        require('@app/registry/MiddlewareRegistry').globalMiddleware.forEach((value) => { this.app.use(value) });
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
        this.app.engine("html", require("ejs").renderFile);
        this.app.set("view engine", "html");
    }

    init()
    {
        this.requireAllImportantModules()
        this.registerGlobalMiddleware()
        this.register()
        this.registerRoutes()
        this.registerExceptionHandler()
    }
}
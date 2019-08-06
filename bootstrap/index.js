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

        // let facade = require('@app/registry/FacadeRegistry');
        // for(let value in facade)global[value] = facade[value]


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
        this.requireAllImportantModules();
        this.registerGlobalMiddleware();
        this.registerFacade();
        this.register();
        this.registerRoutes();
        this.registerExceptionHandler();
    }
};
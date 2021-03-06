// noinspection JSUnusedGlobalSymbols
module["exports"] = {
    expressValidator: require("express-validator")({
        errorFormater: (param, msg, value) => {
            let namespace = param.split("."),
                root = namespace.shift(),
                formParam = root;

            while (namespace.length) {
                formParam += "[" + namespace.shift() + "]";
            }
            // noinspection JSUnusedGlobalSymbols
            return {
                param: formParam,
                msg: msg,
                value: value
            };
        }
    }),

    message: (req, res, next) => {
        res.locals.messages = require("express-messages")(req, res);
        next();
    },

    setGlobalVariable: (req, res, next) => {
        // noinspection JSUnusedLocalSymbols
        res.locals.user = req.user || null;
        res.locals.url = req.originalUrl || null;
        global['__requestContext'] = req;
        global['__responseContext'] = res;
        next();
    },

    serverlog: (req, res, next) => {
        let now = new Date().toString();
        let log = `${req.method} ${req.url} @ ${now}`;
        serverLog(log);
        next();
    }
};
module.exports = {
    expressValidator : require("express-validator")({
        errorFormater: (param, msg, value) => {
            var namespace = param.split("."),
                root = namespace.shift(),
                formParam = root;

            while (namespace.length) {
                formParam += "[" + namespace.shift() + "]";
            }
            return {
                param: formParam,
                msg: msg,
                value: value
            };
        }
    }),

    message : (req, res, next) => {
        res.locals.messages = require("express-messages")(req, res);
        next();
    },


    setGlobalVariable : (req, res, next) => {
        User = req.user || null;
        res.locals.user = req.user || null;
        res.locals.url = req.originalUrl || null;
        next();
    },

    serverlog : (req, res, next) => {
        var now = new Date().toString();
        var log = `${req.method} ${req.url}`;
        serverLog(log);
        next();
    }
};


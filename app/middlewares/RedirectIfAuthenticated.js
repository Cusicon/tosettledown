module["exports"] = function(req, res, next){
    let redirectTo = "/app/encounters";

    if (req.user) {
        res.redirect(`${redirectTo}`);
    }
    next()
};
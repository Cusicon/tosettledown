module.exports = function(req, res, next){
    let redirectTo = "/app/encounters";

   console.log(req)

    if (req.user) {
        res.redirect(`${redirectTo}`);
    }
    next()
}
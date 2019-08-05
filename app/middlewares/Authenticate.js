module.exports = function (req, res, next) {
    if (!req.user) {
        res.redirect("/");
    } else {
        userLog(`"${req.user.username || null}" is active`);
    }
    next();
};
module.exports = function (req, res, next) {
    if (!req.user) {
        res.redirect("/auth/0/signin/out");
    } else {
        userLog(`"${req.user.username || null}" is active`);
    }
    next();
};
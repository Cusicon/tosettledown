module.exports = function (req, res, next) {
    if (!req.user) {
        res.location("/auth/0/signin/out");
        res.redirect("/auth/0/signin/out");
    } else {
        userLog(`"${req.user.username || null}" is active`);
    }
    next();
}
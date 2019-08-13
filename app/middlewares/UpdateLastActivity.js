module["exports"] = function (req, res, next) {
    if (req.user) {
        req.user.last_activity_at = Date.now();
        req.user.save();
    }
    next();
};
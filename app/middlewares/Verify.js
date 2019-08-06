module["exports"] = function (req, res, next) {
    if(req.user && req.user.email_verified_at == null)
    {
        res.redirect("/auth/0/verify/resend");
    }
    next();
};
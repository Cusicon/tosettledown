module["exports"] = class LoginController{

    static login(req, res, next)
    {

        if (!req.body.remember) { res.redirect(`/app/encounters`); }

        var token = utils.generateToken(64);
        Token.save(token, { userId: req.user.id }, function(err) {
            if (err) { return done(err); }
            res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 7 days
            res.redirect(`/app/encounters`);
        });
    }

    static googleLoginCallback(req, res)
    {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //-- Cookie expires after 30 days
        userLog(`"${req.user.username}" has signed in.`);
        console.log(`"@${req.user.username}" has signed in!, @ ${new Date().toTimeString()}`);
        res.redirect(`/app/encounters`);
    }



    static logout(req, res)
    {
        if (req.user) {
            req.session.destroy(err => {
                userLog(`"${req.user.username}" has signed out.`);
                console.log(`@${req.user.username} has signed out!, @ ${new Date().toTimeString()}`);
                console.log(err);
                res.redirect("/#loginForm");
            });
        } else {
            res.redirect("/#loginForm");
        }
    }
};
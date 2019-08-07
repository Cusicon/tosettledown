module["exports"] = class LoginController{

    static login(req, res, next)
    {
        if (req.body.remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //-- Cookie expires after 30 days
        } else {
            req.session.cookie.expires = false; //-- Cookie expires at end of session
        }
        res.redirect(`/app/encounters`);
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
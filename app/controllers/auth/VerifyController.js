let SendVerificationMail = require('@app/mails/SendVerificationMail');
let User = require("@models/user");

module['exports'] = class VerifyController {

    static notice(req, res)
    {
        res.render('./auth/verify', { title: "Verification Mail" });
    }

    static resend(req, res)
    {
        if(req.user){
            new SendVerificationMail(req.user).subject("Verification").send()
        }
        res.redirect("/auth/0/verify");
    }

    static verify(req, res)
    {
        console.log("req.params.id");
        User.getUserById(req.params.id, function(err, user) {
            if (!user)
                return next(new Error('Could not load Document'));
            else {
                user.email_verified_at = Date.now();

                user.save(function(err) {
                    if (err)
                        res.redirect('/auth/0/verify');
                    else
                        res.redirect('/')
                });
            }
        })
    }
};
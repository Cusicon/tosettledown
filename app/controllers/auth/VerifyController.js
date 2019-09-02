let SendVerificationMail = require('@app/mails/SendVerificationMail');
let User = require("@models/user");

module['exports'] = class VerifyController {

    static notice(req, res) {
        if (req.user && req.user.email_verified_at != null) {
            res.redirect('/#regForm');
        }
        res.render('./auth/verify', {
            title: "Verification Mail"
        });
    }

    static resend(req, res) {
        if (req.user) {
            new SendVerificationMail(req.user).subject("Verification").send()
        }
        res.redirect("/auth/0/verify");
    }

    static verify(req, res, next) {
        console.log("req.params.id");
        User.getUserById(req.params.id, function (err, user) {
            if (!user)
                return next(new Error('Could not load Document'));
            else {
                User.getUserByIdandUpdate(user.id, {
                    email_verified_at: Date.now()
                }, (err) => {
                    if (err)
                        res.redirect('/auth/0/verify');
                    else
                        res.redirect('/#regForm')
                })
            }
        })
    }
};
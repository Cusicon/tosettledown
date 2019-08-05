let SendVerificationMail = require('@app/mails/SendVerificationMail');

module['exports'] = class VerifyController {

    static notice(req, res)
    {
        let verify = new SendVerificationMail({email : "akinjole@yahoo.com", subject: "Verification"}).send();
        res.render('./auth/verify', { title: "Terms of Service" });
    }

    static resend(req, res)
    {
        if(req.user){
            new SendVerificationMail({email : "akinjole@yahoo.com", subject: "Verification"}).send()
        }
        res.redirect("/verify");
    }

    static verify(req, res)
    {

    }
}
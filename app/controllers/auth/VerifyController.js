module['exports'] = class VerifyController {

    static show(req, res)
    {
        res.render('./verify', { title: "Terms of Service" });
    }

    static send(req, res)
    {

        console.log(VerficationMail)
        let mail = new VerficationMail({
            name: "Emmanuel",
            age: 24
        });
        mail.send()
        res.redirect("/verify");
    }
}
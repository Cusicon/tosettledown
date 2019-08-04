const WelcomeController = class WelcomeController{

    constructor()
    {
    }

    index(req, res)
    {
        res.render("./index", { title: 'Built for lovers' });
    }

    cookie(req, res)
    {
        res.render('./docs/cookie', { title: "Cookie Policy" });
    }

    policy(req, res)
    {
        res.render('./docs/policy', { title: "Privacy Policy" });
    }

    terms(req, res)
    {
        res.render('./docs/terms', { title: "Terms of Service" });
    }

}


module.exports = new WelcomeController();
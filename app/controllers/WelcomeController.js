module["exports"] = class WelcomeController {

    static index(req, res) {
        res.render("./auth/index", {
            title: 'Built for lovers'
        });
    };

    static cookie(req, res) {
        res.render('./docs/cookie', {
            title: "Cookie Policy"
        });
    };

    static policy(req, res) {
        res.render('./docs/policy', {
            title: "Privacy Policy"
        });
    };

    static terms(req, res) {
        res.render('./docs/terms', {
            title: "Terms of Service"
        });
    };

    static forgotPassword(req, res) {
        res.render('./auth/forgotPassword', {
            title: "Forgot password"
        });
    }

};
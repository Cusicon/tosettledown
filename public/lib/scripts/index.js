// Toggle Sign in (Anonymous)
function toggleSignIn() {
    var loginForm = $('#loginForm'),
        regForm = $('#regForm'),
        loginBtn = $('#loginBtn');
    loginBtn.click(() => {
        if (loginBtn.text().toLowerCase() == "sign in") {
            loginBtn.text("Sign up");
            // regForm.css({ "filter": "blur('5px')" });
            loginForm.css({ "left": "0%" });
        } else {
            loginBtn.text("Sign in");
            loginForm.css({ "left": "-100%" });
            // regForm.css({ "filter": "none" });
        }
    });
} toggleSignIn();
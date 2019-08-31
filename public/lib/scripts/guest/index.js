// Toggle Sign in (Anonymous)
function toggleSignIn() {
    let loginForm = $('#loginForm'),
        regForm = $('#regForm'),
        loginBtn = $('#loginBtn');
    loginBtn.click(() => {
        if (loginBtn.text().toLowerCase() == "sign in") {
            loginBtn.text("Sign Up");
            loginBtn.attr("href", "#loginForm");
            loginForm.css({ "left": "0%" });
        } else {
            loginBtn.text("Sign In");
            loginBtn.attr("href", "#regForm");
            loginForm.css({ "left": "-100%" });
        }
    });

    if (location.href.includes("#regForm")) {
        loginBtn.text("Sign In");
        loginBtn.attr("href", "#loginForm");
        loginForm.css({ "left": "-100%" });
    } else if (location.href.includes("#loginForm")) {
        loginBtn.text("Sign Up");
        loginBtn.attr("href", "#regForm");
        loginForm.css({ "left": "0%" });
    }
} toggleSignIn();
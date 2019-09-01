// Toggle Sign In (Anonymous)
function toggleSignIn() {
    let loginForm = $('#loginForm'),
        loginBtn = $('#loginBtn');
    loginBtn.click(() => {
        console.log(loginForm.css("left") != "0px");
        if (`${location.origin}${location.pathname}` == location.href) {
            loginBtn.text("Sign Up");
            loginBtn.attr("href", "/#regForm");
            loginForm.css({
                "left": "0%"
            });
        } else {
            loginBtn.text("Sign In");
            loginBtn.attr("href", "/#loginForm");
            loginForm.css({
                "left": "-100%"
            });
        }
    });

    if (location.href.includes("/#regForm")) {
        loginBtn.text("Sign In");
        loginBtn.attr("href", "/#loginForm");
        loginForm.css({
            "left": "-100%"
        });
    } else if (location.href.includes("/#loginForm")) {
        loginBtn.text("Sign Up");
        loginBtn.attr("href", "/#regForm");
        loginForm.css({
            "left": "0%"
        });
    }
}
toggleSignIn();

// (function () {
//     // Set URL to redirect to "/#regForm"
//     var loc = `${location.origin}/`;
//     if (location.href == loc) {
//         console.log("HOME")
//         location.assign("/#regForm");
//     }
// })();
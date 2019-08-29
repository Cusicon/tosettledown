$(function () {
    var windowWidth = window.outerWidth;

    function onMobile(width) {
        console.log("Width: ", width);
        console.log("Outside Mobile");
        if (width <= 576) {
            console.log("inside Mobile");
            // Run this function if user is on mobile.
            mainMobile();
        }
    }
    onMobile(windowWidth);
})

function mainMobile() {
    // Overide some inline css declared
    overideInlineCss(".displayWindow", {
        "height": "unset",
        "border": "none"
    });

    // When click on a user in [Chats] the funciton fires
    enterChatsWindow();
}

function overideInlineCss(selector, changes = {}) {
    $(selector).css(changes);
}

function displayinFullScreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen({
            navigationUI: "hide"
        });
    } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen({
            navigationUI: "hide"
        });
    } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen({
            navigationUI: "hide"
        });
    } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen({
            navigationUI: "hide"
        });
    }
}

function enterChatsWindow() {
    let userLink = $('.user.user-chat-listing');
    let ChatWindow = $('.ChatWindow');
    console.log("ChatWindow: ", ChatWindow.css("left"))
    userLink.click(() => {
        if (ChatWindow.css("left") != "0px") {
            console.log("ChatWindow: ", ChatWindow)
            ChatWindow.css({
                "left": "0% !important"
            });
        } else {
            ChatWindow.css({
                "left": "-120% !important"
            });
        }
    });

    // if (location.href.includes("#regForm")) {
    //     userLink.text("Sign in");
    //     userLink.attr("href", "#loginForm");
    //     loginForm.css({
    //         "left": "-100%"
    //     });
    // } else if (location.href.includes("#loginForm")) {
    //     userLink.text("Sign up");
    //     userLink.attr("href", "#regForm");
    //     loginForm.css({
    //         "left": "0%"
    //     });
    // }
}
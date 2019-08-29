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

    window.onscroll = e => {
        displayinFullScreen();
    }
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
$(function () {
    var windowWidth = window.outerWidth;

    function onMobile(width) {
        if (width <= 576) {
            // Run this function if user is on mobile.
            mainMobile();
        }
    }
    onMobile(windowWidth);
})

function mainMobile() {
    // Overide some inline css declared
    overideInlineCss(".displayWindow", {
        "height": "unset !important",
        "margin-bottom": "unset !important",
        "padding": "0px !important",
        "border": "none !important"
    });

    // if(url is in profile) replace the profile-header link with "addPhotosBtn" button
    replaceWithAddPhotosBtn(`
        <a href=javascript:void(0); class="text-dark btn waves-effect waves-light addImages" id="addPhotosBtn"
            role="button" data-toggle="modal" data-target=".addPhotosCon"
            onclick="$('#addPhotos').trigger('click');"  data-countBtn="1"
            style="float: right; padding: 4px 10px !important; font-size: 20px;">
            <i class="typcn typcn-plus-outline"></i>
        </a>
    `)

    // On mobile display in fullscreen
    displayinFullScreen();

}

function replaceWithAddPhotosBtn(element) {
    let username = $("#activeUser_username").text().split("@")[1].trim();
    if (location.href.includes(`/app/profile/${username}`)) {
        $("#profileLinkCon").html(element);
        $(`[data-countbtn="0"]`).addClass("hide");
    } else {
        console.log("Not at profile page")
    }

}

function overideInlineCss(selector, changes = {}) {
    $(selector).css(changes);
}

function displayinFullScreen() {
    var elem = document.documentElement;
    elem.addEventListener("scroll", (ev) => {
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
    }, false)
}
$(document).ready(() => {
    let message = $("div#messages ul");
    // let image = $("div#messages ul").attr('data-src');
    let text = $("div#messages ul li").text();
    let mode = $("div#messages ul").attr("class");

    if (text !== "") {
        alert(mode, mode, text);
    }
    message.html("");
});

function alert(icon, mode, msg, buttons = [], buttonAction) {
    let upperMode = mode.replace(mode.charAt(0), mode.charAt(0).toUpperCase());
    swal({
        title: upperMode,
        text: msg,
        icon: icon || null,
        closeOnEsc: (icon.toLowerCase() == "warning") || (icon.toLowerCase() == "success") || (icon.toLowerCase() == "info") ? true : false,
        closeOnClickOutside: false,
        dangerMode: (icon.toLowerCase() == "warning") || (icon.toLowerCase() == "success") || (icon.toLowerCase() == "info") ? false : true,
        buttons: buttons.length > 0 ? buttons : null // If buttons length is more than 0, then execute the function 
    }).then(actions => {
        if (actions) {
            if (buttonAction && typeof (buttonAction) === 'function')
                buttonAction(); // Action for the first button from the right.
        } else {
            swal.close();
        }
    });
}

String.prototype.trunc = function (n, useWordBoundary) {
    if (this.length <= n) {
        return this;
    }
    let subString = this.substr(0, n - 1);
    return (useWordBoundary ?
        subString.substr(0, subString.lastIndexOf(' ')) :
        subString) + "&hellip;";
};

if (!Date.now) {
    Date.now = function () {
        return new Date().getTime();
    }
}

Date.prototype.getUnixTime = function () {
    return Date.now() / 1000 | 0
};

if (!Array.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
}

(() => {
    if (location.href.includes('/app/') && !location.href.includes('/signin/out')) {
        console.log("At app")
        userMustHaveAPhoto();
    } else {
        console.log("Not at app")
    }
})();



function userMustHaveAPhoto() {
    let username = $("#activeUser_username").text().trim().split("@")[1];
    let __url = `/app/profile/${username}`;

    $.ajax({
        url: `/app/profile/${username}/mustHavePhotos`,
        method: "GET",
        success: (usersObj) => {
            let photos = usersObj.photos;

            if (photos.length < 1 || photos.length == 0) { // Checks if photos is less than 1 or 0
                if (location.href.includes(__url)) { // Checks if user is at profile page...
                    // If all is true, then alert the below...
                    alert("/lib/img/logo/favicon.png", "Must upload a photo", "Sorry, you are required to upload at least one photo!", [null, location.href.includes(__url) ? "Upload photo" : "Go to profile"], () => {
                        (location.href.includes(__url)) ?
                        $('#addPhotosBtn').trigger('click'): location.href = __url
                    });
                } else location.replace(__url); // if user is not a profile page, redirect them to profile page...
            } else if (photos.length === 1) { // If user has one photo, set it as avatar
                let photoID = photos[0]._id;
                let photoNAME = photos[0].name;
                let checkForProfileImage = document.getElementById("profileImage").style.backgroundImage.includes(photoNAME)
                if (!checkForProfileImage) {
                    $.ajax({
                        url: `/app/profile/update/${username}/setAvatar/${photoID}`,
                        method: "GET",
                        success: () => {
                            if (location.href.includes(__url)) {
                                location.replace(__url);
                                console.log("ProfileImage changed!");
                            } else console.log("ProfileImage not changed!");
                        }
                    });
                }
            }
        }
    });
}
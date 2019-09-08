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

(function () {
    let username = $("#activeUser_username").text().trim().split("@")[1];
    let __url = `/app/profile/${username}`;
    $.ajax({
        url: `/app/profile/${username}/mustHavePhotos`,
        method: "GET",
        success: (usersObj) => {
            let photos = usersObj.photos;

            // Checks if user has any photo, if true continue else redirect to profile page
            if (photos.length < 1) {
                if (location.href.includes(__url)) {
                    alert("/lib/img/logo/favicon.png", "Must upload a photo", "Sorry, you are required to upload at least one photo!", [null, location.href.includes(__url) ? "Upload photo" : "Go to profile"], () => {
                        (location.href.includes(__url)) ?
                        $('#addPhotosBtn').trigger('click'): location.href = __url
                    });
                } else location.replace(__url);
            }

            // Set the first image as default avatar is photos length is <= 1
            if (photos.length == 1) {
                let photoID = photos[0]._id;
                let photoNAME = photos[0].name;
                $.ajax({
                    url: `/app/profile/update/${username}/setAvatar/${photoID}`,
                    method: "GET",
                    success: (htmlResult) => {
                        if (location.href.includes(__url)) {
                            var checkForProfileImage = document.getElementById("profileImage").style.backgroundImage.includes(photoNAME);
                            if (!checkForProfileImage) {
                                location.replace(__url);
                                console.log("Profile not changed!");
                            }
                        }
                    }
                });
            }
        },
    });

    // Send message onclick of [data-messenger-btn="messengerBtn"]
    $('data-messenger-btn="messengerBtn"').click((e) => {

    });
})();
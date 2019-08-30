// show quickMessagePopUp
function quickMessagePopUp() {
    let sendAMessageBtn = $("#sendAMessage");
    sendAMessageBtn.click(() => {
        $(".overlayNav").css({
            "background-color": "#00000066"
        });
        $(".quickMessagePopUp").css({
            "bottom": "-10%"
        }).show(300);
    });

    // Close on Click 'x' button
    $('#closeQuickMessagePopUp').click(() => {
        $(".quickMessagePopUp textarea").val("");
        $(".overlayNav").css({
            "background-color": "transparent"
        });
        $(".quickMessagePopUp").css({
            "bottom": "-50%"
        }).hide(500);
    });
}
quickMessagePopUp();

// navigate Images in Encounters
function navigateImages() {

    // Next photo function
    function nextPhoto(currentTarget) {
        console.log(currentTarget)
    }

    // Previous photo function
    function previousPhoto(currentTarget) {
        console.log(currentTarget)
    }

    function onArrowClick() { // When user click on the arrow button this function fires

    }
    onArrowClick();

    function onKeyboardArrowHit() { // When the user hit the RIGHT or LEFT KEYBOARD ARROWS this function fires
        let renderUserPhotos = document.querySelector('.renderUserPhotos');
        $(renderUserPhotos).keyup((e) => {
            let quickMessagePopUp = document.querySelector('.encounter-page-send-message');
            if (e.target != quickMessagePopUp) {
                if (e.keyCode == 37) { // Left Arrow
                    previousPhoto(e.target);
                } else if (e.keyCode == 39) { // Right Arrow
                    nextPhoto(e.target);
                }
            }
        });
    }
    onKeyboardArrowHit();
}
navigateImages();

function activeProfileMenu() {
    $(".profileFooter header a.photos").click((e) => {
        $(".profileFooter header a span").removeClass('active');
        $(".profileFooter header a.photos span").addClass('active');
    });

    $(".profileFooter header a.shop").click((e) => {
        $(".profileFooter header a span").removeClass('active');
        $(".profileFooter header a.shop span").addClass('active');
    });
}
activeProfileMenu();


$('.encounter-page-send-chat').submit(function (e) {
    e.preventDefault();
    let user = $("#username").text();
    let message_holder = $('.encounter-page-send-message');
    let messageTxt = message_holder.val();
    // noinspection JSUnusedLocalSymbols
    let message = {
        from: __user,
        to: user,
        type: "chat-message",
        format: "text",
        message: messageTxt,
        sent_at: Date.now(),
    };

    //-- emit --send message
    __socket.emit('chat message', message);

    message_holder.val('');
    return false;
});

$(document).ready(function (e) {
    getAUserAndPhotos();
})

$('.navBottom #like').on('click', function (e) {
    let username = $(".detailsCon #username").text();
    sendLikeOrSkip(username.slice(1), 'like');
})

$('.navBottom #skip').on('click', function (e) {
    let username = $(".detailsCon #username").text();
    sendLikeOrSkip(username.slice(1), 'skip');
})

$('.navBottom #sendCrush').on('click', function (e) {
    let username = $(".detailsCon #username").text();
    addToFavourite(username.slice(1));
})

function getAUserAndPhotos() {
    $.ajax({
        url: "/app/encounters/getUser",
        method: "GET",
        success: (usersObj) => {
            populateEncounter(usersObj.data.user, usersObj.data.photos)
        },
    });
}

function addToFavourite(username) {
    $.ajax({
        url: '/app/encounters/addFavourite',
        data: {
            username: username,
        },
        method: "GET",
        success: (response) => {
            console.log(response)
        },
    });
}

function sendLikeOrSkip(username, type) {
    $.ajax({
        url: '/app/encounters/addLike',
        data: {
            username: username,
            type: type,
        },
        method: "GET",
        success: (usersObj) => {
            populateEncounter(usersObj.data.user, usersObj.data.photos)
        },
    });
}

function populateEncounter(user, photos) {
    renderUserDetails(user);
    renderUserPhotos(photos, "div.renderUserPhotos");
}

function renderUserPhotos(photosArr, placeToInsertImage) {
    // $(placeToInsertImage).html("")
    let totalPhotos = $("#totalPhotos").html(photosArr.length); // Total photos count
    let currentPhoto = $("#currentPhoto").html("1"); // Current photos count
    photosArr = photosArr.reverse();
    for (let i = 0; i < photosArr.length; i++) {
        const photo = photosArr[i];
        $($.parseHTML("<img>"))
            .attr({
                src: photo.location,
                style: "margin: auto 0%",
                class: "userDisplayedPhoto",
                alt: "Photo"
            })
            .prependTo(placeToInsertImage)
            .wrap(`<div class="userDisplayedPhotoCon" id="${i}"></div>`);
    }
}

function renderUserDetails(user) {
        // Assign values to the letiables
        let fullname = user.name;
        let username = user.username;
        let age = calculateAge(user.dob);

        let bio = user.personalInfo.bio;
        let height = user.personalInfo.height;
        let language = user.personalInfo.language;
        let _location = user.personalInfo.location;
        // let userdirectorieslocation = user.userdirectorieslocation;

        // Assign letiables to html tags
        $("span#fullname").text(`${fullname}`);
        $("#age").text(`${age}`);
        $("#username").text(`@${username}`).attr({
            "title": `Visit ${fullname}'s profile`,
            "href": `/app/profile/${username}`
        });
        $("#bio").html(`${bio}`);
        $("#height").html(`${height}`);
        $("#language").html(`${language}`);
        $("#location").html(`${_location}`);
}

function calculateAge(dob) {
   return Math.abs(moment(dob).diff(moment(), 'years'));
}
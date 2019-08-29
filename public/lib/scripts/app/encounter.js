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

// Encounter Displaying and Shuffling
function encounterDisplayingAndShuffling() {
    if (location.href.toLowerCase().includes("encounters")) {
        function activeProfileClass() {
            let elem = $(".statusBar a").get(0);
            return $(elem).addClass("activeProfile hasStories");
        }
        activeProfileClass();
    }

    function getUsersDetails() {
        $.ajax({
            url: "/app/encounters/getUsers",
            method: "GET",
            success: (usersObj) => {
                for (const i in usersObj) {
                    if (usersObj.hasOwnProperty(i)) {
                        const usersArr = usersObj[i];
                        usersArr.forEach(user => {
                            // console.log("User: ", user);
                        });
                    }
                }
            },

        });
    }

    function displayUserDetails() {
        if (location.href.toLowerCase().includes("encounters")) {
            let activeUserValue;
            activeUserValue = activeProfileClass().context.dataset; // collected all value from the active user.
            // Assign values to the letiables
            let fullname = activeUserValue.fullname;
            let username = activeUserValue.username;
            let age = activeUserValue.age;
            let bio = activeUserValue.bio;
            let height = activeUserValue.height;
            let language = activeUserValue.language;
            let _location = activeUserValue.location;
            let userdirectorieslocation = activeUserValue.userdirectorieslocation;

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
            getUsersDetails(); // Show all users details for now -- Update in the future
            getUserPhotos(username, userdirectorieslocation); // Get displayed user's photos...
        }
    }
    displayUserDetails();

    function getUserPhotos(username) {
        $.ajax({
            url: `/app/encounters/getUserPhotos/${username}`,
            method: "GET",
            success: (photosObj) => {
                for (const i in photosObj) {
                    if (photosObj.hasOwnProperty(i)) {
                        const photosArr = photosObj[i];
                        renderUserPhotos(photosArr, "div.renderUserPhotos")
                    }
                }
            },

        });

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
    }
}
encounterDisplayingAndShuffling();

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
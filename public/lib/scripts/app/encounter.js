
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
    $('div.imageWindow').keyup((e) => {
        if (e.keyCode == 37) { // Left Arrow
            alert("Left Arrow");
        } else if (e.keyCode == 39) { // Right Arrow
            alert("Right Arrow");
        }
    });
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
            success: (users) => {
                let usersDetails = users;
                console.log(usersDetails);

            },

        });
    }

    function displayUserDetails() {
        if (location.href.toLowerCase().includes("encounters")) {
            let activeUserValue;
            activeUserValue = activeProfileClass().context.dataset; // collected all value from the active user.
            // Assign values to the variables
            let fullname = activeUserValue.fullname;
            let username = activeUserValue.username;
            let age = activeUserValue.age;
            let bio = activeUserValue.bio;
            let height = activeUserValue.height;
            let language = activeUserValue.language;
            let _location = activeUserValue.location;
            let userDirectorieslocation = activeUserValue.userDirectorieslocation;

            // Assign variables to html tags
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
            // console.log(`Values: \nBio: ${bio}\nHeight: ${height}\nLanguage: ${language}\n location: ${_location}`);
        }
        getUsersDetails();

    }
    displayUserDetails();
}
encounterDisplayingAndShuffling();

$('.encounter-page-send-chat').submit(function(e){
    e.preventDefault();
    let user =  $("#username").text(); //$('#encounter-page-send-message').data('sender-user');
    let message_holder = $('.encounter-page-send-message');
    let messageTxt = message_holder.val();
    // noinspection JSUnusedLocalSymbols
    let message = {
        __id: new Date().getUnixTime(),
        from: __user,
        to: user,
        type: "chat-message",
        format: "text",
        message : messageTxt,
        sent_at : Date.now(),
    };

    //-- emit --send message
    __socket.emit('chat message', message);

    message_holder.val('');
    return false;
});
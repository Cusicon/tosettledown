// show quickMessagePopUp
(function quickMessagePopUp() {
        let sendAMessageBtn = $("#sendAMessage");
        sendAMessageBtn.click(() => {
            $(".overlayNav").css({
                "background-color": "#00000066"
            });
            $(".quickMessagePopUp").css({
                "bottom": "-10%"
            }).show(300);
        });

        // Close on Clicking outside the popUp 
        $('.navMiddle').click(() => {
            $(".quickMessagePopUp textarea").val("");
            $(".overlayNav").css({
                "background-color": "transparent"
            });
            $(".quickMessagePopUp").css({
                "bottom": "-50%"
            }).hide(500);
        }).scroll(() => {
            $(".quickMessagePopUp textarea").val("");
            $(".overlayNav").css({
                "background-color": "transparent"
            });
            $(".quickMessagePopUp").css({
                "bottom": "-50%"
            }).hide(500);
        });
    }
)();

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

    if (user.slice(1) === 'N/A') {
        return false;
    } else {
        let message_holder = $('.encounter-page-send-message');
        let messageTxt = message_holder.val().trim();
        if (messageTxt.length > 0) {
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

            /*
             * listen for Acknowledgment notification from the serve when you send a message,
             */
            __socket.on(`${__user} acknowledge`, function (msg) {
                mySnackbar('Message sent');
                message_holder.val('');
            });
        } else {
            mySnackbar('Message cannot be empty');
            message_holder.val('');
        }
        return false;
    }
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
    if (username === 'N/A') {
        return false;
    } else {
        $.ajax({
            url: '/app/encounters/addFavourite',
            data: {
                username: username,
            },
            method: "GET",
            success: (response) => {
                mySnackbar(response.data.message)
            },
        });
    }
}

function sendLikeOrSkip(username, type) {
    if (username === 'N/A') {
        return false;
    } else {
        $.ajax({
            url: '/app/encounters/addLikeAndOneUser',
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



}

function populateEncounter(user, photos) {
    renderUserDetails(user);
    renderUserPhotos(photos, "div.renderUserPhotos");
}

function renderUserPhotos(photos, placeToInsertImage) {

    if (photos && photos.length > 0) {
        $(placeToInsertImage).html("")
        $("#totalPhotos").html(photos.length); // Total photos count
        $("#currentPhoto").html("1"); // Current photos count

        photos.forEach((photo, index) => {
            $($.parseHTML("<img>"))
                .attr({
                    src: photo.location,
                    style: "margin: auto 0%",
                    class: "userDisplayedPhoto",
                    alt: "Photo"
                })
                .prependTo(placeToInsertImage)
                .wrap(`<div class="userDisplayedPhotoCon" id="${index}"></div>`);
        })
    } else {
        $("#totalPhotos").html('0'); // Total photos count
        $("#currentPhoto").html("0"); // Current photos count

        $(placeToInsertImage).html(`
            <div class="userDisplayedPhotoCon" id="0">
                <img src="/lib/img/logo/favicon.png" style="margin: auto 0%; opacity: 0.5; visibility: hidden !important;" class="userDisplayedPhoto" alt="Photo">
            </div>
        `)
    }
}

function renderUserDetails(user) {
    // Assign values to the letiables
    let fullname = (user) ? user.name.split(" ")[0] : 'N/A';
    let username = (user) ? user.username : 'N/A';
    let age = (user && user.dob) ? calculateAge(user.dob) : 'N/A';

    let bio = (user) ? user.personalInfo.bio : 'N/A';
    let height = (user) ? user.personalInfo.height : 'N/A';
    let language = (user) ? user.personalInfo.language : 'N/A';
    let _location = (user) ? user.personalInfo.location : 'N/A';
    let relationship = (user) ? user.personalInfo.relationship : 'N/A';
    let href = (user) ? `/app/profile/${username}` : '#'

    // Assign letiables to html tags
    $("span#fullname").text(`${fullname}`);
    $("#age").text(`${age}`);
    $("#username").text(`@${username}`).attr({
        "title": `Visit ${fullname}'s profile`,
        "href": `${href}`
    });
    $("#bio").html(`${bio}`);
    $("#height").html(`${height}`);
    $("#language").html(`${language}`);
    $("#location").html(`${_location}`);
    $("#relationship").html(`${relationship}`);
}

function calculateAge(dob) {
    return Math.abs(moment(dob).diff(moment(), 'years'));
}

$('#next, #previous').on("click", function () {
    scrollImg(($(this).attr('id') === 'next') ? 'next' : 'previous')
})

$(function () {
    $('.navMiddle').swipe({
        swipeLeft: function () {
            scrollImg('next')
        },
        swipeRight: function () {
            scrollImg('previous')
        },
    });
});

$(document).on('keyup', function (e) {
    let key = e['keyCode'];
    let quickMessagePopUp = document.querySelector('.encounter-page-send-message');
    if (e.target != quickMessagePopUp) {
        if (key === 39 || key === 37) {
            scrollImg((key === 39) ? 'next' : 'previous');
        }
    }
})

$(window).resize(function () {
    let currentPhotoElement = $('#currentPhoto');
    let currentPhoto = parseInt(currentPhotoElement.text());
    let renderBox = $('.renderUserPhotos');
    let imgSize = parseInt(renderBox.width());
    renderBox.animate({
        scrollLeft: (imgSize * currentPhoto) - imgSize
    }, 0);
});

function scrollImg(type) {
    let currentPhotoElement = $('#currentPhoto');
    let currentPhoto = parseInt(currentPhotoElement.text());
    let totalPhoto = parseInt($('#totalPhotos').text());
    let renderBox = $('.renderUserPhotos');
    let imgSize = parseFloat(window.getComputedStyle(renderBox.get()[0]).width);

    if (type === 'next') {

        if (currentPhoto !== totalPhoto) {
            let nextPosition = currentPhoto + 1;
            renderBox.animate({
                scrollLeft: (imgSize * nextPosition) - imgSize
            }, 300);
            currentPhotoElement.text(nextPosition)
        }

    } else {
        if (currentPhoto > 1) {
            let prevPosition = currentPhoto - 1;
            renderBox.animate({
                scrollLeft: (imgSize * prevPosition) - imgSize
            }, 300);
            currentPhotoElement.text(prevPosition)
        }
    }
}
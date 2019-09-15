/*
 * BEGIN GLOBAL VARIABLE CONFIGURATION HERE
 */
// noinspection JSUnresolvedFunction
const __socket = io(); //-- Initialize Socket For All Pages
const __user = $("#activeUser_username b").text();

/*
 * ENDS GLOBAL VARIABLE CONFIGURATION HERE
 */

// Close any popUp, by hitting 'Esc' button
function closeOnEscBtn() {
    // Close on Hit 'Esc' button
    $('body').keyup((e) => {
        if (e.keyCode == 27) { // Escape key
            $(".popUp textarea").val("");
            $(".overlayNav").css({
                "background-color": "transparent"
            });
            $(".popUp").css({
                "bottom": "-50%"
            }).hide();
        }
    });
}
closeOnEscBtn();

// When click any where on the window the pop-up, modal or dropdown closes.
function onclickWindow(clickedBtn, containerClass) {
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (e) {
        // Close the dropdown menu if the user clicks outside of it
        if (e.target != clickedBtn) {

            let dropdowns = document.getElementsByClassName(containerClass);
            let i;
            for (i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
}

// Shows any dropdown that exists.
function showDropdown() {
    // DROPDOWN CODE...
    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    $("#dropBtn").click((e) => {
        e.preventDefault();
        dropdownFunction()
    });

    if (document.getElementById("dropBtn") != null) {
        let dropBtn = document.getElementById("dropBtn").children.item(0);
        let dropdownContent = document.getElementById("dropdownContent");

        // Close the dropdown menu if the user clicks outside of it
        onclickWindow(dropBtn, "dropdownContent");
    }

    function dropdownFunction() {
        dropdownContent.classList.toggle("show");
        // Close any popUp, by hitting 'Esc' button
        $('body').keyup((e) => {
            if (e.keyCode === 27) { // Escape key
                dropdownContent.classList.remove("show");
            }
        });
    }
}
showDropdown();

/* Requesting Desktop Notification */
// (function requestWebDesktopNotificationPermission() {
//     if (window.Notification) {
//         Notification.requestPermission().then(function (status) {
//             if (status != "granted") {
//                 console.log(`Notification ${status}!`);
//                 alert("/lib/img/logo/favicon.png",
//                     "Turn on Notifications",
//                     "Know right away when people follow you or like and comment on your photos.",
//                     ["Cancel", "Turn on"],
//                     () => {
//                         // Request Permission again
//                         if (window.Notification) {
//                             Notification.requestPermission().then(function (status) {})
//                         }
//                     }
//                 );
//             } else {
//                 console.log(`Notification ${status}!`);
//             }
//         });
//     } else {
//         //-- snackbar here
//         alert("/lib/img/logo/favicon.png", "Turn on Notifications", "Sorry, your browser doesn\'t support notifications", [null, "Close"]);
//     }
// })();

$(document).on('ready', () => {
    let page_name = $('.page-identifier').data('page-name');
    if (page_name !== 'chat') {
        /*
         * listen for message on your own channel, will appear in all pages except chat Page
         */
        __socket.on(`${__user} message`, function (msg) {
            let options = {
                body: msg.message, // body part of the notification
                dir: 'ltr', // use for direction of message
                icon: '/lib/img/logo/favicon.png' // use for show image
            };
            let audio = new Audio('/lib/media/notify.mp3');
            audio.play().then(() => {
                new Notification(msg.from, options);
            });
        });
    }
});
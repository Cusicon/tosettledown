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


function onclickWindow(clickedBtn, containerClass) {
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (e) {
        // Close the dropdown menu if the user clicks outside of it
        if (e.target != clickedBtn) {

            var dropdowns = document.getElementsByClassName(containerClass);
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
}

function showDropdown() {
    // DROPDOWN CODE...
    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    $("#dropBtn").click((e) => {
        e.preventDefault();
        dropdownFunction()
    });

    if (document.getElementById("dropBtn") != null) {
        var dropBtn = document.getElementById("dropBtn").children.item(0);
        var dropdownContent = document.getElementById("dropdownContent");
    }

    function dropdownFunction() {
        dropdownContent.classList.toggle("show");
        // Close any popUp, by hitting 'Esc' button
        $('body').keyup((e) => {
            if (e.keyCode == 27) { // Escape key
                dropdownContent.classList.remove("show");
            }
        });
    }

    // Close the dropdown menu if the user clicks outside of it
    onclickWindow(dropBtn, "dropdownContent");
}
showDropdown();

/* Requesting Desktop Notification */
(function requestWebDesktopNotificationPermission() {
    if (window.Notification) {
        Notification.requestPermission().then(function (status) {
            if (status === "denied") {
                // alert('error','error','You Disable Notifications For TSD, you wont be able to receive notification of incoming chat');
            }
        });
    } else {
        // alert('Your browser doesn\'t support notifications.');
    }
})();

$(document).on('ready', () => {
    var page_name = $('.page-identifier').data('page-name');
    if (page_name !== 'chat') {
        /*
         * listen for message on your own channel, will appear in all pages except chat Page
         */
        __socket.on(`${__user} message`, function (msg) {
            var options = {
                body: msg.message, // body part of the notification
                dir: 'ltr', // use for derection of message
                icon: '/lib/img/logo/favicon.png' // use for show image

            };
            var audio = new Audio('/lib/media/notify.mp3');
            audio.play().then(() => {
                new Notification(msg.from, options);
            });
        });

        // console.log(Math.round(new Date().getTime() / 1000));
    }
});
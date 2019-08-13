$(document).on('ready', () => {

    let arrayMeetup = [];

    (function () {

        let page_name = $('.page-identifier').data('page-name');
        if (page_name === 'chat') {
            /*
             * listen for message on your own channel, will appear in all pages except chat Page
             */
            socket.on(__user, function (msg) {
                let options = {
                    body: msg.message, // body part of the notification
                    dir: 'ltr', // use for direction of message
                    icon: '/lib/img/logo/favicon.png' // use for show image

                };
            });
        }

        getMeetups();

    })();


    function getMeetups() {
        $.ajax({
            url: "/app/meetups",
            method: "GET",
            success: (data) => {
                data.meetups.forEach((encounter) => {
                    arrayMeetup[encounter.associate.username] = {
                        user_detail: encounter.associate,
                        chat: encounter.meetup.chats,
                    };
                });
                //(unix_timestamp*1000);
                console.log(arrayMeetup);
            },
        });
    }

});


(function init () {
    let observe;
    if (window.attachEvent) {
        observe = function (element, event, handler) {
            element.attachEvent('on'+event, handler);
        };
    }
    else {
        observe = function (element, event, handler) {
            element.addEventListener(event, handler, false);
        };
    }

    let text = document.getElementById('message-input');
    function resize () {
        text.style.height = 'auto';
        text.style.height = text.scrollHeight+'px';
    }
    /* 0-timeout to get the already changed text */
    function delayedResize () {
        window.setTimeout(resize, 0);
    }
    observe(text, 'change',  resize);
    observe(text, 'cut',     delayedResize);
    observe(text, 'paste',   delayedResize);
    observe(text, 'drop',    delayedResize);
    observe(text, 'keydown', delayedResize);

    text.focus();
    text.select();
    resize();
})();
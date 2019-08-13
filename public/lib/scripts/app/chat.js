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
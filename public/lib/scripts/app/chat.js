$(document).on('ready', () => {

    window.arrayUser = [];
    window.arrayChats = [];
    window.arrayNewMsg = [];
    window.unresolvedMsg = [];
    window.activeChat = null;
    window.chatListHolder = null;



    (function () {

        let page_name = $('.page-identifier').data('page-name');
        if (page_name === 'chat') {
            /*
             * listen for message on your own channel, will appear in all pages except chat Page
             */
            __socket.on(__user, msg => {
                arrayNewMsg.push(msg);

                // let options = {
                //     body: msg.message, // body part of the notification
                //     dir: 'ltr', // use for direction of message
                //     icon: '/lib/img/logo/favicon.png' // use for show image
                //
                // };
            });
        }

        window.chatListHolder = $('#chat-list-holder');
        getActiveChat()
        getMeetups();

    })();

    function getActiveChat() {
        let url_string = window.location.href;
        let url = new URL(url_string);
        window.activeChat = url.searchParams.get("user");
    }
    
    function getMeetups() {
        $.ajax({
            url: "/app/meetups",
            method: "GET",
            success: (data) => {
                data.meetups.forEach((encounter, index) => {

                    if(index === 0)
                    {
                        window.activeChat = (activeChat !== null)? activeChat : encounter.associate.username;
                    }

                    arrayUser[encounter.associate.username] = encounter.associate;
                    arrayChats[encounter.associate.username] = encounter.meetup.chats;

                    if(index === data.meetups.length -1)
                    {
                        window.chatListHolder.find('.lazy-box-group').fadeOut(750);
                        populateWindowChat(activeChat)
                    }
                    window.chatListHolder.prepend(buildChatUserList(encounter.associate, encounter.meetup));
                });
                //(unix_timestamp*1000);


                //Fire Resolver
            },
        });
    }

});


function buildChatUserList(associate, meetup)
{
    let is_online = (getLastActivity(associate.last_activity_at)) ? 'is-online' : 'is-offline'; //last_activity_at
    let time = moment(getLastChat(meetup.chats).sent_at).fromNow(); //last_activity_at
    let last_msg = getLastChat(meetup.chats).message;

    let dataHtml = `
            <li class="user">
            <div class="image-holder">
                <div class="status ${is_online}"></div>
                <div class="profile-img" style="background-image: url('/lib/img/assets/reduced/female.png')"></div>
            </div>
            <div class="message-holder">
                <div class="time text-muted">${time}</div>
                <div class="username text-dark">${associate.username}</div>
                <div class="latest-message text-muted">${last_msg}</div>
            </div>
        </li>
        `;

    return dataHtml;
}





function populateWindowChat(username)
{
    let chats = window.arrayChats[username];
    let chats_list_box = $('.chat-message-list');

    chats_list_box.find('.lazy-box-demo').remove();

    chats.forEach(chat => {
        chats_list_box.append(buildChat(chat));
    });
}


function buildChat(chat)
{
    let is_outbox_or_inbox = (chat.from !== `@${__user}`)? 'inbox' : 'outbox';

    let chatbox = `
         <li class="${is_outbox_or_inbox}">
            <div class="">
                <span class="message">${chat.message}</span>
                <span class="time">${moment(chat.sent_at).fromNow()}</span>
            </div>
        </li>
    `;

    return chatbox;
}












function getLastActivity(last_activity) {

    let lastActivitySec = moment(last_activity).second();
    let lastNowSec = moment().second();
    let diffSec = lastNowSec - lastActivitySec;
    return (diffSec <= 120);
}

function getLastChat(chats) {
    return chats[chats.length - 1];
}


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
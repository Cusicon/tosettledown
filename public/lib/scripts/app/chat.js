$(document).on('ready', () => {

    window.arrayUser = [];
    window.arrayChats = [];
    window.arrayNewMsg = [];
    window.unresolvedMsg = [];
    window.activeChat = null;
    window.chatListHolder = null;

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

    (function () {

        var page_name = $('.page-identifier').data('page-name');
        if (page_name === 'chat') {

            /*
             * listen for message on your own channel, will appear in all pages except chat Page
            */
            __socket.on(`${__user} message`, msg => {
                __socket.emit('chat received', msg);
                arrayNewMsg.push(msg);

                // var options = {
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
        var url_string = window.location.href;
        var url = new URL(url_string);
        window.activeChat = url.searchParams.get("user");
    }

    function getMeetups() {
        $.ajax({
            url: "/app/meetups",
            method: "GET",
            success: (data) => {

                data.meetups.forEach((meetup, index) => {
                    let meetup_id = meetup._id;

                    let meetupObj = data.meetup_obj.find(function(meetupobj) {
                        				return meetupobj.id === meetup_id;
                        			});


                    if(index === 0)
                    {
                        window.activeChat = (activeChat !== null)? activeChat : meetupObj.associate.username;
                    }

                    arrayUser[meetupObj.associate.username] = meetupObj.associate;
                    arrayChats[meetupObj.associate.username] = meetupObj.chats;

                    if(index === data.meetups.length -1)
                    {
                        window.chatListHolder.find('.lazy-box-group').fadeOut(750);
                        populateWindowChat(activeChat)
                    }
                    window.chatListHolder.prepend(buildChatUserList(meetupObj.associate, meetupObj.chats));
                });
                //(unix_timestamp*1000);


                //Fire arrayNewMsg Resolver
            },
        });
    }

});


function buildChatUserList(associate, chats)
{
    var is_online = (getLastActivity(associate.last_activity_at)) ? 'is-online' : 'is-offline'; //last_activity_at
    var time = moment(getLastChat(meetup.chats).sent_at).fromNow(); //last_activity_at
    var last_msg = getLastChat(meetup.chats).message;

    return `
        <li id='${associate.username.toLowerCase()}-chat-listing' class="user user-chat-listing">
            <div class="image-holder">
                <div class="status ${is_online}"></div>
                <div class="profile-img" style="background-image: url('/lib/img/assets/reduced/user.png')"></div>
            </div>
            <div class="message-holder">
                <div class="time text-muted">${time}</div>
                <div class="username text-dark">${associate.username}</div>
                <div class="latest-message text-muted">${last_msg.trunc(30)}</div>
                <div class="communication-status"></div>
            </div>
        </li>
        `;
}

function populateWindowChat(username)
{

    var chats = window.arrayChats[username];
    var chats_list_box = $('.chat-message-list');
    var user = window.arrayUser[username]
    var is_online = (getLastActivity(user.last_activity_at)) ? 'is-online' : 'is-offline'; //last_activity_at

    $('#chat-status').removeClass('lazy-box-loader').addClass(is_online)
    $('#chat-username-holder').text(username).removeClass('lazy-box-loader');
    $('#chat-typing').removeClass('lazy-box-loader');
    $('#chat-profile-img').removeClass('lazy-box-loader').css('background-image',`url('/lib/img/assets/reduced/user.png')`);

    chats_list_box.find('*').remove();

    if(chats){
        chats.forEach(chat => {
            chats_list_box.append(buildChat(chat));
        });
    }
    else
    {

    }
}

function buildChat(chat)
{
    let is_outbox_or_inbox = (chat.from !== `${__user}`)? 'inbox' : 'outbox';
    let message_staus = null;

    if(is_outbox_or_inbox === 'outbox'){
        if(chat.sent_at) { message_staus = `<i class="fa fa-check fa-1"></i>`; }
        if(chat.delivered_at) { message_staus = `<i class="fa fa-check fa-1"></i><i class="fa fa-check fa-1"></i>`; }
        if(chat.read_at) { message_staus = `<i style="color: orange" class="fa fa-check fa-1"></i> <i style="color: orange" class="fa fa-check fa-1"></i>`; }
    }

    return `
         <li class="${is_outbox_or_inbox}">
            <div class="">
                <span class="message">${chat.message}</span>
                <span class="time">${moment(chat.sent_at).fromNow()} ${message_staus}</span>
            </div>
        </li>
    `;
}












function getLastActivity(last_activity) {

    if(last_activity){
        var diffSec = Math.abs(moment(last_activity).diff(moment(), 'seconds'))
        return (diffSec <= 120);
    }
    return false;

}

function getLastChat(chats) {
    return chats[chats.length - 1];
}


(function init () {
    var observe;
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

    var text = document.getElementById('message-input');
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


$(document).on('click', '.user-chat-listing', function(e) {
    let element = $(this);
    let username = element.find('.username').text();
    if(username)
    {
        // $(this).parent().prepend($(this));
        window.activeChat = username;
        populateWindowChat(username);
    }
});


/*
* Sending Typing... notification,
*/
$("#message-input").on('keyup',function(e) {
    var message = {
        from: __user,
        to: `@${window.activeChat}`,
        type: "composing",
    };

    //-- emit --send message
    __socket.emit('chat composing', message);
    return false;
});

/*
* Sending Message
*/
$('#submit-msg').on('click', function(e){
    e.preventDefault();
    let user =  `@${activeChat}`; //$('#encounter-page-send-message').data('sender-user');
    let message_holder = $('#message-input');
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
    console.log(message);

    //-- emit --send message
    __socket.emit('chat message', message);
    message_holder.val('');
    return false;
});


/*
* listen for typing on your own channel,
*/
__socket.on(`${__user} acknowledge`, function (msg) {
    console.log('server got your message')
});

/*
* listen for chat delivered on your channel
*/
__socket.on(`${__user} delivered`, function (msg) {
    console.log('chat delivered')
});


/*
* listen for typing on your own channel,
*/
__socket.on(`${__user} composing`, function (msg) {

    let element = $(`#${msg.from.slice(1).toLowerCase()}-chat-listing`);
    let window_chat = $('.ChatWindow');

    let is_active_chat = (msg.from.slice(1).toLowerCase() === window.activeChat.toLowerCase());

    if(is_active_chat)
    {
        window_chat.find('#chat-typing').text('typing...')
    }
    else
    {
        element.find('.communication-status').text('typing...')
    }

    setTimeout(function(){

        if(is_active_chat)
        {
            window_chat.find('#chat-typing').text('')
        }
        else
        {
            if(element.find('.communication-status').text() === 'typing...')
                element.find('.communication-status').text('')
        }
    }, 1000);

});

/*
* listen for message on your own channel
*/
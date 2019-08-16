$(document).on('ready', () => {

    window.arrayUser = [];
    window.arrayChats = [];
    window.arrayNewMsg = [];
    window.unresolvedMsg = [];
    window.activeChat = null;
    window.chatListHolder = null;

    (function () {
        window.chatListHolder = $('#chat-list-holder');
        postAjaxSocketListener();
        getActiveChat();
        getMeetups();

    })();

    function getActiveChat() {
        let url_string = window.location.href;
        let url = new URL(url_string);
       return url.searchParams.get("user");
    }

    function getMeetups() {
        let url = (getActiveChat())? `?user=${getActiveChat()}` : '';

        $.ajax({
            url: `/app/meetups${url}`, // send active user also
            method: "GET",
            success: (data) => {
                preAjaxSocketListener()

                if(data.activeChat)
                {
                    window.activeChat = data.activeChat.username
                    arrayUser[data.activeChat.username] = data.activeChat;
                    arrayChats[data.activeChat.username] = [];
                }

                data.meetups.forEach((meetup, index) => {
                    buildUpChat(data, meetup, index);
                });

                //Fire Resolver
                setInterval(newChatResolver,100); //-- resolve new chat from socket
                setInterval(unresolvedChatResolver,100); //-- resolve new chat from socket
            },
        });
    }


    function buildUpChat(data, meetup, index)
    {
        let meetup_id = meetup._id;

        let meetupObj = data.meetup_obj.find(function(meetupObj) {
            return meetupObj.id === meetup_id;
        });

        // Incase Active Chat Is Null
        if(index === 0)
        {
            window.activeChat = (window.activeChat)? window.activeChat : meetupObj.associate.username;
        }

        arrayUser[meetupObj.associate.username] = meetupObj.associate;
        arrayChats[meetupObj.associate.username] = meetupObj.chats;

        if(index === data.meetups.length -1)
        {
            window.chatListHolder.find('.lazy-box-group').fadeOut(750);
            populateWindowChat(activeChat)
        }
        window.chatListHolder.append(buildChatUserList(meetupObj.associate, meetupObj.chats));
    }

    //======================= ! BUILDING THE LAYOUT ==================

    function buildChatUserList(associate, chats) {
        let is_online = (getLastActivity(associate.last_activity_at)) ? 'is_online' : 'is_offline'; //last_activity_at
        let time = moment(chats.last().sent_at).fromNow(); //last_activity_at
        let last_msg = chats.last().message;

        return `
            <li id='${associate.username.toLowerCase()}-chat-listing' data-username="${associate.username.toLowerCase()}" class="user user-chat-listing">
                <div class="image-holder">
                    <div class="status ${is_online}"></div>
                    <div class="profile-img" style="background-image: url('/lib/img/assets/reduced/user.png')"></div>
                </div>
                <div class="message-holder">
                    <div class="time text-muted">${time}</div>
                    <div class="username text-dark" data-username="${associate.username}">${associate.name}</div>
                    <div class="latest-message text-muted">${last_msg.trunc(30)}</div>
                    <div class="communication-status"></div>
                </div>
            </li>
            `;
    }

    function populateWindowChat(username) {

        let chats_list_box = $('.chat-message-list');
        let user = window.arrayUser[username]
        let chats = window.arrayChats[username];
        let is_online = (getLastActivity(user.last_activity_at)) ? 'is_online' : 'is_offline'; //last_activity_at

        //-- user property to dom
        $('#chat-status').removeClass('is_online').removeClass('is_offline').addClass(is_online)
        $('#chat-username-holder').text(username);
        $('#chat-profile-img').css('background-image',`url('/lib/img/assets/reduced/user.png')`);

        chats_list_box.find('*').remove();

        $('.go-back-encounter').css('display','none');
        $('.chat-window-holder').css('display','block');

        if(chats){
            chats.forEach(chat => {
                chats_list_box.append(buildChatMessage(chat));
            })
            let  element = $(".ChatWindowBody");
            element[0].scrollTop = element[0].scrollHeight;
        }
    }

    function buildChatMessage(chat, sending = null) {

        let is_outbox_or_inbox = (chat.from !== `${__user}`)? 'inbox' : 'outbox';
        let message_status = '';

        if(is_outbox_or_inbox === 'outbox'){
            if(chat.sent_at) { message_status = `<i class="fa fa-check fa-1"></i>`; }
            if(chat.delivered_at) { message_status = `<i class="fa fa-check fa-1"></i><i class="fa fa-check fa-1"></i>`; }
            if(chat.read_at) { message_status = `<i style="color: orange" class="fa fa-check fa-1"></i> <i style="color: orange" class="fa fa-check fa-1"></i>`; }
            if(sending) { message_status = `<i class="fa fa-spinner fa-1"></i>`; }
        }

        return `
             <li id="chat-${chat.u_id}" class="${is_outbox_or_inbox}">
                <div class="">
                    <span class="message">${chat.message}</span>
                    <span class="time">${moment(chat.sent_at).fromNow()} <span id="message-status">${message_status}</span></span>
                </div>
            </li>
        `;
    }
    //======================= ! BUILDING THE LAYOUT ==================


    //======================= MINIMAL HELPER FUNCTIONS =============
    function getLastActivity(last_activity) {

        if(last_activity){
            let diffSec = Math.abs(moment(last_activity).diff(moment(), 'seconds'))
            return (diffSec <= 120);
        }
        return false;
    }

    function newChatResolver()
    {
        if(arrayNewMsg.length > 0)
        {
            let msg = arrayNewMsg.shift()

            //user from exist in user array
            if(arrayUser[msg.from.slice(1)])
            {
                //push message to user chat if is active and exist in array
                if(msg.from.slice(1) === activeChat){
                    arrayChats[activeChat].push(msg)
                    let chats_list_box = $('.chat-message-list');
                    chats_list_box.append(buildChatMessage(msg));
                }
                else
                {
                    //-- if user is in chat list else put and prepend to the top
                    arrayChats[activeChat].push(msg);
                    //-- increase user no of message on chat list
                }
            }
            else
            {
                // if not push message to unsolved array
                unresolvedMsg.push(msg);
            }

        }
    }

    function unresolvedChatResolver(){

        if(unresolvedMsg.length > 0)
        {
            let msg = unresolvedMsg.shift()
            let username = msg.from.slice(1)

            $.ajax({
                url: `/app/meetups/getuser?user=${username}`, // send active user also
                method: "GET",
                success: (data) => {
                    preAjaxSocketListener()

                    if(data.user)
                    {
                        arrayUser[data.user.username] = data.user;
                        arrayNewMsg.unshift(msg); //put it back to new Msg for processing
                    }
                },
            });
        }
    }

    function prependToChatList(msg)
    {

    }


    //======================= ! MINIMAL HELPER FUNCTIONS =============


    //======================= EVENT SOCKET EMIT LISTENERS ==================
    /*
    * Sending Typing... notification,
    */
    $("#message-input").on('keyup',function() {
        let message = {
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
            u_id: new Date().getUnixTime(),
            from: __user,
            to: user,
            type: "chat-message",
            format: "text",
            message : messageTxt,
            sent_at : Date.now(),
        };

        //-- emit --send message
        __socket.emit('chat message', message);

        message.delivered_at = null
        message.read_at = null
        message.u_id = message.__id

        arrayChats[activeChat].push(message);
        let chats_list_box = $('.chat-message-list');

        //fa-spinner
        chats_list_box.append(buildChatMessage(message, true));
        message_holder.val('');
        return false;
    });
    //======================= ! EVENT LISTENERS ==================


    //======================= START SOCKET EMIT LISTENERS ==================
    //-- Fire Socket Listener
    function postAjaxSocketListener() {
        //-- SENDING TO SOCKET --//

        /*
        * listen for incoming message on your own channel, and store in array for new chats
        */
        __socket.on(`${__user} message`, msg => {
            __socket.emit('chat received', msg);
            arrayNewMsg.push(msg);
            //-- Resolver Will Do The Appending To DOM

        });

        //-- ! SENDING TO SOCKET --//
    }

    function preAjaxSocketListener()
    {

        //-- RECEIVING FROM SOCKET --//

        /*
        * listen for Acknowledgment notification from the serve when you send a message,
        */
        __socket.on(`${__user} acknowledge`, function (msg) {
            if(msg.to.slice(1) === activeChat){
                let chat = arrayChats[activeChat].find(function(chats) {
                    return chats.__id === msg.__id;
                });
                let chatbox = $(`#chat-${chat.u_id}`);
                chatbox.find('#message-status').html('<i class="fa fa-check fa-1"></i>')
            }
        });

        /*
        * listen for chat delivered notification on your channel for message you sent
        */
        __socket.on(`${__user} delivered`, function (msg) {
            if(msg.to.slice(1) === activeChat){
                let chat = arrayChats[activeChat].find(function(chats) {
                    return chats.__id === msg.__id;
                });
                chat.delivered_at = Date.now();
                let chatbox = $(`#chat-${chat.u_id}`);
                chatbox.find('#message-status').html('<i class="fa fa-check fa-1"></i><i class="fa fa-check fa-1"></i>')
            }
        });

        /*
        * listen for typing notification on your own channel,
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

        //-- ! RECEIVING FROM SOCKET --//


    }
    //======================= ! START SOCKET LISTENERS ==================

    $(document).on('click', '.user-chat-listing', function() {
        let element = $(this);
        let username = element.find('.username').data('username');
        if(username)
        {
            // $(this).parent().prepend($(this));
            window.activeChat = username;
            populateWindowChat(username);
        }
    });

});
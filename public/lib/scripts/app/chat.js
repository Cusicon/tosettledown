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
                    window.arrayUser[data.activeChat.username] = data.activeChat;
                    window.arrayChats[data.activeChat.username] = [];
                }

                //Sort User MeetUps To User Array and Chat Array
                data.meetups.forEach((meetup, index) => {
                    let meetupObj = data.meetup_obj.find(function(meetupObj) {
                        return meetupObj.id === meetup._id;
                    });
                    //-- Setting Window Active In case Active Chat Is Null
                    if(index === 0)
                    {
                        window.activeChat = (window.activeChat)? window.activeChat : meetupObj.associate.username;
                    }
                    arrayUser[meetupObj.associate.username] = meetupObj.associate;
                    arrayChats[meetupObj.associate.username] = meetupObj.chats;
                });

                //Sort ChatList To Dom, Putting User To Dom
                populateChatUserList()
                // Put Active User On windowChatDiv
                populateWindowChat()

                //Fire Resolver
                setInterval(newChatResolver,100); //-- resolve new chat from socket
                setInterval(unresolvedChatResolver,100); //-- resolve new chat from socket
            },
        });
    }





    //======================= BUILDING THE LIST LAYOUT ==================

    function populateChatUserList() {
        window.chatListHolder.find('.lazy-box-group').fadeOut(750);

        if(Object.keys(arrayUser).length > 0)
        {
            Object.values(arrayUser).forEach(function(associate) {
                window.chatListHolder.append(buildChatUserList(associate, arrayChats[associate.username].last()));
            });
        }
        else {
            // Put Display Message Of No Chat
            window.chatListHolder.append(`<li>No Chat</li>`);
        }
    }

    function buildChatUserList(associate, chat) {
        let is_online = (getLastActivity(associate.last_activity_at)) ? 'is_online' : 'is_offline'; //last_activity_at
        let time = (chat) ? moment(chat.sent_at).fromNow() : ''; //last_activity_at
        let last_msg = (chat) ? chat.message : '';
        let unread = 4;
        let comm_stat = `<span class="badge">${unread}</span>`;

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
                    <div class="communication-status" data-unread-msg="${unread}">${comm_stat}</div>
                </div>
            </li>
            `;
    }

    //======================= ! BUILDING THE LIST LAYOUT ==================




    //======================= BUILDING THE MESSAGE LAYOUT ==================

    function populateWindowChat(username = null) {
        username = (username)? username : activeChat;

        if (username) {
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
    //======================= ! BUILDING THE MESSAGE LAYOUT ==================







    //======================= MINIMAL HELPER FUNCTIONS =============
    function getLastActivity(last_activity) {

        if(last_activity){
            let diffSec = Math.abs(moment(last_activity).diff(moment(), 'seconds'))
            return (diffSec <= 120);
        }
        return false;
    }

    function newChatResolver() {

        if(arrayNewMsg.length > 0)
        {
            let msg = arrayNewMsg.shift()

            //user from exist in user array
            if(arrayUser[msg.from.slice(1)])
            {
                let user = msg.from.slice(1);
                arrayChats[user].push(msg)

                let userChatListDom = $(`#${user.toLowerCase()}-chat-listing`);

                console.log(userChatListDom);

                if(userChatListDom.length)
                {
                    //message
                    userChatListDom.find('.latest-message').text(`${msg.message.trunc(30)}`);
                    //time
                    userChatListDom.find('.time').text(`${moment(msg.sent_at).fromNow()}`);
                    userChatListDom.parent().prepend(userChatListDom);
                }else {
                    //append him to the dom
                    window.chatListHolder.append(buildChatUserList(arrayUser[user],  msg));
                }

                //push message to user chat if is active and exist in array
                if(msg.from.slice(1) === activeChat){

                    $('.chat-message-list').append(buildChatMessage(msg));
                }
                else
                {

                    //-- increase user no of message on chat list, do increase badge here


                    //-- if user is in chat list else put and prepend to the top


                    //-- if user list exist
                        //-- increase user no of message on chat list, do increase badge here
                        //-- change last msg and time on the chatList
                    //--else
                        //-- build and prepend the user to chatList

                }



                //-- change last msg and time on the chatList




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
                        arrayChats[data.user.username] = [];
                        arrayNewMsg.unshift(msg); //put it back to new Msg for processing
                    }
                },
            });
        }
    }

    function prependToChatList(msg)
    {

    }

    function updateMsg(msg)
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
        let toUser = activeChat;
        let user =  `@${toUser}`; //$('#encounter-page-send-message').data('sender-user');
        let message_holder = $('#message-input');
        let messageTxt = message_holder.val();

        if(messageTxt.trim() !== ''){
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

            arrayChats[toUser].push(message);
            $('.chat-message-list').append(buildChatMessage(message, true));
            message_holder.val('');
        }

        return false;
    });

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

    //======================= ! EVENT LISTENERS ==================


    //======================= START SOCKET ACTIVITY ==================

    function postAjaxSocketListener() {

        /*
        * listen for incoming message on your own channel, and store in array for new chats
        */
        __socket.on(`${__user} message`, msg => {
            __socket.emit('chat received', msg);
            arrayNewMsg.push(msg);
        });
    }



    function preAjaxSocketListener() {

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

            let is_active_chat = msg.from.slice(1).toLowerCase() === ((window.activeChat)? window.activeChat.toLowerCase() : null )

            if(is_active_chat) {

                window_chat.find('#chat-typing').text('typing...')
            }
            else
            {
                element.find('.communication-status').text('typing...')
            }

            //-- To Remove typing .....
            setTimeout(function(){
                if(is_active_chat)
                {
                    window_chat.find('#chat-typing').text('')
                }
                else
                {
                    let comm_stat = element.find('.communication-status');
                    if(comm_stat.text() === 'typing...'){

                        if(parseInt(comm_stat.data('unread-msg')) > 0 ){
                            comm_stat.text(`<span class="badge">${comm_stat}</span>`)
                        }
                        else {
                            comm_stat.text('')
                        }
                    }
                }
            }, 1000);

        });
    }

    //======================= ! START SOCKET ACTIVITY ==================
});
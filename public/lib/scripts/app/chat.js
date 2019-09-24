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
        let url = (getActiveChat()) ? `?user=${getActiveChat()}` : '';

        $.ajax({
            url: `/app/meetups${url}`, // send active user also
            method: "GET",
            success: (data) => {
                preAjaxSocketListener()

                if (data.activeChat) {
                    window.activeChat = data.activeChat.username
                    window.arrayUser[data.activeChat.username] = data.activeChat;
                    window.arrayChats[data.activeChat.username] = [];
                }

                //Sort User MeetUps To User Array and Chat Array
                data.meetups.forEach((meetup, index) => {
                    let meetupObj = data.meetup_obj.find(function (meetupObj) {
                        return meetupObj.id === meetup._id;
                    });
                    //-- Setting Window Active In case Active Chat Is Null
                    if (index === 0) {
                        window.activeChat = (window.activeChat) ? window.activeChat : meetupObj.associate.username;
                    }
                    arrayUser[meetupObj.associate.username] = meetupObj.associate;
                    arrayChats[meetupObj.associate.username] = meetupObj.chats;
                });

                //Sort ChatList To Dom, Putting User To Dom
                populateChatUserList('all')
                if (location.href.includes("/app/chats?user=")) {
                    // Put Active User On windowChatDiv
                    populateWindowChat()
                    enterChatsWindow();
                }

                //Fire Resolver
                setInterval(newChatResolver, 100); //-- resolve new chat from socket
                setInterval(unresolvedChatResolver, 100); //-- resolve new chat from socket
                setInterval(() => {
                    arrayUser.forEach((user) => {
                        updateUserActivity(user);
                    })
                }, 60 * 3)
            },
        });
    }


    //======================= BUILDING THE LIST LAYOUT ==================

    function populateChatUserList(type) {

        window.chatListHolder.find('*').fadeOut(750).remove();

        if (Object.keys(arrayUser).length > 0) {
            let selectedUser = [];
            if (type === 'all') {
                selectedUser = Object.values(arrayUser);
            } else {
                selectedUser = Object.values(arrayUser).filter(user => {
                    return getLastActivity(user.last_activity_at);
                });
            }

            if (selectedUser.length > 0) {
                selectedUser.forEach(function (associate) {
                    window.chatListHolder.append(buildChatUserList(associate, arrayChats[associate.username].last()));
                });
            } else {
                window.chatListHolder.append(`
                    <li class="no-available no-chat">
                        <div class="content-holder">
                            <img src="/lib/img/logo/logo-icon.png" alt="Logo">  
                            <h5 class="text-muted">No chats or messages...</h5>
                        </div>
                    </li>`);
            }


        } else {
            window.chatListHolder.append(`
                    <li class="no-available no-chat">
                        <div class="content-holder">
                            <img src="/lib/img/logo/logo-icon.png" alt="Logo">
                            <h5 class="text-muted">No chats or messages...</h5>
                        </div>
                    </li>`);
        }
    }

    function buildChatUserList(associate, chat, unread = 0) {
        let is_online = (getLastActivity(associate.last_activity_at)) ? 'is_online' : 'is_offline'; //last_activity_at
        let time = (chat) ? formatListDomTime(chat.sent_at) : '';
        let last_msg = (chat) ? chat.message : '';
        let comm_stat = (unread > 0) ? `<span class="badge">${unread}</span>` : "";

        //-- chat listin

        return `
            <a href="javascript:void(0);" class="userCon">
                <li id='${associate.username.toLowerCase()}-chat-listing' data-username="${associate.username.toLowerCase()}" class="user user-chat-listing">
                    <div class="image-holder">
                        <div class="status ${is_online}"></div>
                        <div class="profile-img" style="background-image: url('${associate.avatar}')"></div>
                    </div>
                    <div class="message-holder">
                        <div class="time text-muted">${time}</div>
                        <div class="username text-dark" style="font-weight: 500 !important;" data-username="${associate.username}">${associate.name.split(" ")[0]}</div>
                        <div class="latest-message text-muted">${last_msg.trunc(25)}</div>
                        <div class="communication-status" data-unread-msg="${unread}">${comm_stat}</div>
                    </div>
                </li>
            </a>
            `;
    }

    //======================= ! BUILDING THE LIST LAYOUT ==================



    //======================= BUILDING THE MESSAGE LAYOUT ==================

    function populateWindowChat(username = null) {
        username = (username) ? username : activeChat;

        if (username) {
            let chats_list_box = $('.chat-message-list');
            let user = window.arrayUser[username]
            let chats = window.arrayChats[username];

            let is_online = (getLastActivity(user.last_activity_at)) ? 'is_online' : 'is_offline'; //last_activity_at

            //-- user property to dom
            $('#chat-status').removeClass('is_online').removeClass('is_offline').addClass(is_online)
            $('#chat-username-holder').text(user.name);
            $('#chat-profile-img').css('background-image', `url('${user.avatar}')`);

            chats_list_box.find('*').remove();

            $('.go-back-encounter').css('display', 'none');
            $('.chat-window-holder').css('display', 'block');

            if (chats) {
                chats.forEach(chat => {
                    chats_list_box.append(buildChatMessage(chat));
                })
                let ChatWindowBody = $(".ChatWindowBody");
                ChatWindowBody[0].scrollTop = ChatWindowBody[0].scrollHeight;
            }
        }
    }

    function buildChatMessage(chat, sending = null) {

        let is_outbox_or_inbox = (chat.from !== `${__user}`) ? 'inbox' : 'outbox';
        let message_status = '';

        if (is_outbox_or_inbox === 'outbox') {
            if (chat.sent_at) {
                message_status = `<i class="fa fa-check"></i>`;
            }
            if (chat.delivered_at) {
                message_status = `<i class="fa fa-check"></i><i class="fa fa-check" style="margin-left: -7px; opacity: .7;"></i>`;
            }
            if (chat.read_at) {
                message_status = `<i class="fa fa-check"></i><i class="fa fa-check" style="margin-left: -6px; opacity: .7;"></i>`;
            }
            if (sending) {
                message_status = `<i class="fa fa-clock-o"></i>`;
            }
        }

        return `
             <li id="chat-${chat.u_id}" class="${is_outbox_or_inbox}">
                <div class="">
                    <span class="message">${chat.message}</span>
                    <span class="time">${moment(chat.sent_at).fromNow()} &nbsp; <span id="message-status">${message_status}</span></span>
                </div>
            </li>
        `;
    }
    //======================= ! BUILDING THE MESSAGE LAYOUT ==================



    //======================= MINIMAL HELPER FUNCTIONS =============
    function getLastActivity(last_activity) {

        if (last_activity) {
            let diffSec = Math.abs(moment(last_activity).diff(moment(), 'seconds'))
            return (diffSec <= 60 * 5);
        }
        return false;
    }

    function formatListDomTime(time) {
        return moment(time).fromNow()
    }

    function newChatResolver() {

        if (arrayNewMsg.length > 0) {
            let msg = arrayNewMsg.shift()

            //user from exist in user array
            if (arrayUser[msg.from.slice(1)]) {
                let user = msg.from.slice(1);
                arrayChats[user].push(msg)

                // noinspection JSJQueryEfficiency
                if ($('.no-chat').length) $('.no-chat').remove();

                let userChatListDom = $(`#${ jq( user.toLowerCase() )}-chat-listing`); //-- 1 username problem

                if (userChatListDom.length) {
                    //message
                    userChatListDom.find('.latest-message').html(`${msg.message.trunc(30)}`);
                    //time
                    userChatListDom.find('.time').text(`${formatListDomTime(msg.sent_at)}`);

                    if (msg.from.slice(1) !== activeChat) {
                        let unread = parseInt(userChatListDom.find('.communication-status').data('unread-msg'));
                        userChatListDom.find('.communication-status').html(`<span class="badge">${unread+1}</span>`).data('unread-msg', unread + 1);
                    }

                    userChatListDom.parent().prepend(userChatListDom);
                } else {
                    //append him to the dom
                    window.chatListHolder.append(buildChatUserList(arrayUser[user], msg, 1));
                }

                //push message to user chat if is active and exist in array
                if (msg.from.slice(1) === activeChat) {
                    $('.chat-message-list').append(buildChatMessage(msg));
                }
            } else {
                unresolvedMsg.push(msg); // if not push message to unsolved array
            }

        }
    }

    function unresolvedChatResolver() {
        if (unresolvedMsg.length > 0) {
            let msg = unresolvedMsg.shift()
            let username = msg.from.slice(1)

            $.ajax({
                url: `/app/meetups/getuser?user=${username}`, // send active user also
                method: "GET",
                success: (data) => {
                    preAjaxSocketListener()

                    if (data.user) {
                        arrayUser[data.user.username] = data.user;
                        arrayChats[data.user.username] = [];
                        arrayNewMsg.unshift(msg); //put it back to new Msg for processing
                    }
                },
            });
        }
    }

    function updateUserActivity(user) {

        let is_online = (getLastActivity(user.last_activity_at)) ? 'is_online' : 'is_offline'; //last_activity_at

        $(`#${  jq( user.username.toLowerCase()) }-chat-listing`).find('.status').removeClass('is_online').removeClass('is_offline').addClass(is_online)

        if (user.username === activeChat) {
            $('#chat-status').removeClass('is_online').removeClass('is_offline').addClass(is_online)
        }
    }

    function markAllActiveMsgAsRead() {
        //-- All msg are marked as delivered and read when click on li, also goes to database
    }

    //======================= ! MINIMAL HELPER FUNCTIONS =============






    //======================= EVENT SOCKET EMIT LISTENERS ==================
    /*
     * Sending Typing... notification,
     */
    $("#message-input").on('keyup', function () {
        let message = {
            from: __user,
            to: `@${window.activeChat}`,
            type: "composing"
        };
        __socket.emit('chat composing', message);
        return false;
    });

    $('#profile-link').on('click', function () {
        window.location.href = `/app/profile/${activeChat}`;
    })

    function sendChat() {
        let toUser = activeChat;
        let user = `@${toUser}`;
        let message_holder = $('#message-input');
        let messageTxt = message_holder.val();

        if (messageTxt.trim() !== '') {
            // noinspection JSUnusedLocalSymbols
            let message = {
                __id: new Date().getUnixTime(),
                u_id: new Date().getUnixTime(),
                from: __user,
                to: user,
                type: "chat-message",
                format: "text",
                message: messageTxt,
                sent_at: Date.now(),
            };
            __socket.emit('chat message', message);

            message.delivered_at = null
            message.read_at = null
            message.u_id = message.__id //i want to get rid of __id

            arrayChats[toUser].push(message);

            let userChatListDom = $(`#${  jq( user.slice(1).toLowerCase()) }-chat-listing`);
            //message
            userChatListDom.find('.latest-message').html(`${message.message.trunc(30)}`);
            //time
            userChatListDom.find('.time').text(`${formatListDomTime(message.sent_at)}`);

            $('.chat-message-list').append(buildChatMessage(message, true));
            message_holder.val('');
        }
    }

    $('#message-input').on('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            sendChat();
            let ChatWindowBody = $(".ChatWindowBody"),
                ChatWindow = $(".ChatWindow");

            ChatWindowBody[0].scrollTop = ChatWindowBody[0].scrollHeight;
            ChatWindow[0].scrollTop = ChatWindow[0].scrollHeight;
            return false;
        }
    })

    /*
     * Sending Message
     */
    $('#submit-msg').on('click', function (e) {
        e.preventDefault();
        sendChat();
        let ChatWindowBody = $(".ChatWindowBody"),
            ChatWindow = $(".ChatWindow");

        ChatWindowBody[0].scrollTop = ChatWindowBody[0].scrollHeight;
        ChatWindow[0].scrollTop = ChatWindow[0].scrollHeight;

        return false;
    });

    $(document).on('click', '.user-chat-listing', function () {
        let element = $(this);
        let username = element.find('.username').data('username');
        if (username) {
            $('.user-chat-listing').removeClass('active')
            element.addClass('active')
            window.activeChat = username;
            element.find('.communication-status').html(``).data('unread-msg', 0);
            populateWindowChat(username);
            markAllActiveMsgAsRead()
            enterChatsWindow();
            $("textarea").trigger("focus")
        }
    });

    function enterChatsWindow() {
        let ChatList = $(".ChatList");
        let ChatWindow = $(".ChatWindow");
        if (ChatWindow.css("left") !== "0px") {
            ChatWindow.css({
                "left": "0px",
                "transition": "ease .5s"
            });
            $(".mobileNavigator").css({
                "bottom": "-50%",
                "transition": "ease .5s"
            })
            ChatList.css({
                "display": "none"
            })
            ChatWindow[0].scrollTop = ChatWindow[0].scrollHeight;
        }
    };

    // Go back to ChatList
    $(".backtoChatList").on("click", (e) => {
        let ChatList = $(".ChatList");
        let ChatWindow = $(".ChatWindow");
        let mobileNavigator = $(".mobileNavigator");
        ChatWindow.css({
            'left': '-120%',
            'transition': 'ease .3s'
        });
        mobileNavigator.css({
            'bottom': '0%',
            'transition': 'ease .3s'
        });
        ChatList.css({
            "display": "block"
        });
    });

    $('#searchUsers').on('change', function () {
        populateChatUserList($(this).val())
    })

    $("#addFavourite").on('click', function () {
        $.ajax({
            url: '/app/encounters/addFavourite',
            data: {
                username: activeChat,
            },
            method: "GET",
            success: (response) => {
                mySnackbar(response.data.message)
            },
        });
    })

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
         * update user last activity,
         */
        __socket.on('am active', function (msg) {
            let user = msg.user.slice(1);

            if (arrayUser[user]) {
                arrayUser[user].last_activity_at = Date.now();

                updateUserActivity(arrayUser[user]);
                // $(`#${  jq( user.toLowerCase()) }-chat-listing`).find('.status').removeClass('is_offline').addClass('is_online');
                //
                // if(user === activeChat) {
                //     $('#chat-status').removeClass('is_offline').addClass('is_online');
                // }

                console.log(user, 'is active')
            }
        });

        /*
         * listen for Acknowledgment notification from the serve when you send a message,
         */
        __socket.on(`${__user} acknowledge`, function (msg) {

            if (msg.to.slice(1) === activeChat) {
                let chat = arrayChats[activeChat].find(function (chats) {
                    return chats.__id === msg.__id;
                });
                let chatbox = $(`#chat-${chat.u_id}`);
                chatbox.find('#message-status').html('<i class="typcn typcn-tick"></i>')
            }
        });

        /*
         * listen for chat delivered notification on your channel for message you sent
         */
        __socket.on(`${__user} delivered`, function (msg) {

            let chat = arrayChats[msg.to.slice(1)].find(function (chats) {
                return chats.__id === msg.__id;
            });
            chat.delivered_at = Date.now();

            if (msg.to.slice(1) === activeChat) {
                let chatbox = $(`#chat-${chat.u_id}`);
                chatbox.find('#message-status').html('<i class="typcn typcn-tick"></i><i class="typcn typcn-tick" style="margin-left: -7px; opacity: .7;"></i>')
            }
        });


        /*
         * listen for typing notification on your own channel,
         */
        __socket.on(`${__user} composing`, function (msg) {

            let element = $(`#${  jq( msg.from.slice(1).toLowerCase() )}-chat-listing`);
            let window_chat = $('.ChatWindow');

            let is_active_chat = msg.from.slice(1).toLowerCase() === ((window.activeChat) ? window.activeChat.toLowerCase() : null)

            if (is_active_chat) {

                window_chat.find('#chat-typing').text('typing...')
                element.find('.communication-status').text('typing...')
            } else {
                element.find('.communication-status').text('typing...')
            }

            //-- To Remove typing .....
            setTimeout(function () {
                if (is_active_chat) {
                    window_chat.find('#chat-typing').text('')
                }
                let comm_stat = element.find('.communication-status');
                if (comm_stat.text() === 'typing...') {
                    if (parseInt(comm_stat.data('unread-msg')) > 0) {
                        comm_stat.html(`<span class="badge">${comm_stat.data('unread-msg')}</span>`)
                    } else {
                        comm_stat.html('')
                    }
                }
            }, 4000);

        });
    }

    function jq(myid) {
        // noinspection RegExpSingleCharAlternation,RegExpRedundantEscape
        return myid.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1");

    }

    //======================= ! START SOCKET ACTIVITY ==================
});
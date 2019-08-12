


$('.encounter-page-send-chat').submit(function(e){
    e.preventDefault();
    let user =  $("#username").text(); //$('#encounter-page-send-message').data('sender-user');
    let message = $('.encounter-page-send-message').val();

    //-- emit --send message
    socket.emit('chat message',{from: __user, to: user, message : message });
    $('.encounter-page-send-message').val('');
    return false;
});


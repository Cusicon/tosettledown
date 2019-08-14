const Model = require('@schema/MeetUpSchema').model;
const Chat = require('@models/chat');
const User = require('@models/user');

module["exports"] = class MeetUp extends Model{

    static appendOrCreate(msg)
    {
        let queries = [
            { user_id: msg.from , encountered : msg.to},
            { user_id: msg.to , encountered: msg.from }
        ];

        this.findOne({ $or: queries},(err , meetup) => {

            if(meetup){
                let chat = new Chat({
                    meetup_id: meetup.id,
                    u_id : msg.__id || Date.now() / 1000 | 0,
                    from: msg.from,
                    to: msg.to,
                    format: msg.format,
                    message: msg.message,
                    sent_at: msg.sent_at,
                });
                chat.save(() =>{
                    meetup.last_encountered = Date.now();
                    meetup.save();
                });
            }
            else
            {
                // noinspection JSCheckFunctionSignatures
                let meetup = new MeetUp({
                    user_id: msg.from,
                    encountered: msg.to,
                    encountered_at: Date.now(),
                    last_encountered: Date.now(),
                });
                meetup.save();
                let chat = new Chat({
                    meetup_id: meetup.id,
                    u_id : msg.__id || Date.now() / 1000 | 0,
                    from: msg.from,
                    to: msg.to,
                    format: msg.format,
                    message: msg.message,
                    sent_at: msg.sent_at,
                });
                chat.save();
            }
        });

    }

    static getMyEncounters(username, callback)
    {
        username = `@${username}`;
        let queries = [
            { user_id: username},
            { encountered: username }
        ];

        let sort_by = { last_encountered : 1 };

        return this.find({ $or: queries}).sort( sort_by ).then(( meetups) => {

            let meetupArray = [];
            if (meetups.length > 0){

                meetups.forEach(async (meetup, index) => {

                    let meetupObj = {
                        meet: meetup,
                        associate: await this.associate(meetup),
                        chats: await this.getMeetUpChat(meetup)
                    };
                    meetupArray.push(meetupObj);

                    if(index === meetups.length -1) {
                        callback(meetupArray);
                    }
                });

            } else {
                callback(meetups);
            }
        });
    }

    static associate(meetup) {

        let username = null;

        if (`@${__user.username}` === meetup.user_id) {
            username = meetup.encountered.slice(1);
        } else {
            username = meetup.user_id.slice(1);
        }
        return User.findOne({username: username}).exec()
    }

    static getMeetUpChat(meetup)
    {
        return Chat.find({ meetup_id: meetup.id}).exec()
    }

    static updateChatToDelivered(msg)
    {
        u_id = msg.__id

        this.find()
    }

};
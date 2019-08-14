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

        this.findOne({ $or: queries},(err , meetups) => {

            let chat = new Chat({
                u_id : msg.__id || Date.now() / 1000 | 0,
                from: msg.from,
                to: msg.to,
                format: msg.format,
                message: msg.message,
                sent_at: msg.sent_at,
            });
            /* Might Remove Save Not To Duplicate Table */
            // chat.save();

            if(meetups){
                meetups.chats.push(chat);
                meetups.last_encountered = Date.now();
                meetups.save();
            }
            else
            {
                // noinspection JSCheckFunctionSignatures
                let meetup = new MeetUp({
                    user_id: msg.from,
                    encountered: msg.to,
                    encountered_at: Date.now(),
                    last_encountered: Date.now(),
                    chats: [chat],
                });
                meetup.save();
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
            if (meetups.length > 0){
                this.associate(meetups,callback);
            } else {
                callback(meetups);
            }
        });
    }

    static associate(meetups,callback) {

        let queries = [];

        meetups.map(meetup => {
            if (`@${__user.username}` === meetup.user_id) {
                queries.push(meetup.encountered.slice(1));
            } else {
                queries.push(meetup.user_id.slice(1));
            }
        });

        User.find({username:{$in: queries}}, (err, users) => {
            let meetupsArray = [];

            meetups.forEach((meetup, index) => {

                let meetupObj = {
                    meetup: meetup,
                    associate: users[index]
                };
              meetupsArray.push(meetupObj);
            });
            callback(meetupsArray)
        });
    }

    static updateChatToDelivered(msg)
    {
        u_id = msg.__id

        this.find()
    }

};
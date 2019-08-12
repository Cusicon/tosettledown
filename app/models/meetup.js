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
                from: msg.from,
                to: msg.to,
                format: msg.format,
                message: msg.message,
                sent_at: Date.now(),
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
                let meetup = new MeetUp({
                    user_id: msg.from,
                    encountered: msg.to,
                    encountered_at: Date.now(),
                    last_encountered: Date.now(),
                    chats: [chat],
                });
                meetup.save();
            }
            console.log(meetups);
        });
    }

    static getMyEncounters(username, callback)
    {
        username = `@${username}`;
        let queries = [
            { user_id: username},
            { encountered: username }
        ];

        // let order_by = { last_encountered : 1 };
        // $orderby : order_by

        return this.find({ $or: queries} ,(err , meetups) => {
            this.associate(meetups,callback);
            // callback(meetups)
        });
    }

    static associate(meetups,callback) {

        let queries = [];

        meetups.map(meetup => {
            if (`@${auth_user.username}` === meetup.user_id) {
                queries.push(meetup.encountered.slice(1));
            } else {
                queries.push(meetup.user_id.slice(1));
            }
        });

        User.find({username:{$in: queries}}, (err, users) => {
            let meetupsArray = [];

            meetups.forEach((meetup, index) => {
                console.log(users[index]);

                let meetupObj = {
                    meetup: meetup,
                    associate: users[index]
                };
              meetupsArray.push(meetupObj);
            });
            callback(meetupsArray)
        });
    }

};
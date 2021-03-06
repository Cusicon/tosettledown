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
                    meet_at: Date.now(),
                    user_id: msg.from,
                    encountered: msg.to,
                    encountered_at: Date.now(),
                    last_encountered: Date.now(),
                });
                meetup.save();
                let chat = new Chat({
                    meetup_id: meetup.id,
                    u_id : msg.__id,
                    from: msg.from,
                    to: msg.to,
                    format: msg.format,
                    message: msg.message,
                    sent_at: msg.sent_at,
                });
                chat.save();
            }
            this.updateUserLastActivity(msg);
        });

    }

    static updateUserLastActivity(msg) {
        console.log(msg.from.slice(1))
        //update the from user last activity here
        User.findOne({username: msg.from.slice(1)}, (err, user) => {
            if(user){
                user.last_activity_at = Date.now();
                user.save();
            }else {
                console.log(user);
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

        let sort_by = { last_encountered : -1 };

        return this.find({ $or: queries}).sort( sort_by ).then(async (meetups) => {
            let meetupArray = [];

            if (meetups.length > 0) {

                meetups.forEach(async (meetup) => {

                    let meetupObj = {};
                    meetupObj.id = meetup.id
                    meetupObj.associate = await this.associate(username, meetup);
                    meetupObj.chats = await this.getMeetUpChat(meetup);

                    meetupArray.push(meetupObj);

                    if (meetupArray.length === meetups.length) {
                        callback(meetups, meetupArray);
                    }
                });

            } else {
                callback(meetups, null);
            }
        });
    }

    static async associate(currUser, meetup) {

        let username = null;

        if (currUser === meetup.user_id) {
            username = meetup.encountered.slice(1);
        } else {
            username = meetup.user_id.slice(1);
        }
        return await User.findOne({username: username}).exec();
    }

    static async getMeetUpChat(meetup) {
        return await Chat.find({meetup_id: meetup.id}).exec();
    }

    // sleep time expects milliseconds
    static sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    static updateChatToDelivered(msg)
    {
        // Usage!
        this.sleep(1000).then(() => {
            // console.log(msg);

            Chat.findOne({sent_at: msg.sent_at, from: msg.from}, (err, chat) => {
                console.log(chat);
                if(chat){
                    chat.delivered_at = Date.now();
                    chat.save()
                }
            });
        });
    }



};
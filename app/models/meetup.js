const Model = require('@schema/MeetUpSchema').model;
const Chat = require('@models/chat');

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
                format: null,
                message: msg.message,
                sent_at: new Date().toDateString(),
            });
            chat.save();

            if(meetups){
                meetups.chats.push(chat);
                meetups.save();
            }
            else
            {
                let meetup = new MeetUp({
                    user_id: msg.from,
                    encountered: msg.to,
                    meet_at: new Date().toDateString(),
                    chats: [chat],
                });
                meetup.save();

                console.log("this1")
            }

        });

    }

};
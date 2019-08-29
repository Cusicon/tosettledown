let User = require('@models/user');
let MeetUp = require('@models/meetup');
let Visitor = require('@models/visitor');

module["exports"] = class HomeController{

    static chats(req, res)
    {
        res.render('./app/menu/chats', {
            title: "Chats",
            activeChat:null
        });
    }

    static getMeetUps(req, res)
    {
        let activeChat = req.query.user || null;
        MeetUp.getMyEncounters(req.user.username, (meetups, meetupObj) => {
            if(activeChat)
            {
                User.getUserByUsername(activeChat, (err, activeChat) => {
                    if (err) console.log(err);
                    else {
                        res.json({
                            meetups: meetups,// Shuffle the array
                            meetup_obj: meetupObj,
                            activeChat: activeChat,
                        });
                    }
                });
            }
            else
            {
                res.json({
                    meetups: meetups,// Shuffle the array
                    meetup_obj: meetupObj,
                    activeChat:null
                });
            }
        });
    }

    static getUser(req, res)
    {
        let user = req.query.user || null;
         User.getUserByUsername(user, (err, user) => {

             if (err) console.log(err);
             else {
                res.json({
                    user: user,
                });
             }
        });
    }

    static showChat(req, res)
    {
        let username = req.params.username;
        res.redirect(`/app/chats?user=${username}`);
    }

    static matched(req, res)
    {
        res.render('./app/menu/matched', { title: "Matched" });
    }

    static likes(req, res)
    {
        res.render('./app/menu/likes', { title: "Likes" });
    }

    static visitors(req, res)
    {
        // user_id => the person you are visiting
        // visitor_id => the person that is visiting

        Visitor.aggregate([
            {
                $lookup: {
                    from : 'users',
                    localField: 'visitor',
                    foreignField: 'username',
                    as: 'visitorObj'
                }
            },
            { $match: { visited_user: req.user.username } },

        ]).then(visits => {
            visits = visits.map(visit => {
                visit.visitorObj = new User(visit.visitorObj[0]);
                return visit;
            })
            res.render('./app/menu/visitors', { title: "Visitors", visits:visits });
        });
    }

    static favourites(req, res)
    {
        res.render('./app/menu/favourites', { title: "Favourites" });
    }

    static shop(req, res)
    {
        res.render('./app/menu/shop', { title: "Shop" });
    }

    static wallet(req, res)
    {
        res.render('./app/extras/wallet', { title: "Wallet" });
    }

    static packages(req, res)
    {
        res.render('./app/extras/premium', { title: "Package" });
    }

};



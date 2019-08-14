let User = require('@models/user');
let MeetUp = require('@models/meetup');

module["exports"] = class HomeController{

    static chats(req, res)
    {
        let activeChat = req.query.user || null;

        User.getUserByUsername(activeChat, (err, activeChat) => {
            if (err) console.log(err);
            else {
                res.render('./app/menu/chats', {
                    title: "Chats",
                    activeChat: activeChat,
                });
            }
        });
    }

    static getMeetUps(req, res)
    {
        let activeChat = req.query.user || null;
        MeetUp.getMyEncounters(__user.username, (encountered) => {
            if(activeChat)
            {
                User.getUserByUsername(activeChat, (err, activeChat) => {
                    if (err) console.log(err);
                    else {
                        res.json({
                            meetups: encountered,// Shuffle the array
                            activeChat: activeChat,
                        });
                    }
                });
            }
            else
            {
                res.json({
                    meetups: encountered,// Shuffle the array
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
        res.render('./app/menu/visitors', { title: "Visitors" });
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



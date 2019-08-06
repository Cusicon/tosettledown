let User = require('@models/user');

module["exports"] = class HomeController{

    static chats(req, res)
    {
        res.render('./app/menu/chats', {
            title: "Chats"
        });
    }

    static showChat(req, res)
    {
        let username = req.params.username;
        User.getUserByUsername(username, (err, profile_user) => {
            if (err) console.log(err);
            else {
                res.render('./app/menu/chats', {
                    title: "Chats",
                    profile_user: profile_user
                });
            }
        });
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



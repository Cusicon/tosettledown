let User = require('@models/user');
let MeetUp = require('@models/meetup');
let Visitor = require('@models/visitor');
let Favourite = require('@models/favourite');
let Like = require('@models/like');

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

        Like.find({liked_user: req.user.username, isLiked : true}).then(likes => {
            let likers = likes.map(like => like.liker);

            Like.aggregate([
                {
                    $lookup: {
                        from : 'users',
                        localField: 'liked_user',
                        foreignField: 'username',
                        as: 'matchObj'
                    }
                },
                { $match: { liker: req.user.username, isLiked: true, liked_user: {$in: likers } } },
            ]).then(matches => {

                matches = matches.map(match => {
                    match.matchObj = new User(match.matchObj[0]);
                    return match;
                })

                res.render('./app/menu/matched', { title: "Likes" , matches:matches });
            });
        });
    }

    static likes(req, res)
    {

        Like.aggregate([
            {
                $lookup: {
                    from : 'users',
                    localField: 'liked_user',
                    foreignField: 'username',
                    as: 'likerObj'
                }
            },
            { $match: { liker: req.user.username, isLiked: true} },

        ]).then(likes => {
            likes = likes.map(like => {
                like.likerObj = new User(like.likerObj[0]);
                return like;
            })
            res.render('./app/menu/likes', { title: "Likes" , likes:likes });
        });


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
        Favourite.aggregate([
            {
                $lookup: {
                    from : 'users',
                    localField: 'favourite_user',
                    foreignField: 'username',
                    as: 'favouriteObj'
                }
            },
            { $match: { user: req.user.username } },

        ]).then(favourites => {
            favourites = favourites.map(favourite => {
                favourite.favouriteObj = new User(favourite.favouriteObj[0]);
                return favourite;
            })
            res.render('./app/menu/favourites', { title: "Favourites", favourites:favourites });
        });
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



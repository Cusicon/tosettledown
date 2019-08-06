let User = require('@models/user');

module["exports"] = class ProfileController{

    static show(req, res)
    {
        let username = req.params.username;
        User.getUserByUsername(username, (err, profile_user) => {
            if (err) console.log(err);
            else {
                res.render('./app/menu/profile', {
                    title: `${profile_user.fullname.firstname}'s profile`,
                    profile_user: profile_user
                });
            }
        });
    }

    static update(req, res)
    {
        let username = req.params.username;
        User.getUserByUsername(username, (err, profile_user) => {
            if (err) console.log(err);
            else {
                res.render('./app/menu/profile', {
                    title: `${profile_user.fullname.firstname}'s profile`,
                    profile_user: profile_user
                });
            }
        });
    }
};
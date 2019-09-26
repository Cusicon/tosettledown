let User = require('@models/user');
module["exports"] = function (req, res, next) {

    if (req.user) {
        req.user.photos().then(photos => {
            if(photos.length > 0){
                if(req.user.avatar.includes('/lib/img/assets/reduced')){
                    User.getUserByIdandUpdate(req.user.id, {
                        avatar: photos[0].location
                    }, (err) => {
                        err ? console.log("Error: ", err) : next(); console.log("Avatar updated!", req.user.avatar);
                    });
                }else {
                    next();
                }
            }else{
                if(req.path.includes(`/profile/${req.user.username}`) || req.path.includes(`/profile/addPhotos`)){
                    next()
                } else {
                    res.redirect(`/app/profile/${req.user.username}`);
                }
            }
        });
    } else {
        res.redirect(`/`);
    }
};
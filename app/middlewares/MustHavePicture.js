let User = require('@models/user');
module["exports"] = function (req, res, next) {

    if(req.user) {
        req.user.photos().then(photos => {
            if(photos.length > 0){
                if(req.user.avatar.includes('/lib/img/assets/reduced')){
                    User.getUserByIdandUpdate(req.user.id, {
                        avatar: photos[0].location
                    }, (err) => {
                        if(err){
                            throw new Error(err.message || 'photo not found');
                        }else{
                            next();
                        }
                    });
                }else {
                    next();
                }
            }else{
                if(req.path.includes(`/profile/${req.user.username}`) || req.path.includes(`/profile/addPhotos`)){
                    next()
                }else{
                    res.redirect(`/app/profile/${req.user.username}`);
                }
            }
        });
    }else{
        res.redirect(`/`);
    }
};
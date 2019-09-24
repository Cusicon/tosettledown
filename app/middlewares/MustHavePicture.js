module["exports"] = function (req, res, next) {

    if(req.user) {
        req.user.photos().then(photos => {
            if(photos.length > 0){
                if(req.user.avatar == null){
                    req.user.avatar = photos[0].location;
                    req.user.save();
                }
                next();
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
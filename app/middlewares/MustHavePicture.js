module["exports"] = function (req, res, next) {

    if (req.user) {
        req.user.photos().then(photos => {
            if (photos.length > 0) {
                if (req.user.avatar == null) {
                    req.user.avatar = photos[0].location;
                    req.user.save();
                }
                next();
            } else {
                // next();
                if (req.user.avatar != null) {
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
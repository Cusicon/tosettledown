let User = require('@models/user');
let Like = require('@models/like');
let Favourite = require('@models/favourite');

module["exports"] = class EncounterController {

    static index(req, res) {
        res.render('./app/menu/encounters', {
            title: "Encounters",
        });
    }

    static async getUserAndPhoto(req, res) {
        await EncounterController.getOneUserAndPictures(req, res);
    }

    static async addToLikeAndGetAnotherUser(req, res) {
        try{
            let like = await Like.findOne({
                liker: req.user.username,
                liked_user: req.query.username
            })

            if (like) {
                if (!like.isLiked) {
                    like.isLiked = (req.query.type === 'like');
                    like.liked_at = Moment().toISOString();
                    await like.save()
                }
                await EncounterController.getOneUserAndPictures(req, res);
            } else {
                like = new Like({
                    liker: req.user.username,
                    liked_user: req.query.username,
                    isLiked: (req.query.type === 'like'),
                })
                if (await like.save()){
                    await EncounterController.getOneUserAndPictures(req, res);
                }
            }
        }catch(err){
            res.send({
                data: {
                    status: "error",
                    message: err.message
                }
            })
        }
    }

    static async addToLike(req, res) {
        try{
            let like = await Like.findOne({
                liker: req.user.username,
                liked_user: req.query.username
            })

            if (like) {
                if (!like.isLiked) {
                    like.isLiked = (req.query.type === 'like');
                    like.liked_at = Moment().toISOString();
                    if(await like.save()){
                        res.send({
                            data: {
                                status: "success",
                                message: "Added Successfully"
                            }
                        })
                    }
                } else {
                    res.send({
                        data: {
                            status: "success",
                            message: "Already Added"
                        }
                    })
                }
            } else {
                like = new Like({
                    liker: req.user.username,
                    liked_user: req.query.username,
                    isLiked: (req.query.type === 'like'),
                })
                if(await like.save()){
                    res.send({
                        data: {
                            status: "success",
                            message: "Added Successfully"
                        }
                    })
                }
            }
        }catch(err){
            res.send({
                data: {
                    status: "error",
                    message: err.message
                }
            })
        }
    }

    static async addToFavorite(req, res) {

        try {
            let favourite = await Favourite.findOne({
                user: req.user.username,
                favourite_user: req.query.username
            });

            if (favourite) {
                favourite.isFavourited = !favourite.isFavourited;
                favourite.favourite_at = Moment().toISOString()
                if(await favourite.save()){
                    res.send({
                        data: {
                            status: "success",
                            message: (favourite.isFavourited) ? "Added back to favourites..." : "Removed from favourites..."
                        }
                    })
                }
            } else {
                favourite = new Favourite({
                    user: req.user.username,
                    isFavourited: true,
                    favourite_user: req.query.username,
                    favourite_at: Moment().toISOString(),
                })
                if(await favourite.save()){
                    res.send({
                        data: {
                            status: "success",
                            message: "Added to favourites..."
                        }
                    })
                }
            }
        }catch(err){
            res.send({
                data: {
                    status: "error",
                    message: err.message
                }
            })
        }
    }

    static async getOneUserAndPictures(req, res) {
        try {
            let gender = req.user.gender === "male" ? "female" : "male";
            let Interval = Moment().subtract(10, 'minute');

            let likedUsersObj = await Like.find({
                liker: req.user.username,
                $or: [
                    {isLiked : true},
                    {isLiked : false, liked_at: {$gte: Interval.toISOString() }},
                ]
            });

            let user = await User.aggregate([
                {
                    $match: {
                        username: {
                            $nin: likedUsersObj.map(obj => obj.liked_user)
                        },
                        gender: gender
                    }
                },
                {
                    $sample: {
                        size: 1
                    }
                }
            ]);

            if(user.length === 1){
                user = new User(user.pop()); // To cast the user from aggregate to user trait
                let photos = await  user.photos();
                res.send({
                    data: {
                        photos: photos,
                        user: user
                    }
                })
            }else{
                res.send({
                    data: {
                        photos: null,
                        user: null
                    }
                })
            }
        }catch (err) {
            console.log(err)
            res.send({
                data: {
                    status: "error",
                    message: err.message
                }
            })
        }
    }
};
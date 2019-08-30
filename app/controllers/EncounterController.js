let User = require('@models/user');
let Photo = require('@models/media');
let Like = require('@models/like');
let Favourite = require('@models/favourite');

module["exports"] = class EncounterController {

    static index(req, res) {
        res.render('./app/menu/encounters', {
            title: "Encounters",
        });
    }

    static getUserAndPhoto(req, res) {
        EncounterController.getOneUserAndPictures(req, res);
    }

    static addToLikeAndGetAnotherUser(req, res){
        Like.findOne({liker:req.user.username, liked_user:req.query.username}).then(like => {
            if(like) {
                if(!like.isLiked && req.query.type === 'like'){
                    like.isLiked = true;
                    like.liked_at = new Date().toDateString();
                    like.save()
                }
                EncounterController.getOneUserAndPictures(req, res);
            }else {
                like = new Like({
                    liker: req.user.username,
                    liked_user: req.query.username,
                    isLiked: (req.query.type === 'like'),
                })
                like.save(()=> {
                    EncounterController.getOneUserAndPictures(req, res);
                })
            }
        })

    }

    static addToLike(req, res){
        Like.findOne({liker:req.user.username, liked_user:req.query.username}).then(like => {
            if(like) {
                if(!like.isLiked && req.query.type === 'like'){
                    like.isLiked = true;
                    like.liked_at = new Date().toDateString();
                    like.save(() => {
                        res.send({
                            data: {
                                status: "success",
                                message: "Added Successfully"
                            }
                        })
                    })
                } else {
                    res.send({
                        data: {
                            status: "success",
                            message: "Already Added"
                        }
                    })
                }
            }else {
                like = new Like({
                    liker: req.user.username,
                    liked_user: req.query.username,
                    isLiked: (req.query.type === 'like'),
                })
                like.save(()=> {
                    res.send({
                        data: {
                            status: "success",
                            message: "Added Successfully"
                        }
                    })
                })
            }
        })

    }

    static addToFavorite(req, res){

        Favourite.findOne({user:req.user.username, favourite_user:req.query.username}).then(favourite => {
            if(favourite) {
                res.send({
                    data: {
                        status: "success",
                        message: "Already Added"
                    }
                })
            }else {
                favourite = new Favourite({
                    user: req.user.username,
                    favourite_user: req.query.username,
                })
                favourite.save((err)=> {
                    if(err)
                    {
                        res.send({
                            data: {
                                status: "error",
                                message: "Error Occur"
                            }
                        })
                    }else {
                        res.send({
                            data: {
                                status: "success",
                                message: "Added Successfully"
                            }
                        })
                    }
                })
            }
        });
    }

    static getOneUserAndPictures(req, res) {
        let gender = req.user.gender === "male" ? "female" : "male";
        let noOfDaysInterval = 15;

        Like.find({liker:req.user.username}).then(likedUsersObj => {

            let exceptionUsersObj = likedUsersObj.filter((likedUserObj) => {
                if (likedUserObj.isLiked === true) {
                    return true
                } else {
                    let diffSec = Math.abs(Moment(likedUserObj.liked_at).diff(Moment(), 'seconds'))
                    return (diffSec <= 86400 * noOfDaysInterval);
                }
            })
            exceptionUsersObj = exceptionUsersObj.map(obj => obj.liked_user);

            User.findOne({username: {$nin: exceptionUsersObj}, gender: gender}).then(user => {
                user = new User(user); // To cast the user  from aggregate to user model
                if (user) {
                    Photo.getPhotosbyUsername(user.username, (err, photos) => {
                        if (err) throw err;
                        else {
                            res.send({
                                data: {
                                    photos: photos,
                                    user: user
                                }
                            })
                        }
                    });
                }
            })
        });
    }

};
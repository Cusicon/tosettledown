const HasMedia = require('@media-library/trait/hasMedia');

let User = require('@models/user');
let Photo = require('@models/media');
let Visitor = require('@models/visitor');


module["exports"] = class ProfileController {

    static show(req, res) {
        let username = req.params.username;
        User.getUserByUsername(username, (err, user) => {
            if (err) console.log(err);
            else {
                if (user != null) {
                    if (req.user.id !== user.id) {
                        // user_id => the person you are visiting
                        // visitor_id => the person that is visiting
                        Visitor.findOne({
                            visited_user: user.username,
                            visitor: req.user.username
                        }, (err, visitor) => {
                            if (!visitor) {
                                let visitor = new Visitor({
                                    visited_user: user.username,
                                    visitor: req.user.username
                                });
                                visitor.save()
                            }
                        })
                    }

                    user.photos().then(photos => {
                        if (req.user.gender !== user.gender) {
                            // add to visitor page here
                            res.render('./app/menu/profile', {
                                title: `${user.fullname.firstname}'s profile`,
                                profile_user: user,
                                photos: photos.reverse()
                            });
                        } else if (req.user.gender === user.gender && req.user.username === user.username) {
                            res.render('./app/menu/profile', {
                                title: `${user.fullname.firstname}'s profile`,
                                profile_user: user,
                                photos: photos.reverse()
                            });
                        } else {
                            res.redirect("/#regForm");
                        }

                    }).catch(err => {
                        throw err;
                    })
                } else {
                    res.redirect('/#regForm');
                }
            }
        });
    }

    static update(req, res) {
        let username = req.params.username;
        let id = req.user.id;

        // Values from Body
        let fullname = req.body.fullname.trim();
        let bio = req.body.bio.trim();
        let height = req.body.height.trim();
        let language = req.body.language.trim();
        let religion = req.body.religion.trim();
        let relationship = req.body.relationship.trim();

        let newUser = {
            name: fullname,
            personalInfo: {
                bio: bio,
                location: req.body.location.trim() || '',
                work: req.body.work.trim() || '',
                education: req.body.education.trim() || '',
                height: height,
                language: language,
                religion: religion,
                relationship: relationship,
            }
        };

        //-- Form Validation
        req.checkBody("fullname", "Fullname is essential!").notEmpty();
        req.checkBody("bio", "Bio is essential!").notEmpty();
        req.checkBody("height", "Height is essential!").notEmpty();
        req.checkBody("language", "Language is essential!").notEmpty();
        req.checkBody("religion", "Religion is essential!").notEmpty();
        req.checkBody("relationship", "Relationship is essential!").notEmpty();

        //-- Check for validation Error
        let errors = req.validationErrors();
        if (errors) {
            console.log("Errors: ", errors);
            User.getUserByUsername(username, (err, user) => {
                if (err) console.log(err);
                else {
                    if (user != null) {
                        if (req.user.id !== user.id) {
                            // user_id => the person you are visiting
                            // visitor_id => the person that is visiting
                            Visitor.findOne({
                                visited_user: user.username,
                                visitor: req.user.username
                            }, (err, visitor) => {
                                if (!visitor) {
                                    let visitor = new Visitor({
                                        visited_user: user.username,
                                        visitor: req.user.username
                                    });
                                    visitor.save()
                                }
                            })
                        }

                        user.photos().then(photos => {
                            if (req.user.gender !== user.gender) {
                                // add to visitor page here
                                res.render('./app/menu/profile', {
                                    title: `${user.fullname.firstname}'s profile`,
                                    errors: errors,
                                    profile_user: user,
                                    photos: photos.reverse()
                                });
                            } else if (req.user.gender === user.gender && req.user.username === user.username) {
                                res.render('./app/menu/profile', {
                                    title: `${user.fullname.firstname}'s profile`,
                                    errors: errors,
                                    profile_user: user,
                                    photos: photos.reverse()
                                });
                            } else {
                                res.redirect("/#regForm");
                            }
                        }).catch(err => {
                            throw err;
                        })
                    } else {
                        res.redirect('/#regForm');
                    }
                }
            });
        } else {
            User.getUserByIdandUpdate(id, newUser, (err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    userLog(`"${req.user.username}" just updated their profile.`);
                    console.log(`@${req.user.username} just updated their profile!, @ ${new Date().toTimeString()}`);
                    res.redirect(`/app/profile/${user.username}`);
                }
            });
        }
    }

    /**
     *  Saves the photos into the DB
     */
    static addPhotos(req, res) {
        let media = new HasMedia(req, res, req.user);
        media.addMedia('addPhotos', null, (req, res, err) => {
            res.redirect(`/app/profile/${req.user.username}`);
        });
    }

    static setAvatar(req, res) {
        let photo_id = req.body.photo_id;

        Photo.getPhotoById(photo_id, (err, photo) => {

            if(err || photo == null){
                res.send({
                    status: 'error',
                    message: 'unable to update profile picture'
                })
            }else {
                User.getUserByIdandUpdate(req.user.id, {
                    avatar: photo.location
                }, (err, user) => {

                    if(err || photo == null){
                        console.log(err);

                        res.send({
                            status: 'error',
                            message: 'unable to update profile picture'
                        })
                    }else{
                        console.log(err);

                        res.send({
                            status: 'success',
                            photo: photo,
                            message: 'profile picture updated successfully'
                        })

                        userLog(`"${req.user.username}" just updated their profile picture.`);
                        console.log(`@${req.user.username} just updated their profile picture!, @ ${new Date().toTimeString()}`);
                    }
                });
            }



        });
    }

};
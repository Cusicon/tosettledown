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

    static mustHavePhotos(req, res) {
        let username = req.params.username;
        User.getUserByUsername(username, (err, user) => {
            if (err) console.log(err);
            else {
                if (user != null) {
                    user.photos().then(photos => {
                        if (req.user.gender !== user.gender) {
                            res.send({
                                profile_user: user,
                                photos: photos
                            });
                        } else if (req.user.gender === user.gender && req.user.username === user.username) {
                            res.send({
                                profile_user: user,
                                photos: photos
                            });
                        } else {
                            res.redirect("/#regForm");
                        }
                    }).catch(err => {
                        throw err;
                    });
                } else {
                    res.redirect('/#regForm');
                }
            }
        });
    }

    static update(req, res) {
        let id = req.user.id;
        User.getUserByIdandUpdate(id, {
            name: req.body.fullname,
            personalInfo: {
                bio: req.body.bio.trim() || '',
                location: req.body.location.trim() || '',
                work: req.body.work.trim() || '',
                education: req.body.education.trim() || '',
                height: req.body.height.trim() || '',
                language: req.body.language.trim() || '',
                religion: req.body.religion.trim() || '',
                relationship: req.body.religion.trim() || ''
            }
        }, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                userLog(`"${req.user.username}" just updated their profile.`);
                console.log(`@${req.user.username} just updated their profile!, @ ${new Date().toTimeString()}`);
                res.redirect(`/app/profile/${user.username}`);
            }
        });
    }

    /**
     *  Saves the photos into the DB
     */
    static addPhotos(req, res) {
        let media = new HasMedia(req, res, req.user);
        media.addMedia('addPhotos',null,(req, res, err) => {
            res.redirect(`/app/profile/${req.user.username}`);
        });
    }

    static setAvatar(req, res) {
        let id = req.user.id;
        let photo_id = req.params.photo_id;
        Photo.getPhotoById(photo_id, (err, photo) => {
            User.getUserByIdandUpdate(id, {
                avatar: photo.location
            }, (err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    userLog(`"${req.user.username}" just updated their profile picture.`);
                    console.log(`@${req.user.username} just updated their profile picture!, @ ${new Date().toTimeString()}`);
                    res.redirect(`/app/profile/${user.username}`);
                }
            });

        });
    }

};
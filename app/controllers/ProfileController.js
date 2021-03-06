const MediaLibrary = require('@media-library');
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
        let id = req.user.id;
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
            req.flash('error', errors.pop().message);
            res.redirect(`/app/profile/${req.user.username}`);

        } else {
            User.getUserByIdandUpdate(id, newUser, (err) => {
                if (err) {
                    req.flash('error', 'Error Occur');
                    res.redirect(`/app/profile/${req.user.username}`);
                    console.log(err);
                } else {
                    req.flash('success', 'Update Successful');
                    res.redirect(`/app/profile/${req.user.username}`);

                    userLog(`"${req.user.username}" just updated their profile.`);
                    console.log(`@${req.user.username} just updated their profile!, @ ${new Date().toTimeString()}`);
                }
            });
        }
    }

    /**
     *  Saves the photos into the DB
     */
    static async addPhotos(req, res)
    {

        try {
            let medialibrary = new MediaLibrary(req, res),
                photo = await medialibrary.addMediaFromBase64();

            if(photo){
                res.send({
                    'status': 'success',
                    'message': 'Upload Successful',
                    'data': {
                        photo: photo
                    }
                })
            }else {
                res.send({
                    'status': 'error',
                    'message': 'Error Occur uploading',
                    'data': null
                })
            }
        }catch (e) {
            throw e;
        }
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
                }, (err) => {

                    if(err || photo == null){
                        throw new Error(err.message || 'photo not found');
                    }else{
                        res.send({
                            status: 'success',
                            message: 'profile picture updated successfully',
                            'data': {
                                photo: photo
                            }
                        })
                        userLog(`"${req.user.username}" just updated their profile picture.`);
                        console.log(`@${req.user.username} just updated their profile picture!, @ ${new Date().toTimeString()}`);
                    }
                });
            }
        });
    }
};
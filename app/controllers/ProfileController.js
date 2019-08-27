const multer = require('multer');
const path = require('path');

let User = require('@models/user');
let Photo = require('@models/media');


module["exports"] = class ProfileController {

    static show(req, res) {
        let username = req.params.username;
        User.getUserByUsername(username, (err, user) => {
            if (err) console.log(err);
            else {
                if (user != null) {
                    Photo.getPhotosbyUsername(username, (err, photos) => {
                        if (err) throw err;
                        if (req.user.gender !== user.gender) {
                            res.render('./app/menu/profile', {
                                title: `${user.fullname.firstname}'s profile`,
                                profile_user: user,
                                photos: photos
                            });
                        } else if (req.user.gender === user.gender && req.user.username === user.username) {
                            res.render('./app/menu/profile', {
                                title: `${user.fullname.firstname}'s profile`,
                                profile_user: user,
                                photos: photos
                            });
                        } else {
                            res.redirect("/");
                        }
                    });
                } else {
                    res.redirect('/');
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
                religion: req.body.religion.trim() || ''
            }
        }, (err, user) => err ? console.log(err) : res.redirect(`/app/profile/${user.username}`));
    }

    /**
     *  Saves the photos into the DB
     */
    static addPhotos(req, res) {

        let file_filter = function (req, file, callback) {
            let ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        }

        let storage = multer.diskStorage({
            destination: public_path(`${req.user.userDirectoriesLocation}/photos/`),
            filename: (req, file, cb) => {
                cb(null, `photo_${Date.now()}${path.extname(file.originalname)}`)
            },
            fileFilter: file_filter,
        })

        let upload = multer({
            storage: storage,
            limits: {
                fileSize: 5242880 // Max: 5MB
            },

        }).array("addPhotos", 5);



        upload(req, res, (err) => {

            if (err) {
                req.flash("error", "Error uploading photo, Try again.");
                res.redirect(`/app/profile/${req.user.username}`)
            } else {
                req.files.forEach((file) => {

                    let photo = new Photo({
                        user_id: req.user.id,
                        username: req.user.username,
                        name: file.filename,
                        location: file.path.split("public")[1],
                        media_type: "Photo",
                        mime_type: file.mimetype,
                        uploaded_at: Date.now(),
                        is_visible: true,
                    });

                    photo.save(photo, (err, photo) => {
                        if (err) throw err;
                        else {
                            userLog(`"${req.user.username}" just uploaded some photos.`);
                            console.log(`@${req.user.username} just uploaded some photos!, @ ${new Date().toTimeString()}`);
                        }
                    });

                })
                res.redirect(`/app/profile/${req.user.username}`);
            }
        });
    }

    static setAvatar(req, res) {
        let id = req.user.id;
        let photo_id = req.params.photo_id;
        Photo.getPhotoById(photo_id, (err, photo) => {
            User.getUserByIdandUpdate(id, {
                avatar: `${req.user.userDirectoriesLocation}/photos/${photo.name}`
            }, (err, user) => err ? console.log(err) : res.redirect(`/app/profile/${user.username}`));
        });
    }

};
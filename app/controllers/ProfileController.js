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
                    if (__user.gender !== user.gender) {
                        res.render('./app/menu/profile', {
                            title: `${user.fullname.firstname}'s profile`,
                            profile_user: user
                        });
                    } else if (__user.gender === user.gender && __user.username === user.username) {
                        res.render('./app/menu/profile', {
                            title: `${user.fullname.firstname}'s profile`,
                            profile_user: user
                        });
                    } else {
                        res.redirect("/");
                    }
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

    // var storage = multer.diskStorage({
    //     destination: function (req, file, callback) {
    //         callback(null, './uploads');
    //     },
    //     filename: function (req, file, callback) {
    //         callback(null, file.fieldname + '-' + Date.now());
    //     }
    // });
//





    // Saves the photos into the DB
    static addPhotos(req, res) {

        // let file_filter = fileFilter: (req, file, cb) => {
        //     let fileTypes = /jpeg|png|gif/i; // Allowed Extension
        //     let extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Check Extension
        //     let mimeTypes = fileTypes.test(file.mimetypes) // Check mimetypes
        //     // Check if all is true
        //     if (extname && mimeTypes) {
        //         return cb(null, true);
        //     } else {
        //         return cb("Please upload an image!");
        //     }
        // }

        let storage = multer.diskStorage({
            destination: path.join(req.user.userDirectoriesLocation, 'photos'),
            filename: (req, file, cb) => {
                cb(null, `photo_${Date.now()}${path.extname(file.originalname)}`)
            }
        })

        let upload = multer({
            storage: storage,
            limits: {fileSize: 5242880}, // Max: 5MB

        }).array("addPhotos", 5);



        upload(req,res,function(err) {

            if(err) {
                return res.end("Error uploading file.");
            }
            else
            {
                req.files.forEach((file) => {

                    let photo = new Photo({
                        user_id: req.user.id, // owner of photo
                        name: file.filename, // name of photo
                        location: file.path, // photo location on server.
                        mime_type: file.mimetype, // photo's mimetype
                        uploaded_at: Date.now(),
                        is_visible: true,
                    });

                    Photo.savePhoto(photo, (err, photo) => {
                        if (err) throw err;
                        else {
                            console.log(`Photos User's ID: ${photo.user_id}`); // Show to compare
                            console.log(`User's ID: ${req.user.id}`); // Show to compare
                            console.log(photo); // Display photo in console
                            userLog(`"${req.user.username}" just uploaded some photos.`);
                            console.log(`@${req.user.username} just uploaded some photos!, @ ${new Date().toTimeString()}`);
                        }
                    });

                })
                res.redirect(`/app/profile/${req.user.username}`);
            }
        });
    }
};
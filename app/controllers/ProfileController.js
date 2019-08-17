let User = require('@models/user');
let Photo = require('@models/media');

module["exports"] = class ProfileController {

    static show(req, res) {
        let username = req.params.username;
        User.getUserByUsername(username, (err, user) => {
            if (err) console.log(err);
            else {
                if (user != null) {
                    if (__user.gender != user.gender) {
                        res.render('./app/menu/profile', {
                            title: `${user.fullname.firstname}'s profile`,
                            profile_user: user
                        });
                    } else if (__user.gender == user.gender && __user.username == user.username) {
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

    // Saves the photos into the DB
    static addPhotos(req, res) {
        let photo; // global variable [photo]
        console.log(`Photos: ${req.files}`)
        for (const i in req.files) {
            if (req.files.hasOwnProperty(i)) {
                const file = req.files[i];
                photo = new Photo({
                    user_id: req.user.id, // owner of photo
                    name: file.filename, // name of photo
                    location: file.path, // photo location on server.
                    mime_type: file.mimetype, // photo's mimetype
                    uploaded_at: new Date().now(),
                    is_visible: true,
                });
                // Save Photo to a new collection
                photo.savePhoto((err, photo) => {
                    if (err) throw err;
                    else {
                        console.log(`Photos User's ID: ${photo.user_id}`); // Show to compare
                        console.log(`User's ID: ${req.user.id}`); // Show to compare
                        console.log(photo); // Display photo in console
                        userLog(`"${req.user.username}" just uploded some photos.`);
                        console.log(`@${req.user.username} just uploded some photos!, @ ${new Date().toTimeString()}`);
                        res.redirect(`/app/profile/${username}`);
                    }
                });
            }
        }
    }
};
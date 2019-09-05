let router = require('express')();

//-- encounters Router
router.get("/encounters", (require('@app/controllers/EncounterController')).index);
router.get("/encounters/getUser", (require('@app/controllers/EncounterController')).getUserAndPhoto);
router.get("/encounters/addLikeAndOneUser", (require('@app/controllers/EncounterController')).addToLikeAndGetAnotherUser);
router.get("/encounters/addLike", (require('@app/controllers/EncounterController')).addToLike);
router.get("/encounters/addFavourite", (require('@app/controllers/EncounterController')).addToFavorite);

//-- profile Router
router.get("/profile/:username", (require('@app/controllers/ProfileController')).show);

router.post("/profile/update/:username", (require('@app/controllers/ProfileController')).update);
// router.get("/profile/:username/mustHavePhotos", (require('@app/controllers/ProfileController')).mustHavePhotos);

router.post("/profile/update/:username/addPhotos", (require('@app/controllers/ProfileController')).addPhotos);
router.get("/profile/update/:username/setAvatar/:photo_id", (require('@app/controllers/ProfileController')).setAvatar);


router.get("/profile", (req, res) => res.redirect("/app/encounters"));

//-- chats Router
router.get("/chats", (require('@app/controllers/HomeController')).chats);
router.get("/chats/:username", (require('@app/controllers/HomeController')).showChat);
router.get("/meetups", (require('@app/controllers/HomeController')).getMeetUps); // -- Getting A chat meetup
router.get("/meetups/getuser", (require('@app/controllers/HomeController')).getUser); // -- Getting A chat meetup

//-- matched Router
router.get("/matched", (require('@app/controllers/HomeController')).matched);

//-- likes Router
router.get("/likes", (require('@app/controllers/HomeController')).likes);

//-- visitors Router
router.get("/visitors", (require('@app/controllers/HomeController')).visitors);

//-- favourites Router
router.get("/favourites", (require('@app/controllers/HomeController')).favourites);

//-- shop Router
router.get("/shop", (require('@app/controllers/HomeController')).shop);

//-- wallet Router
router.get("/wallet/balance", (require('@app/controllers/HomeController')).wallet);

//-- packages Router
router.get("/packages/premium", (require('@app/controllers/HomeController')).packages);

module["exports"] = router;
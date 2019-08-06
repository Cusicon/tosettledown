let router =  require('express')();

//-- encounters Router
router.get("/encounters", (require('@app/controllers/EncounterController')).index);
router.get("/encounters/getUsers",  (require('@app/controllers/EncounterController')).getUsers);

//-- profile Router
router.get("/profile/:username", (require('@app/controllers/ProfileController')).show );
router.get("/profile/update/:username", (require('@app/controllers/ProfileController')).update);
router.get("/profile", (req, res) => res.redirect("/app/encounters"));

//-- chats Router
router.get("/chats",HomeController.chats);
router.get("/chats/:username",(require('@app/controllers/HomeController')).showChat);

//-- matched Router
router.get("/matched",(require('@app/controllers/HomeController')).matched);

//-- likes Router
router.get("/likes",(require('@app/controllers/HomeController')).likes);

//-- visitors Router
router.get("/visitors",(require('@app/controllers/HomeController')).visitors);

//-- favourites Router
router.get("/favourites",(require('@app/controllers/HomeController')).favourites);

//-- shop Router
router.get("/shop",(require('@app/controllers/HomeController')).shop);

//-- wallet Router
router.get("/wallet",(require('@app/controllers/HomeController')).wallet);

//-- packages Router
router.get("/packages",(require('@app/controllers/HomeController')).packages);

module["exports"] = router;

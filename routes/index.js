// ## MAIN ROUTER FILE
//-- This file will be only be called in "app.js" file. 
//-- All other routers will be called here.

// ## REQUIRE MODULES
var express = require('express');
var router =  express();
const MustVerify =  require('@app/middlewares/MustVerify')

// ## INITIATE ROUTER(S)

//-- profile Router
  router.get("/profile/:username", (require('@app/controllers/ProfileController')).show );
  router.get("/profile/update/:username", (require('@app/controllers/ProfileController')).update);
  router.get("/profile", (req, res) => res.redirect("/app/encounters"));

//-- encounters Router
  router.get("/encounters", MustVerify,(require('@app/controllers/EncounterController')).index);
  router.get("/encounters/getUsers",  (require('@app/controllers/EncounterController')).getUsers);





//-- chats Router
var chats = require('./app/menu/chats');
router.use('/chats', MustVerify, chats);

//-- matched Router
var matched = require('./app/menu/matched');
router.use('/matched', matched);

//-- likes Router
var likes = require('./app/menu/likes');
router.use('/likes', likes);

//-- visitors Router
var visitors = require('./app/menu/visitors');
router.use('/visitors', visitors);

//-- favourites Router
var favourites = require('./app/menu/favourites');
router.use('/favourites', favourites);

//-- shop Router
var shop = require('./app/menu/shop');
router.use('/shop', shop);

//-- wallet Router
var wallet = require('./app/extras/wallet');
router.use('/wallet', wallet);

//-- packages Router
var packages = require('./app/extras/packages');
router.use('/packages', packages);



module.exports = router;

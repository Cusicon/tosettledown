// ## MAIN ROUTER FILE
//-- This file will be only be called in "app.js" file. 
//-- All other routers will be called here.

// ## REQUIRE MODULES
var express = require('express');
var router = express();

// ## INITIATE ROUTER(S)

//-- encounters Router
var encounters = require('./app/menu/encounters');
router.use('/encounters', encounters);

//-- chats Router
var chats = require('./app/menu/chats');
router.use('/chats', chats);

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

//-- shop Router
var wallet = require('./app/extras/wallet');
router.use('/wallet', wallet);

//-- shop Router
var packages = require('./app/extras/packages');
router.use('/packages', packages);


module.exports = router;

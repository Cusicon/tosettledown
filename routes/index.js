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

//-- views Router
var views = require('./app/menu/views');
router.use('/views', views);

//-- favourites Router
var favourites = require('./app/menu/favourites');
router.use('/favourites', favourites);

//-- weddings Router
var weddings = require('./app/menu/weddings');
router.use('/weddings', weddings);

//-- weddings Router
var wallet = require('./app/extras/wallet');
router.use('/wallet', wallet);

//-- weddings Router
var packages = require('./app/extras/packages');
router.use('/packages', packages);


module.exports = router;

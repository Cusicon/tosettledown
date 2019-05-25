// ## MAIN ROUTER FILE
//-- This file will be only be called in "app.js" file. 
//-- All other routers will be called here.

// ## REQUIRE MODULES
var express = require('express');
var router = express();

// ## INITIATE ROUTER(S)

//-- encounters Router
var encounters = require('./menu/encounters');
router.use('/encounters', encounters);

//-- chats Router
var chats = require('./menu/chats');
router.use('/chats', chats);

//-- matched Router
var matched = require('./menu/matched');
router.use('/matched', matched);

//-- likes Router
var likes = require('./menu/likes');
router.use('/likes', likes);

//-- views Router
var views = require('./menu/views');
router.use('/views', views);

//-- favourites Router
var favourites = require('./menu/favourites');
router.use('/favourites', favourites);

//-- weddings Router
var weddings = require('./menu/weddings');
router.use('/weddings', weddings);


module.exports = router;

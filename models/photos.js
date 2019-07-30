const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
var Schema = mongoose.Schema;

var PhotoSchema = Schema({
    userId: String,
    uploadedOn: String,
    image: {
        name: String,
        location: String,
        isDp: Boolean
    },
});

// Export PhotoSchema
const Photo = (module.exports = mongoose.model(
    "Photos",
    PhotoSchema
));

//-- GetPhotoById
module.exports.getPhotoById = function (id, callback) {
    Photo.findById(id, callback);
};

//-- GetPhotoByPhotoname
module.exports.getPhotoByPhotoname = function (username, callback) {
    var query = {
        username: username
    };
    Photo.findOne(query, callback);
};

//-- CreatePhoto
module.exports.createPhoto = function (newPhoto, callback) {};
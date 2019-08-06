const Photo = require('@schema/PhotoSchema');

module.exports = Photo;
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
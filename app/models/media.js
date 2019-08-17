const Model = require('@schema/MediaSchema').model;

module["exports"] = class Media extends Model {
    static savePhoto(newPhoto, callback) {
        newPhoto.save(callback); // Just saves photo...
    }
};
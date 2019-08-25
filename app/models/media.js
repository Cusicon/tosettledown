const Model = require('@schema/MediaSchema').model;

module["exports"] = class Media extends Model {
    static getPhotosbyUsername(username, callback) {
        let query = {
            username: username
        };
        this.find(query, callback);
    };

    static getPhotoById(id, callback) {
        this.findById(id, callback);
    };
};
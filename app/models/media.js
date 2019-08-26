const Model = require('@schema/MediaSchema').model;

module["exports"] = class Media extends Model {
    static getPhotobyUsername(username, callback) {
        let query = {
            username: username
        };
        this.find(query, callback);
    }
};
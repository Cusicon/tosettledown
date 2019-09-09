const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp')

const Media = require('@models/media')
const Manipulation = require('@media-library/manipulation')

class LocalStorage {

    constructor(req, res, disk){
        this.req = req;
        this.res = res;
        this.filesystem = config('medialibrary', (Var) => { return Var['disk_name']});
        this.disk = disk
        this.file = null
    }

    uploadBuffer(file, buffer){
        // let dir = path.join(this.req.user.id.toString() , Date.now().toString());
        let destination = path.join(this.req.user.id.toString() , 'photos', Date.now().toString());
        let name = file.originalname;
        let uploadPath = path.join(this.disk.root, destination, name);

        file.newDestination = destination;
        file.newPath = path.join(destination, name);

        this.file = file;
        return Jimp.read(buffer)
            .then(image => {
                return image.writeAsync(uploadPath);
            });
    }

    async saveToDatabase(model){
        console.log(this.file);
        let media = new Media({
            user_id: model.id,
            name: this.file.originalname,
            mime_type: this.file.mimetype,
            disk: this.filesystem,
            size: this.file.size,
            path: this.file.newDestination,
            location: `${this.disk.url}/${this.file.newPath}`
        });
        await media.save();
        userLog(`"${model.username}" just uploaded some photos.`);
        console.log(`@${model.username} just uploaded some photos!, @ ${new Date().toTimeString()}`);
    }
}
module.exports = LocalStorage;
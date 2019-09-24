const path = require('path');
const Jimp = require('jimp')
const Media = require('@models/media')

class LocalStorage {

    constructor(req, res, disk){
        this.req = req;
        this.res = res;
        this.filesystem = config('medialibrary', (Var) => { return Var['disk_name']});
        this.disk = disk
        this.file = null
    }

    uploadBuffer(file, buffer){
        let newPath = path.join(this.req.user.id.toString() , 'photos', Date.now().toString());
        let name = file.originalname;
        let destination = path.join(newPath, name);
        file.newDestination = destination;
        file.newPath = newPath
        this.file = file;

        return Jimp.read(buffer)
            .then(image => image.writeAsync(path.join(this.disk.root, destination)));
    }

    async saveToDatabase(model){
        let media = new Media({
            user_id: model.id,
            name: this.file.originalname,
            mime_type: this.file.mimetype,
            disk: this.filesystem,
            size: this.file.size,
            path: this.file.newPath,
            location: `${this.disk.url}/${this.file.newDestination}`
        });
        userLog(`"${model.username}" just uploaded some photos.`);
        console.log(`@${model.username} just uploaded some photos!, @ ${new Date().toTimeString()}`);
        return  await media.save();
    }

}
module.exports = LocalStorage;
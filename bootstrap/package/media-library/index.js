const fs = require('fs')
const path = require('path')
const Media = require('@models/media');


class MediaLibrary extends Media {

    constructor(req, res){
        super();
        this.req = req;
        this.res = res;
        this.instance = null
        this.initialize();
    }

    initialize(){
        let disk_name = config('medialibrary', (Var) => { return Var['disk_name'] });
        let disk = config('filesystems', (Var) => { return Var.disks[disk_name]});
        let drive_folder = disk.driver || null;
        const ClassPath = path.join(__dirname, 'disks', drive_folder, 'index.js');

        try {
            if (fs.existsSync(ClassPath)) {
                let Storage = require(ClassPath)
                this.instance = new Storage(this.req, this.res, disk);
            }
        } catch(err) {
            console.error(err)
        }
    }

    async addMediaFromBase64(){
        try {
            let file = this.refactorFileData(this.req.body),
                buffer = this.decodeBase64Image(this.req.body.base64Data),
                mediaObject = await this.instance.uploadBuffer(file, buffer);
                return await this.saveToDatabase(mediaObject);
        }catch (e) {
            throw e;
        }
    }

    refactorFileData(file)
    {
        return {
            originalname: file.name.replace(" ", "-"),
            mimetype: file.mimetype,
            size: file.size,
        };
    }

    decodeBase64Image(dataString)
    {
        let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        return (matches.length !== 3)? new Error('Invalid input string') : new Buffer(matches[2], 'base64');
    }

    async saveToDatabase(mediaObject)
    {
        try {
            mediaObject.user_id = this.req.user.id;
            let media = new Media(mediaObject);

            userLog(`"${this.req.user.username}" just uploaded some photos.`);
            console.log(`@${this.req.user.username} just uploaded some photos!, @ ${new Date().toTimeString()}`);
            return  await media.save();
        }catch (e) {
            throw e;
        }
    }
}
module.exports = MediaLibrary;
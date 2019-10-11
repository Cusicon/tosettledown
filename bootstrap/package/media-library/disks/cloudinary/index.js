const cloudinary = require('cloudinary');
const Datauri = require('datauri');
const Mime = require('mime-types')
const path = require('path');
const url = require("url");
const Media = require('@models/media')

class CloudinaryStorage {

    constructor(req, res, disk){
        this.req = req;
        this.res = res;
        this.filesystem = config('medialibrary', (Var) => { return Var['disk_name']});
        this.disk = disk

        cloudinary.config({
            cloud_name: this.disk.cloud_name,
            api_key: this.disk.api_key,
            api_secret: this.disk.api_secret,
        });
    }

    async uploadBuffer(file, buffer){

        let destination = path.join(this.req.user.id.toString() , 'photos', Date.now().toString());
        let name = file.originalname;
        let uploadPath = path.join(destination, name);

        let mimetype = Mime.extension(file.mimetype);
        let dataUri = new Datauri();
        dataUri.format(`.${mimetype}`, buffer);
        let dataBase64 = dataUri.content;

        let options = {
            resource_type: 'image',
            public_id: uploadPath.split('.').slice(0, -1).join('.').replace(" ", "_").replace("-", "_"),
            overwrite: true,
        }

        try{
            let data = await cloudinary.v2.uploader.upload(dataBase64, options);

            console.log(data)



            file.newDestination = data.secure_url || data.url;
            file.newPath = destination


            let mediaObject = {
                name : path.basename(url.parse(data.secure_url || data.url).pathname),
                mime_type : file.mimetype,
                size : data.bytes,
                path : ,
                location : data.secure_url || data.url,
            }

            this.file = file;
        }catch(e){
            throw e;
        }
    }

    async saveToDatabase(model){
        let media = new Media({
            user_id: model.id,
            disk: this.filesystem,

            name: this.file.originalname,
            mime_type: this.file.mimetype,
            size: this.file.size,
            path: this.file.newPath,
            location: this.file.newDestination
        });
        userLog(`"${model.username}" just uploaded some photos.`);
        console.log(`@${model.username} just uploaded some photos!, @ ${new Date().toTimeString()}`);
        return  await media.save();
    }
}
module.exports = CloudinaryStorage;
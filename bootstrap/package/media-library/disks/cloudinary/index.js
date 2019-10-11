const cloudinary = require('cloudinary');
const Datauri = require('datauri');
const Mime = require('mime-types')
const path = require('path');
const url = require("url");

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

        let mimetype = Mime.extension(file.mimetype);
        let dataUri = new Datauri();
        let dataBase64 = dataUri.format(`.${mimetype}`, buffer).content;
        let options = {
            folder: path.join(this.req.user.id.toString() , 'photos', Date.now().toString()),
            public_id: path.parse(file.originalname).name,
            overwrite: true,
            invalidate: false,
        }

        try{
            let data = await cloudinary.v2.uploader.upload(dataBase64, options);
            return {
                disk: this.filesystem,
                name : path.basename(url.parse(data.secure_url || data.url).pathname),
                mime_type : file.mimetype,
                size : data.bytes,
                path : (data.version) ? path.join(`v${data.version}`, path.parse(`${data.public_id}.${data.format}`).dir)
                                        :path.parse(`${data.public_id}.${data.format}`).dir,
                location : data.secure_url || data.url,
            }
        }catch(e){
            throw e;
        }
    }
}
module.exports = CloudinaryStorage;
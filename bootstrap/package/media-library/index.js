const fs = require('fs')
const path = require('path')
const multer = require('multer');
const Media = require('@models/media');
const Manipulation = require('@media-library/manipulation')
const util = require('util');

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

    async uploadToTemp(name) {

        let temp_path = config('medialibrary', (Var) => {
            return Var.temporary_directory_path
        });

        let filename = function (req, file, cb) {
            let name = `${req.user._id}_${Date.now().toString()}`;
            name = name.concat(path.extname(file.originalname));
            cb(null, name)
        }

        let file_filter = function (req, file, callback) {
            let ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        }

        let storage = multer.diskStorage({
            destination: temp_path,
            filename: filename,
            fileFilter: file_filter,
        })

        try {
            let uploadConfig = multer({
                storage: storage,
                limits: {fileSize: 5242880}, // Max: 5MB
            })
            const upload = util.promisify(uploadConfig.single(name));
            await upload(this.req, this.res);
            console.log('upload to temp done');
        } catch (err) {
            throw err;
        }
    }

    async manipulateMedia(file){
        let manipulation = new Manipulation()
        return await manipulation.manipulate(file)
    }

    async addMedia(name, callback) {
        if (this.instance !== null) {

            try{

                await this.uploadToTemp(name);
                console.log(this.req.file)

                let buffer = await this.manipulateMedia(this.req.file)
                console.log(buffer)

                let upload = await this.instance.uploadBuffer(this.req.file, buffer)
                console.log(upload)

                await this.instance.saveToDatabase();



            }catch (err) {
                throw err
            }



            //manipulate
            //savetodatabase

            // this.instance.upload({type: model_type , id : model_id}, name, newName = null, callback);

        } else {
            throw new Error('The Media Instance Can\'t be Null');
        }
    }


}
module.exports = MediaLibrary;
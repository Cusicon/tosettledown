const multer = require('multer');
const path = require('path');
const Media = require('@models/media')

class LocalStorage {

    constructor(req, res, disk){
        this.req = req;
        this.res = res;
        this.filesystem = config('medialibrary', (Var) => { return Var['disk_name']});
        this.disk = disk
    }

    upload(model, name, newName = null, callback){

        let image_path = path.join(this.req.user.id.toString() , 'photos', Date.now().toString());

        let filename = function(req, file, cb){
            let name = (newName)? newName.concat(path.extname(file.originalname)) : file.originalname;
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
            destination: path.join(this.disk.root, image_path),
            filename: filename,
            fileFilter: file_filter,
        })

        let upload = multer({
            storage: storage,
            limits: {fileSize: 5242880}, // Max: 5MB
        }).array(name, 5);

        upload(this.req, this.res, (err) => {
            this.saveModel(model, this.req)
            callback(this.req, this.res, err)
        });
    }

    saveModel(model, req){
        req.files.forEach((file) => {
            let filePath = file.path.split('/public/store/')[1];
            let diskUrl = this.disk.url;

            let media = new Media({
                model: model.type,
                model_id: model.id,
                name: file.filename,
                mime_type: file.mimetype,
                disk: this.filesystem,
                path: filePath,
                location: `${diskUrl}/${filePath}`
            });

            media.save((err) => {
                if (err) throw err;
                else {
                    userLog(`"${req.user.username}" just uploaded some photos.`);
                    console.log(`@${req.user.username} just uploaded some photos!, @ ${new Date().toTimeString()}`);
                }
            });
        });

    }
}

module.exports = LocalStorage;
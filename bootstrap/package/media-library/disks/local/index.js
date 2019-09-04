const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Media = require('@models/media')
const Manipulation = require('@media-library/manipulation')

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

            media.save((err, model) => {
                if (err) throw err;
                else {
                    let manipulation = new Manipulation(model)
                    manipulation.manipulate((model, options, files) => {

                        model.manipulation = options.toString();
                        model.responsive_images = this.put(this.disk, model, files);
                        model.updated_at = Date.now();
                        model.save((err, result) =>{
                            if(err) throw err;
                            console.log(result)
                        })
                    });
                    userLog(`"${req.user.username}" just uploaded some photos.`);
                    console.log(`@${req.user.username} just uploaded some photos!, @ ${new Date().toTimeString()}`);
                }
            });
        });

    }

    put(disk, model, files){
        let folderPath = path.dirname(model.path);
        let remoteLocationPath = path.join(disk.url, folderPath, 'responsive_images');
        let responsiveFolderPath = path.join(folderPath, 'responsive_images');
        let imageNameWithoutExt = path.basename(model.name, path.extname(model.name));
        let ext = path.extname(model.name);
        let responsive_images = {};
        fs.mkdirSync(path.join(disk.root, responsiveFolderPath), { recursive: true });

        if(files.length > 1){
            files.forEach(file => {
                let folderLocation = path.join(responsiveFolderPath, `${imageNameWithoutExt}_${file.option.width}x${file.option.height}${ext}`);
                let remoteLocation = path.join(remoteLocationPath, `${imageNameWithoutExt}_${file.option.width}x${file.option.height}${ext}`);

                fs.renameSync(file.path, path.join(disk.root, folderLocation));

                responsive_images[file.option.name] = {
                    path: folderLocation,
                    location: remoteLocation,
                }
            });
            let groupFolderName = path.dirname(files[0].path)
            fs.rmdirSync(groupFolderName);
        }
        return responsive_images.toString();
    }
}
module.exports = LocalStorage;
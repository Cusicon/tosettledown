const aws = require('aws-sdk/index');
const multer = require('multer');
const multerS3 = require('multer-s3');

const path = require('path');
const Media = require('@models/media')

class DigitalOceanStorage {

    constructor(req, res, disk){
        this.req = req;
        this.res = res;
        this.filesystem = config('medialibrary', (Var) => { return Var['disk_name']});
        this.disk = disk
    }

    upload(model, name, newName = null, callback){




        let filename = function(req, file, cb){
            let image_path = path.join(req.user.id.toString() , 'photos', Date.now().toString());
            let name = (newName)? path.join(image_path, newName.concat(path.extname(file.originalname))) : path.join(image_path, file.originalname);
            cb(null, name)
        }

        let file_filter = function (req, file, callback) {
            let ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        }

        aws.config.update({
            accessKeyId: this.disk.key,
            secretAccessKey: this.disk.secret
        });

        const spacesEndpoint = new aws.Endpoint('sfo2.digitaloceanspaces.com');
        const s3 = new aws.S3({
            endpoint: spacesEndpoint
        });

        let storage = multerS3({
            s3: s3,
            bucket: this.disk.bucket,
            acl: 'public-read',
            key: filename,
            fileFilter: file_filter,
        })

        // Change bucket property to your Space name
        const upload = multer({
            storage: storage,
            limits: {fileSize: 5242880}, // Max: 5MB
        }).array(name, 5);


        upload(this.req, this.res, (err) => {
            console.log(this.req.files)
            this.saveModel(model, this.req)
            callback(this.req, this.res, err)
        });
    }

    saveModel(model, req){
        req.files.forEach((file) => {
            let media = new Media({
                model: model.type,
                model_id: model.id,
                name: file.originalname,
                mime_type: file.mimetype,
                disk: this.filesystem,
                path: file.key,
                location: file.location
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

module.exports = DigitalOceanStorage;
const aws = require('aws-sdk/index');
const multer = require('multer');
const multerS3 = require('multer-s3');

const fs = require('fs');
const Manipulation = require('@media-library/manipulation')

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
        let s3 = new aws.S3({
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

            media.save((err, model) => {
                if (err) throw err;
                else {
                    let manipulation = new Manipulation(model)
                    manipulation.manipulate((model, options, files) => {

                        model.manipulation = options.toString();

                        this.put(this.disk, model, files, (model, images) => {
                            model.responsive_images = images.toString();
                            model.updated_at = Date.now();
                            model.save((err) => { if(err) throw err; })
                            let groupFolderName = path.dirname(files[0].path)
                            fs.rmdirSync(groupFolderName);
                        });
                    });
                    userLog(`"${req.user.username}" just uploaded some photos.`);
                    console.log(`@${req.user.username} just uploaded some photos!, @ ${new Date().toTimeString()}`);
                }
            });
        });
    }


    put(disk, model, files, cb){

        aws.config.update({
            accessKeyId: this.disk.key,
            secretAccessKey: this.disk.secret
        });
        const spacesEndpoint = new aws.Endpoint('sfo2.digitaloceanspaces.com');

        let folderPath = path.dirname(model.path);
        let responsiveFolderPath = path.join(folderPath, 'responsive_images');
        let imageNameWithoutExt = path.basename(model.name, path.extname(model.name));
        let ext = path.extname(model.name);
        let responsive_images = {};

        if(files.length > 1){

            files.forEach((file, index) => {

                let folderLocation = path.join(responsiveFolderPath, `${imageNameWithoutExt}_${file.option.width}x${file.option.height}${ext}`);
                let s3 = new aws.S3({ endpoint: spacesEndpoint });
                let uploadParams = {Bucket: 'tosettledown',Key: folderLocation, Body: ''};
                // Configure the file stream and obtain the upload parameters
                let fileStream = fs.createReadStream(file.path);
                fileStream.on('error', function(err) {console.log('File Error', err);});
                uploadParams.Body = fileStream;

                // call S3 to retrieve upload file to specified bucket
                s3.upload (uploadParams, function (err, data) {
                    if (err) {
                        console.log("Error", err);
                    } if (data) {
                        responsive_images[file.option.name] = {
                            path: data.key,
                            location: data.Location,
                        }

                        if(index === files.length - 1){
                            cb(model, responsive_images)
                        }
                    }
                });
                fs.unlinkSync(file.path);
            });
        }
    }
}
module.exports = DigitalOceanStorage;
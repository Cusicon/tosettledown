const aws = require('aws-sdk/index');
const multer = require('multer');
const multerS3 = require('multer-s3');


const cloudinary = require('cloudinary');
const Datauri = require('datauri');
const Mime = require('mime-types')
const path = require('path');

const fs = require('fs');
const Manipulation = require('@media-library/manipulation')
const Media = require('@models/media')

class DigitalOceanStorage {

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
            //notification_url: "https://mysite.example.com/notify_endpoint"
        }

        try{
            let data = await cloudinary.v2.uploader.upload(dataBase64, options);
            console.log(data)

            file.newDestination = data.secure_url || data.url;
            file.newPath = destination
            this.file = file;
        }catch(e){
            throw e;
        }
    }

    async saveToDatabase(model){
        let media = new Media({
            user_id: model.id,
            name: this.file.originalname,
            mime_type: this.file.mimetype,
            disk: this.filesystem,
            size: this.file.size,
            path: this.file.newPath,
            location: this.file.newDestination
        });
        userLog(`"${model.username}" just uploaded some photos.`);
        console.log(`@${model.username} just uploaded some photos!, @ ${new Date().toTimeString()}`);
        return  await media.save();
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
                        model.manipulation = options;
                        this.put(this.disk, model, files, (model, images) => {
                            model.responsive_images = images;
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
        let responsiveFolderPath = path.join(folderPath, 'responsive-images');
        let imageNameWithoutExt = path.basename(model.name, path.extname(model.name));
        let ext = path.extname(model.name);
        let responsive_images = {};

        if(files.length > 1){
            const s3FilesUpload = async () => {
                for (const file of files) {
                    let folderLocation = path.join(responsiveFolderPath, `${imageNameWithoutExt}-${file.option.width}x${file.option.height}${ext}`);

                    let s3 = new aws.S3({endpoint: spacesEndpoint});
                    let uploadParams = {Bucket: 'tosettledown', Key: folderLocation, Body: '', ACL: 'public-read'};
                    // Configure the file stream and obtain the upload parameters
                    let fileStream = fs.createReadStream(file.path);

                    fileStream.on('error', function (err) { console.log('File Error', err) });
                    uploadParams.Body = fileStream;

                    // call S3 to retrieve upload file to specified bucket
                    await s3.upload(uploadParams).promise().then(data => {
                        responsive_images[file.option.name] = {
                            path: data.key,
                            location: data.Location,
                        }
                        fs.unlinkSync(file.path);
                    })
                }
            }

            s3FilesUpload().then(response => {
                console.log(response);
                cb(model, responsive_images)
            });
        }
    }
}
module.exports = DigitalOceanStorage;
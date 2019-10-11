const aws = require('aws-sdk/index');
const path = require('path');
const Media = require('@models/media')

class DigitalOceanStorage {

    constructor(req, res, disk){
        this.req = req;
        this.res = res;
        this.filesystem = config('medialibrary', (Var) => { return Var['disk_name']});
        this.disk = disk

        aws.config.update({
            accessKeyId: this.disk.key,
            secretAccessKey: this.disk.secret
        });
    }

    async uploadBuffer(file, buffer)
    {
        const spacesEndpoint = new aws.Endpoint(`${this.disk.region}.digitaloceanspaces.com`);
        let s3 = new aws.S3({ endpoint: spacesEndpoint });
        let options = {
            Bucket: this.disk.bucket,
            Key: path.join(path.join(this.req.user.id.toString() , 'photos', Date.now().toString()), file.originalname),
            Body: buffer,
            ACL: 'public-read'
        };
        console.log('here');

        try{

            let data = await s3.upload(options).promise();

            console.log(data)

            return {
                disk: this.filesystem,

                // name : path.basename(url.parse(data.secure_url || data.url).pathname),
                name : file.originalname,
                mime_type : file.mimetype,
                size : file.size,

                path : data.key,
                location : data.Location,
            }
        }catch(e){
            throw e;
        }
    }
}
module.exports = DigitalOceanStorage;
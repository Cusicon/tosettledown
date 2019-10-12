const aws = require('aws-sdk/index');
const path = require('path');
const Mime = require('mime-types')

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
            Key: path.join(this.req.user.id.toString(), 'photos', Date.now().toString(), file.originalname),
            Body: buffer,
            ACL: 'public-read'
        };

        try
        {
            let data = await s3.upload(options).promise();
            return {
                disk: this.filesystem,
                name : path.basename(data.key),
                mime_type : Mime.contentType(path.extname(data.key)),
                size : buffer.toString().length,
                path : path.parse(data.key).dir,
                location : data.Location,
            }
        }catch(e){
            throw e;
        }
    }
}
module.exports = DigitalOceanStorage;
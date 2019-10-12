const Media = require('@models/media');
const User = require('@models/user');

const cloudinary = require('cloudinary');
const path = require('path');
const url = require("url");

module.exports = class DigitalOceanToCloudinary{
    constructor(){
        this.args = null;

        this.filesystem = 'cloudinary';
        this.disk = config('filesystems', (Var) => { return Var['disks'][this.filesystem] })

        cloudinary.config({
            cloud_name: this.disk.cloud_name,
            api_key: this.disk.api_key,
            api_secret: this.disk.api_secret,
        });

        console.log('Starting DO to CLOUDINARY MIGRATION')
    }

    parseArgsObj(args){
        this.args = args;
    }

    async fire() {
        try{
            let medias = await Media.find({disk: 'digitalocean'});
            console.info(`Total Number Of Media Is ${medias.length} \n`);
            for(const media of medias)
            {
                let data = await this.moveMedia(media);

                media.disk = data.disk;
                media.name = data.name;
                media.mime_type = data.mime_type;
                media.size = data.size;
                media.path = data.path;
                media.location = data.location;
                console.log(await media.save());
            }
            let users = await User.find();

            for(const user of users){
                let media = await user.photos();
                user.avatar = (media.length)? media[0].location : null;
                await user.save();
            }

        }catch (e) {
            console.log(e.message)
        }
    }

    async moveMedia(media)
    {
        let options = {
            folder: path.parse(url.parse(media.location).pathname).dir.slice(1),
            public_id: path.parse(path.basename(url.parse(media.location).pathname)).name.replace(" ", "-"),
            overwrite: true,
            invalidate: false,
        }

        try{
            let data = await cloudinary.v2.uploader.upload(media.location, options);
            return {
                disk: this.filesystem,
                name : path.basename(url.parse(data.secure_url || data.url).pathname),
                mime_type : media.mime_type,
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
const Media = require('@models/media');
const path = require('path')

module.exports = class DigitalOceanToCloudinary{
    constructor(){
        this.args = null;

        console.log('Starting DO to CLOUDINARY MIGRATION')
    }

    parseArgsObj(args){
        this.args = args;
    }

    async fire() {
        try{
            let medias = await Media.find({disk: 'digitalocean'});

            console.info(`Total Number Of Media Is ${medias.length} \n`);

            for(const media of medias){

                console.log('moving....', media)
                // await this.moveMedia(media);
            }

        }catch (e) {
            console.log(e.message)
        }
    }

    async moveMedia(media){



        let options = {
            folder: path.join(this.req.user.id.toString() , 'photos', Date.now().toString()),
            public_id: path.parse(path.basename(media.path)).name,

            overwrite: true,
            invalidate: false,
        }

        try{
            let data = await cloudinary.v2.uploader.upload(media.location, options);

            return {
                disk: 'cloudinary',
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
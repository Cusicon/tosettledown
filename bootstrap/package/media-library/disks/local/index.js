const path = require('path');
const Jimp = require('jimp')
const Mime = require('mime-types')

class LocalStorage {

    constructor(req, res, disk){
        this.req = req;
        this.res = res;
        this.filesystem = config('medialibrary', (Var) => { return Var['disk_name']});
        this.disk = disk
    }

    async uploadBuffer(file, buffer)
    {
        let destination = path.join(this.req.user.id.toString(), 'photos', Date.now().toString(), file.originalname);

        try
        {
            let image = await Jimp.read(buffer);
            await image.writeAsync(path.join(this.disk.root, destination));

            return {
                disk: this.filesystem,
                name: path.basename(destination),
                mime_type: Mime.contentType(path.extname(destination)),
                size: buffer.toString().length,
                path: path.parse(destination).dir,
                location: `${this.disk.url}/${destination}`,
            }
        }catch(e){
            throw e;
        }
    }
}
module.exports = LocalStorage;
const fs = require('fs')
const path = require('path')
const Media = require('@models/media');

class hasMedia extends Media {

    constructor(req, res, model, model_name = 'user'){
        super();
        this.req = req;
        this.res = res;
        this.model_id = model.id;
        this.model_name = model_name;
        this.instance = null
    }

    addMedia(name, newName = null, callback){
        this.initialize();
        let model_type = this.model_name;
        let model_id = this.model_id;
        this.instance.upload({type: model_type , id : model_id}, name, newName = null, callback);
    }

    initialize(){
        let disk_name = config('medialibrary', (Var) => { return Var['disk_name'] });
        let disk = config('filesystems', (Var) => { return Var.disks[disk_name]})
        let drive_folder = disk.driver || null;

        const ClassPath = path.join('..','disks', drive_folder, 'index.js');

        let Storage = require(ClassPath)
        this.instance = new Storage(this.req, this.res, disk);

        // fs.access(ClassPath, fs.F_OK, (err) => {
        //     if (err) {
        //         console.error(err)
        //         return null;
        //     }
        //     let Storage = require(ClassPath)
        //     this.instance = new Storage(this.req, this.res, disk);
        // });
    }
}
module.exports = hasMedia;
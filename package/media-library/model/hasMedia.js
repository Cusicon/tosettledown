const Media = require('./media');

class hasMedia extends Media {

    constructor(req, res, model, model_name = 'user'){
        super();
        this.req = req;
        this.res = res;
        this.model_id = model.id;
        this.model_name = model_name;
    }

    addMedia(name, newName = null, callback){
        let instance = this.instance();
        let model_type = this.model_name;
        let model_id = this.model_id;
        instance.upload({type: model_type , id : model_id}, name, newName = null, callback);
    }

    instance(){
        let disk_name = config('medialibrary', (Var) => { return Var['disk_name'] });

        let disk = config('filesystems', (Var) => { return Var.disks[disk_name]})
        let drive_folder = disk.driver;
        let Storage = require(`../disks/${drive_folder}`)
        return new Storage(this.req, this.res, disk);
    }

}

module.exports = hasMedia;
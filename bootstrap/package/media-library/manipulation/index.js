const Jimp = require('jimp');
const path = require('path');

class Manipulation{

    constructor(model, options = null){

        let defaultOption = config('medialibrary',(Var) => { return Var.responsive_images.option});
        if (typeof options === 'object' && options !== null) {
            this.option = {...defaultOption, ...option };
        }else {
            this.option = defaultOption;
        }
        this.model = model;
        this.temp_path = config('medialibrary',(Var) => { return Var.responsive_images.temporary_directory_path});
    }

    manipulate(cb){
        let fileUrl = this.model.location;
        let fileExt = path.extname(this.model.path);

        Jimp.read(fileUrl, (err, file) => {
            if (err) throw err;
            let arrayFiles = [];

            for (let type in this.option) {
                if (this.option.hasOwnProperty(type)) {
                    let file_temp_path = path.join(this.temp_path, this.model.id, `${this.option[type].name}${fileExt}`);

                    if(this.option[type].quality){
                        file.clone().resize(this.option[type].width, this.option[type].height)
                            .quality(this.option[type].quality)
                            .write(file_temp_path);
                    }else{
                        file.clone().resize(this.option[type].width, this.option[type].height)
                            .write(file_temp_path);
                    }
                    arrayFiles.push({
                        path: file_temp_path,
                        option : this.option[type]
                    });
                }
            }
            cb(this.model, this.option, arrayFiles)
        });
    }




}

module.exports = Manipulation;
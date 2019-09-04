const Jimp = require('jimp');
const path = require('path');

class Manipulation{

    constructor(model, options = null){

        let defaultOption = {
            'blur':{
                width : 250,
                height : 250,
                quality : 2,
                name: 'blur',
            },
            'md':{
                width : 300,
                height : 300,
                quality : 100,
                name: 'md'
            },
            'lg':{
                width : 600,
                height : 600,
                quality : 100,
                name: 'lg'
            }
        }

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
        let filePath = path.dirname(this.model.path);
        let fileExt = path.extname(this.model.path);

        Jimp.read(fileUrl, (err, file) => {
            if (err) throw err;

            let arrayFiles = [];
            for (let size in this.option) {
                if (this.option.hasOwnProperty(size)) {
                    let file_temp_path = path.join(this.temp_path, this.model.id, `${this.option[size].name}${fileExt}`);
                    file.resize(this.option[size].width, this.option[size].height) // resize
                        .quality(this.option[size].quality) // set JPEG quality
                        .write(file_temp_path); // save

                    arrayFiles.push({
                        path: file_temp_path,
                        option : this.option[size]
                    });
                }
            }
            cb(this.model, this.option, arrayFiles)
        });
    }




}

module.exports = Manipulation;
const Jimp = require('jimp');

class Manipulation{

    constructor(options = null){
        let defaultOption = config('medialibrary',(Var) => { return Var.manipulation});
        if (typeof options === 'object' && options !== null) {
            this.option = {...defaultOption, ...option };
        }else {
            this.option = defaultOption;
        }
    }

    manipulate(file){
        return Jimp.read(file.path)
            .then(file => file//resize(this.option.width, this.option.height)
                    .quality(this.option.quality)
                    .getBufferAsync(file.getMIME())
            ).catch(err => {
                throw err;
            });
    }
}
module.exports = Manipulation;
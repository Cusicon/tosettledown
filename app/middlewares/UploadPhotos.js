const multer = require('multer');
const path = require('path');

// MULTER CODE...
function checkFileTypes(file, cb) {
    // Allowed Extension
    var fileTypes = /jpeg|png|gif/i;

    // Check Extension
    var extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    // Check mimetypes
    var mimeTypes = fileTypes.test(file.mimetypes)

    // Check if all is true
    if (extname && mimeTypes) {
        return cb(null, false);
    } else {
        return cb("Please upload an image!");
    }
}

// Disk Storage for users
function multerStorage(userDir) {
    return multer.diskStorage({
        destination: `${userDir}/photos`,
        filename: (req, file, cb) => {
            cb(null, `photo_${new Date().now()}${path.extname(file.originalname)}`)
        }
    })
}

// Saves the image to the server!
module["exports"] = function (req, res, next) {
    let _uploadPhotos = multer({
        dest: `${__user.userDirectoriesLocation}/photos/`,
        storage: multerStorage(__user.userDirectoriesLocation),
        limits: {
            fileSize: 5242880 // Max: 5MB
        },
        fileFilter: (req, file, cb) => {
            checkFileTypes(file, cb);
        }
    });
    _uploadPhotos.array("addPhotos", 5);
    next();
}
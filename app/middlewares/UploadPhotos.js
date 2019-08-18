const multer = require('multer');
const path = require('path');

// MULTER CODE...
function checkFileTypes(req, file, cb) {
    // Allowed Extension
    let fileTypes = /jpeg|png|gif/i;
    // Check Extension
    let extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // Check mimetypes
    let mimeTypes = fileTypes.test(file.mimetypes)

    // Check if all is true
    if (extname && mimeTypes) {
        return cb(null, true);
    } else {
        return cb("Please upload an image!");
    }
}

// Disk Storage for users
function multerStorage() {
    console.log("i reach here")
    return multer.diskStorage({
        destination: public_path(`photos`),
        filename: (req, file, cb) => {
            cb(null, `photo_${new Date().now()}${path.extname(file.originalname)}`)
        }
    })
}

// Saves the image to the server!
module["exports"] = multer({
    storage: multerStorage(),
    limits: {fileSize: 5242880}, // Max: 5MB
    fileFilter: checkFileTypes,
});
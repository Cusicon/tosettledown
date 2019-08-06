// Export PackageSchema
const Package = require('@schema/PackageSchema');

module.exports = Package;

//-- GetPackageById
module.exports.getPackageById = function (id, callback) {
    Package.findById(id, callback);
};

//-- GetPackageByPackagename
module.exports.getPackageByPackagename = function (username, callback) {
    var query = {
        username: username
    };
    Package.findOne(query, callback);
};

//-- CreatePackage
module.exports.createPackage = function (newPackage, callback) {};
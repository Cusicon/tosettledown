const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
var Schema = mongoose.Schema;

var PackageSchema = Schema({
    premium: [{
        userId: String,
        transact: [{ //-- In Code, to search for the lastest transact: [Array].lastIndexOf(); 
            transactId: String,
            type: String, //-- Either Silver, Gold or Ruby
            boughtOn: String, //-- Date of purchase
            amount: String, //-- How much you bought it.
            isActive: Boolean,
            duration: String, // E.g 7 days.
            expiryDate: String
        }]
    }],
    settles: [{
        userId: String,
        settle: [{ //-- In Code, to search for the lastest transact: [Array].lastIndexOf(); 
            settleId: String,
            boughtOn: String, //-- Date of purchase
            amount: String, //-- How much you bought it.
            bBalance: String, // E.g 7 days.
            expiryDate: String
        }]
    }]
});

// Export PackageSchema
const Package = (module.exports = mongoose.model(
    "Packages",
    PackageSchema
));

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
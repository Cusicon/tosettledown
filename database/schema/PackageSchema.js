const mongoose = require("mongoose");

let package_schema = mongoose.Schema({
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

module['exports'].schema = package_schema;
module['exports'].model = mongoose.model( "package", package_schema);
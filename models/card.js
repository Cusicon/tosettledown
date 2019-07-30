const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
var Schema = mongoose.Schema;

var CardSchema = Schema({
    userId: String,
    uploaded: String,
    image: {
        name: String,
        location: String,
        isDp: Boolean
    },
});

// Export CardSchema
const Card = (module.exports = mongoose.model(
    "Cards",
    CardSchema
));

//-- GetCardById
module.exports.getCardById = function (id, callback) {
    Card.findById(id, callback);
};

//-- GetCardByCardname
module.exports.getCardByCardname = function (username, callback) {
    var query = {
        username: username
    };
    Card.findOne(query, callback);
};

//-- CreateCard
module.exports.createCard = function (newCard, callback) {};
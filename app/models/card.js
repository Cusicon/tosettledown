// Export CardSchema
const Card = require('@schema/CardSchema');

module.exports = Card;

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
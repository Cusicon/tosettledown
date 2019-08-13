let User = require('@models/user');

const EncounterController = class EncounterController{
    constructor()
    {
    }

    index(req, res)
    {
        User.find((err, users) => {
            if (err) throw err;
            else {
                res.render('./app/menu/encounters', {
                    title: "Encounters",
                    users: users.sort(() => Math.random() - 0.5 * 0.5) // Shuffle the array
                });
            }
        });
    }

    getUsers(req, res)
    {
        User.estimatedDocumentCount();
        User.find((err, users) => {
            if (err) throw err;
            else {
                res.send({
                    users: users.sort(() => Math.random() - 0.5 * 0.5) // Shuffle the array
                });
            }
        });
    }

};

module["exports"] = new EncounterController();
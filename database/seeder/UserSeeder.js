let User = require('@models/user');
let UserFactory = require('@database/factory/UserFactory');

module['exports'] = function (number_of_loop = 10) {
    for (let i =0 ; i < number_of_loop; i++)  {
        User.createUser(new User(UserFactory()), (err, user) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(`A new account was created, "@${user.username}"`);
            }
        });

    }
};
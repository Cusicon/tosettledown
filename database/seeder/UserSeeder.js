let User = require('@models/user');
let UserFactory = require('@database/factory/UserFactory');

module['exports'] = async function (number_of_loop = 5) {
    for (let i = 0; i < number_of_loop; i++) {
        let fakeUser = new User(UserFactory());
        try{
            let user = await User.findOne({username: fakeUser.username});

            if (user) {
                console.log(`Username ${user.username} is taken!, Try adding "_" or "." `);
            } else {
                user = await User.createUser(fakeUser);
                if (user) {
                    console.log(`A new account just created "@${user.username}"`);
                }
            }
        }catch(err){
            console.log(err);
        }


    }
};
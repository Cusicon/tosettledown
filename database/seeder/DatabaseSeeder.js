let Bootstrap = require("../../bootstrap/index");
new Bootstrap(`${__dirname}/../../`).initConsole();


class DatabaseSeeder{

    run() {
        this.call('UserSeeder', 20);

    }

    call(seeder, no_of_loop = null)
    {
        if(no_of_loop != null && !isNaN(no_of_loop))
        {
            let seed = require(`@seeder/${seeder}`);
            seed(no_of_loop);
        }
        else
        {
            require(`@seeder/${seeder}`)()
        }
    }
}

database_seeder = new DatabaseSeeder().run();


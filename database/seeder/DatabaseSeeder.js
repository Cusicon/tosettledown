let Bootstrap = require("../../bootstrap/index");
new Bootstrap(`${__dirname}/../../`).initConsole();


class DatabaseSeeder{

    async run() {
        await this.call('UserSeeder', 5);

    }

    async call(seeder, no_of_loop = null)
    {
        if(no_of_loop != null && !isNaN(no_of_loop))
        {
            let seed = require(`@seeder/${seeder}`);
            await seed(no_of_loop);
        }
        else
        {
            require(`@seeder/${seeder}`)()
        }
    }
}

database_seeder = new DatabaseSeeder().run().then(e => process.exit(0));


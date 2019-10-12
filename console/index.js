let Bootstrap = require("../bootstrap/index");
new Bootstrap(`${__dirname}/../`).initConsole();

let commands = {
    doniary : require('./DigitalOceanToCloudinary'),
}

if(commands['doniary']){
    let command = new commands['doniary']();
    // command.parseArgsObj('args')
    command.fire().then(e => process.exit(0));
}else{
    console.error('The Command XXXXX Was Not Founf')
}
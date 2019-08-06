const mongoose = require("mongoose");

// noinspection JSIgnoredPromiseFromCall
mongoose.connect(config('database','uri'), { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open to ' + config('database','uri'));
});

mongoose.connection.on('error', (err) => {
    console.log('handle mongo errored connections: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('App terminated, closing mongo connections');
        process.exit(0);
    });
});




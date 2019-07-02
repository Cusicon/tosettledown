const mongoose = require("mongoose");
const connectionUrl =
    process.env.MONGOLAB_URI ||
    process.env.MONGODB_URI ||
    'mongodb://success:0123456789jehova.@ds135433.mlab.com:35433/heroku_5m6mvm1g';

// ## DB CONNECTION 
mongoose.connect(connectionUrl); //-- after "localhost" your db's name follows
const db = mongoose.connection;

//-- Check for DB connection
db.once("open", () => {
    console.log("Connected to MongoDB...");
    console.log("Connected to Database -> Tosettledown.");
});

//-- check for DB errors
db.on("error", err => {
    Log(err);
});

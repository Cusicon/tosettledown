const mongoose = require("mongoose");
const keys = require("../config/keys");
const connectionUrl = process.env.MONGODB_URI || keys.mongodb.localURI || keys.mongodb.onlineURI;

// ## DB CONNECTION 
mongoose.connect(connectionUrl, { useNewUrlParser: true }); //-- after "localhost" your db's name follows
const db = mongoose.connection;

//-- Check for DB connection
db.once("open", () => {
    console.log("Connected to MongoDB...");
    console.log("Connected to Database -> Tosettledown.");
});

//-- check for DB errors
db.on("error", err => {
    console.log(err);
});

const mongoose = require("mongoose");
const connectionUrl = process.env.MONGOLAB_URI || "mongodb://localhost/tosettledown";

// ## DB CONNECTION 
mongoose.connect(connectionUrl); //-- after "localhost" your db's name follows
const db = mongoose.connection;

//-- Check for DB connection
db.once("open", () => {
    console.log("Connected to MongoDB...");
    console.log("Connected to Database -> ToSettleDown.");
});

//-- check for DB errors
db.on("error", err => {
    Log(err);
});

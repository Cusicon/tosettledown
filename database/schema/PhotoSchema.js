const mongoose = require("mongoose");
module['exports'] = mongoose.model("Photos",
    mongoose.Schema({
        userId: String,
        uploadedOn: String,
        image: {
            name: String,
            location: String,
            isDp: Boolean
        },
    })
);
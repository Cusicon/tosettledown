const mongoose = require("mongoose");
module['exports'] = mongoose.model("Cards",
    mongoose.Schema(
        {
            userId: String,
            uploaded: String,
            image: {
                name: String,
                location: String,
                isDp: Boolean
            },
        }
    )
);
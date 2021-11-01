const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    picture: String,
    email_verified: {
        type: Boolean,
        default: true,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

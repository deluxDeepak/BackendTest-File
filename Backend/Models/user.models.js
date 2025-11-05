const mongoose = require("mongoose");

// const tokenSchema= new mongoose.Schema({

// })

const UserSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    refreshToken: [{
        token: String,
        createdAt: Number,
        expiry: Date,
        device: String
    }]

});

const User = mongoose.model("User", UserSchema);
module.exports = User;


const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const HASH_ROUND = 10

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
}, { timestamps: true })

userSchema.pre("save", function(next) {
    if (!this.isModified("password")) {
        return next()
    }

    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
});

module.exports = mongoose.model("User", userSchema)
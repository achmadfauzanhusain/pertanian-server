const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const HASH_ROUND = 10

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username harus diisi!"],
    },
    province: {
        type: String,
        required: [true, "provinsi harus diisi!"]
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "password harus diisi!"],
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
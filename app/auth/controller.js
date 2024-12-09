const User = require("../user/model")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { jwtkey } = require("../../config")

module.exports = {
    register: async(req, res) => {
        try {
            const { username, province, password } = req.body

            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: `username ${username} sudah terdaftar!` })
            }

            const newUser = new User({
                username,
                province,
                password,
            })
            const savedUser = await newUser.save()
            res.status(201).json({ data: savedUser })
        } catch (err) {
            res.status(500).json({ err: err.message || "Internal server error" })
        }
    },
    login: async(req, res) => {
        const { username, password } = req.body
        User.findOne({ username }).then((user) => {
            if(user) {
                const checkPassword = bcrypt.compareSync(password, user.password)
                if(checkPassword) {
                    const token = jwt.sign({
                        user: {
                            id: user._id,
                            username: user.username,
                            province: user.province,
                            email: user.email,
                        }
                    }, jwtkey)

                    res.status(200).json({ data: token })
                } else {
                    res.status(403).json({
                        message: `data yang anda masukkan salah!`
                    })
                }
            } else {
                res.status(403).json({
                    message: `data yang anda masukkan salah!`
                })
            }
        })
    }
}
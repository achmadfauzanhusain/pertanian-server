const User = require("../user/model")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { jwtkey } = require("../../config")

module.exports = {
    register: async(req, res) => {
        try {
            const { username, province, email, password } = req.body

            // cek valid email
            const isEmail = validator.isEmail(email)
            if(isEmail) {
                // cek duplikat email
                const existingEmail = await User.findOne({ email });
                console.log(existingEmail)
                if (existingEmail) {
                    return res.status(400).json({ message: `email ${email} sudah terdaftar!` });
                }
    
                // cek duplikat username
                const existingUsername = await User.findOne({ username });
                if (existingUsername) {
                    return res.status(400).json({ message: `username ${username} sudah terdaftar!` })
                }

                const newUser = new User({
                    username,
                    province,
                    email,
                    password,
                })
                const savedUser = await newUser.save()
                res.status(201).json({ data: savedUser })
            } else {
                return res.status(400).json({ message: `${email} sudah digunakan!` })
            }
        } catch (err) {
            res.status(500).json({ error: err.message || "Internal server error" })
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
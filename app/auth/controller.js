const User = require("../user/model")
const validator = require("validator")

module.exports = {
    register: async(req, res) => {
        try {
            const { username, province, email, password } = req.body

            // cek valid email
            const isEmail = validator.isEmail(email)

            // cek duplikat email
            if(isEmail) {
                const existingEmail = await User.findOne({ email });
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
        } catch (error) {
            res.status(500).json({ error: err.message || "Internal server error" })
        }
    }
}
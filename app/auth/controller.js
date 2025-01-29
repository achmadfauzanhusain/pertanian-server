const jwt = require("jsonwebtoken")
const { jwtkey } = require("../../config")

const { colUser } = require("../../db/firebase")
const {
    addDoc, getDocs,
    serverTimestamp,
    query, where,
} = require("firebase/firestore")

module.exports = {
    register: async(req, res) => {
        try {
            const { username, province, password } = req.body

            if (/\s/.test(username)) {
                return res.status(400).json({ message: "username tidak boleh mengandung spasi!" })
            }

            // Cek duplikat username di Firestore
            const q = query(colUser, where("username", "==", username));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                return res.status(400).json({ message: `username ${username} sudah terdaftar!` });
            }

            await addDoc(colUser, {
                id: Date.now(),
                username,
                province,
                password,
                createdAt: serverTimestamp(),
            })
            res.status(201).json({ message: "register berhasil!" })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const checkUsername = query(colUser, where("username", "==", username));
            const querySnapshot = await getDocs(checkUsername);
            
            if (querySnapshot.empty) {
                return res.status(403).json({ message: "Data yang anda masukkan salah!" });
            } else {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();

                if(userData.password === password) {
                    const token = jwt.sign({
                        user: {
                            id: userData.id,
                            username: userData.username,
                            province: userData.province,
                            email: userData.email ? userData.email : "",
                        }
                    }, jwtkey);
                        
                    res.status(200).json({ data: token });
                }  else {
                    return res.status(403).json({ message: "Password salah!" });
                }
            }
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" });
        }
    }
}
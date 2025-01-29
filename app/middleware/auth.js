const jwt = require("jsonwebtoken");
const { colUser } = require("../../db/firebase");
const { 
    getDocs, docs,
    where, query 
} = require("firebase/firestore");
const { jwtkey } = require("../../config");

module.exports = {
    isLoginUser: async (req, res, next) => {
        try {
            const token = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null;
            const data = jwt.verify(token, jwtkey);

            // Ambil data user dari Firestore berdasarkan user ID
            const q = query(colUser, where("id", "==", data.user.id));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error("User not found in Firestore");
            }

            const userDoc = querySnapshot.docs[0];  // Ambil dokumen pertama
            const userData = userDoc.data(); // Ambil data dari dokumen

            req.user = { id: userDoc.id, ...userData };
            req.token = token;

            next();
        } catch (err) {
            res.status(401).json({
                error: 'Not authorized to access this'
            });
        }
    }
};

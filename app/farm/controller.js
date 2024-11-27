const { auth, db, colRef } = require("../../db/firebase")
const { 
    onSnapshot,
    addDoc, deleteDoc, updateDoc, doc,
    serverTimestamp
} = require("firebase/firestore")

module.exports = {
    createFarm: async(req, res) => {
        try {
            addDoc(colRef, {
                
            })
        } catch (err) {
            res.status(500).json({ error: err.message || "Internal server error" })
        }
    }
}
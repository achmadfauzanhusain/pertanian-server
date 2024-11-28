const { db, colRef } = require("../../db/firebase")
const { 
    onSnapshot,
    addDoc, deleteDoc, updateDoc, doc,
    serverTimestamp
} = require("firebase/firestore")

module.exports = {
    getFarm: async(req, res) => {
        try {
            onSnapshot(colRef, (snapshot) => {
                let farms = []
                snapshot.docs.forEach((doc) => {
                    if(doc.data().user === req.user.id) {
                        farms.push({ ...doc.data(), id: doc.id })
                        res.status(200).json({ data: farms })
                    } else {
                        res.status(200).json({ message: "have no farm!" })
                    }
                })
                
            })
        } catch (err) {
            res.status(500).json({ error: err.message || "Internal server error" })
        }
    },
    createFarm: async(req, res) => {
        try {
            const { plant, landArea, price, productionCost, yields } = req.body

            await addDoc(colRef, {
                user: req.user.id,
                plant,
                landArea,
                price,
                productionCost,
                yields,
                workers: [],
                createdAt: serverTimestamp(),
            })

            res.status(201).json({ message: "Farm created successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message || "Internal server error" })
        }
    },
    deleteFarm: async(req, res) => {
        try {
            const { idFarm } = req.params
            if(idFarm) {
                const docRef = doc(colRef, idFarm)
                deleteDoc(docRef)
                res.status(201).json({ message: "deleted successfully!" })
            } else {
                res.status(400).json({ message: "id Farm not valid!" })
            }
        } catch (err) {
            res.status(500).json({ error: err.message || "Internal server error" })
        }
    }
}
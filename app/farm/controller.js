const { db, colRef } = require("../../db/firebase")
const { 
    onSnapshot,
    addDoc, deleteDoc, updateDoc, doc, getDoc,
    serverTimestamp
} = require("firebase/firestore")
const { v4: uuidv4 } = require('uuid');

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
    createFarm: async(req, res) => {cd
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

            res.status(201).json({ message: "farm created successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message || "Internal server error" })
        }
    },
    deleteFarm: async(req, res) => {
        try {
            const { idFarm } = req.params
            const docRef = doc(colRef, idFarm)
            deleteDoc(docRef)
            res.status(201).json({ message: "farm deleted successfully!" })
            
        } catch (err) {
            res.status(500).json({ err: err.message || "Internal server error" })
        }
    },
    createFarmWorkers: async(req, res) => {
        try {
            const { idFarm } = req.params;
            const { name, education, yearOfBirth, division } = req.body;
            
            const docRef = doc(colRef, idFarm);
            
            // Retrieve the current document and its workers array
            const docSnapshot = await getDoc(docRef);
            const existingWorkers = docSnapshot.data().workers || [];
            
            // Create the new worker object
            const newWorker = {
                id: Date.now(),
                name,
                education,
                yearOfBirth,
                division,
            }
            
            // Append the new worker to the existing array
            const updatedWorkers = existingWorkers.concat(newWorker);
            
            // Update the document with the modified workers array
            await updateDoc(docRef, {
                workers: updatedWorkers,
            });
            
            res.status(201).json({ message: "farm updated successfully" })
        } catch (err) {
            res.status(500).json({ err: err.message || "Internal server error" })
        }
    },
    deleteFarmWorkers: async(req, res) => {
        try {
            const { idFarm, idWorker } = req.params
            const docRef = doc(colRef, idFarm)

            const docSnapshot = await getDoc(docRef)
            const existingWorkers = docSnapshot.data().workers || []
        } catch (err) {
            res.status(500).json({ err: err.message || "Internal server error" })
        }
    }
}
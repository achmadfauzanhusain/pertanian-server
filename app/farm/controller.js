const { db, colRef } = require("../../db/firebase")
const { 
    onSnapshot,
    addDoc, deleteDoc, updateDoc, doc, getDoc,
    serverTimestamp,
    query, where
} = require("firebase/firestore")
const { client } = require("../../db/redis")

module.exports = {
    getFarms: async(req, res) => {
        try {
            const redisCheck = await client.get(req.user.username)
            if (redisCheck) {
                const farms = JSON.parse(redisCheck);
                return res.status(200).json({ data: farms }); // Kirim data langsung dari Redis
            } else {
                const q = query(colRef, where("user", "==", req.user.id))
                await onSnapshot(q, async(snapshot) => {
                    let farms = []
                    snapshot.docs.forEach((doc) => {
                        farms.push({ ...doc.data(), id: doc.id })
                    })
                    res.status(200).json({ data: farms })
    
                    // Simpan data ke Redis secara asinkron
                    client.setEx(req.user.username, 1700, JSON.stringify(farms)).catch(console.error);
                })
            }
        } catch (err) {
            res.status(500).json({ error: err.message || "Internal server error" })
        }
    },
    getDetailFarm: async (req, res) => {
        try {
            const { idFarm } = req.params

            const redisCheck = await client.get(idFarm);
            if (redisCheck) {
                const farms = JSON.parse(redisCheck);
                return res.status(200).json({ data: farms }); // Kirim data langsung dari Redis
            } else {
                const docRef = doc(colRef, idFarm);
                onSnapshot(docRef, (docSnapshot) => {
                    const farmData = { ...docSnapshot.data(), id: docSnapshot.id };
                    res.status(200).json({ data: farmData });
    
                    // Simpan data ke Redis secara asinkron
                    client.setEx(idFarm, 1700, JSON.stringify(farmData)).catch(console.error);
                    res.status(404).json({ error: "Farm not found" });
                });
            }
        } catch (err) {
            res.status(500).json({ error: err.message || "Internal server error" });
        }
    },    
    createFarm: async(req, res) => {
        try {
            const { nameFarm, plant, landArea, seed, price, productionCost, yields } = req.body

            await addDoc(colRef, {
                user: req.user.id,
                nameFarm,
                plant,
                landArea,
                seed,
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
    editFarm: async(req, res) => {
        try {
            const { idFarm } = req.params;
            const { nameFarm, plant, landArea, seed, price, productionCost, yields } = req.body

            const docRef = doc(colRef, idFarm)
            await updateDoc(docRef, {
                nameFarm,
                plant,
                landArea,
                seed,
                price,
                productionCost,
                yields
            })

            res.status(200).json({ message: "farm updated successfully" });
        } catch (err) {
            res.status(500).json({ err: err.message || "Internal server error" })
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
            const { name, education, salary, yearOfBirth, division } = req.body;
            
            const docRef = doc(colRef, idFarm);
            
            // Retrieve the current document and its workers array
            const docSnapshot = await getDoc(docRef);
            const existingWorkers = docSnapshot.data().workers || [];
            
            // Create the new worker object
            const newWorker = {
                id: Date.now(),
                name,
                education,
                salary,
                yearOfBirth,
                division,
            }
            
            // Append the new worker to the existing array
            const updatedWorkers = existingWorkers.concat(newWorker);
            
            // Update the document with the modified workers array
            await updateDoc(docRef, {
                workers: updatedWorkers,
            });
            
            res.status(201).json({ message: "worker created successfully" })
        } catch (err) {
            res.status(500).json({ err: err.message || "Internal server error" })
        }
    },
    deleteFarmWorkers: async(req, res) => {
        try {
            const { idFarm, idWorker } = req.params
            const docRef = doc(colRef, idFarm);

            // Retrieve the current document and its workers array
            const docSnapshot = await getDoc(docRef);
            const existingWorkers = docSnapshot.data().workers || [];
        
            // Filter out the worker to be deleted
            const updatedWorkers = existingWorkers.filter(worker => worker.id !== Number(idWorker))
        
            // Update the document with the modified workers array
            await updateDoc(docRef, {
                workers: updatedWorkers,
            })
        
            res.status(200).json({ message: "worker deleted successfully" });
        } catch (err) {
            res.status(500).json({ err: err.message || "Internal server error" })
        }
    }
}
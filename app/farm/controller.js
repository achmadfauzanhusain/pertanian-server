const { db, colRef } = require("../../db/firebase")
const { 
    onSnapshot,
    addDoc, deleteDoc, updateDoc, doc, getDoc,
    serverTimestamp,
    query, where
} = require("firebase/firestore")

module.exports = {
    getFarms: async(req, res) => {
        try {
            const q = query(colRef, where("user", "==", req.user.id));
        
            // Mendengarkan perubahan data real-time, namun hanya mengirimkan respons sekali
            let sentResponse = false;
            const unsubscribe = onSnapshot(q, (snapshot) => {
                if (!sentResponse) {
                    let farms = [];
                    snapshot.docs.forEach((doc) => {
                        farms.push({ ...doc.data(), id: doc.id });
                    });
                    res.status(200).json({ data: farms });
                    sentResponse = true;  // Pastikan respons hanya dikirim sekali
                }
            });
    
            // Bersihkan listener setelah respons terkirim
            return () => unsubscribe();
        } catch (err) {
            res.status(500).json({ error: err.message || "Internal server error" })
        }
    },
    getDetailFarm: async (req, res) => {
        try {
            const { idFarm } = req.params;
            const docRef = doc(colRef, idFarm);
            
            // Mengambil dokumen sekali menggunakan getDoc
            const docSnapshot = await getDoc(docRef);
            
            if (docSnapshot.exists()) {
                const farmData = { ...docSnapshot.data(), id: docSnapshot.id };
                res.status(200).json({ data: farmData });
            } else {
                res.status(404).json({ error: "Farm not found" });
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

            res.status(201).json({
                message: "farm created successfully" 
            });
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
            await deleteDoc(docRef)
            res.status(200).json({ message: "farm deleted successfully!" })
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
const { initializeApp } = require("firebase/app")
const { getFirestore, collection } = require("firebase/firestore")

const firebaseConfig = {
    apiKey: "AIzaSyAnkBSGaeqlRgQAXHJF9PTHa-T-NZNr7Ao",
    authDomain: "pertanian-app.firebaseapp.com",
    projectId: "pertanian-app",
    storageBucket: "pertanian-app.firebasestorage.app",
    messagingSenderId: "1049538273775",
    appId: "1:1049538273775:web:c105859446c3180246d61a",
    measurementId: "G-TPM23VF3YR"
}

initializeApp(firebaseConfig)

const db = getFirestore()
const colRef = collection(db, "farms")
const colRef2 = collection(db, "liveStocks")

module.exports = { db, colRef, colRef2 }
import { initializeApp } from "firebase/app"
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAnkBSGaeqlRgQAXHJF9PTHa-T-NZNr7Ao",
    authDomain: "pertanian-app.firebaseapp.com",
    projectId: "pertanian-app",
    storageBucket: "pertanian-app.firebasestorage.app",
    messagingSenderId: "1049538273775",
    appId: "1:1049538273775:web:07ea3f5cf7ae9af846d61a",
    measurementId: "G-1PV0BHWZZL"
}

initializeApp(firebaseConfig)

const auth = getAuth()
const db = getFirestore()
const colRef = collection(db, "data")

module.exports = { auth, db, colRef }
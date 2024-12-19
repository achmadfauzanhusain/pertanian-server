const { initializeApp } = require("firebase/app")
const { getFirestore, collection } = require("firebase/firestore")

import { firebaseKey, firebaseAuthDomain, firebaseMessaginSenderId, firebaseAppId } from "../config"

const firebaseConfig = {
    apiKey: firebaseKey,
    authDomain: firebaseAuthDomain,
    projectId: "pertanian-app",
    storageBucket: "pertanian-app.firebasestorage.app",
    messagingSenderId: firebaseMessaginSenderId,
    appId: firebaseAppId,
    measurementId: "G-TPM23VF3YR"
}

initializeApp(firebaseConfig)

const db = getFirestore()
const colRef = collection(db, "farms")
const colRef2 = collection(db, "liveStocks")

module.exports = { db, colRef, colRef2 }
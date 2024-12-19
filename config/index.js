const dotenv = require("dotenv")
const path = require("path")

dotenv.config()

module.exports = {
    serviceName: process.env.SERVICE_NAME,
    urlDb: process.env.MONGO_URL,
    jwtkey: process.env.JWT_KEY,
    rootPath: path.resolve(__dirname, ".."),

    firebaseKey: process.env.FIREBASE_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseMessaginSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
    firebaseAppId: process.env.FIREBASE_APP_ID
}
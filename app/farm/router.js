const express = require("express")
const { createFarm } = require("./controller")

const router = express.Router()

router.post("/", createFarm)

module.exports = router
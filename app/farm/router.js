const express = require("express")
const { getFarm, createFarm, deleteFarm } = require("./controller")
const { isLoginUser } = require("../middleware/auth")

const router = express.Router()

router.get("/", isLoginUser, getFarm)
router.post("/", isLoginUser, createFarm)
router.delete("/:idFarm", isLoginUser, deleteFarm)

module.exports = router
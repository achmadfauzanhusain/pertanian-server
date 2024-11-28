const express = require("express")
const { getFarm, createFarm, deleteFarm, createFarmWorkers, deleteFarmWorkers } = require("./controller")
const { isLoginUser } = require("../middleware/auth")

const router = express.Router()

router.get("/", isLoginUser, getFarm)
router.post("/", isLoginUser, createFarm)
router.put("/worker/:idFarm", isLoginUser, createFarmWorkers)
router.put("/worker/:idFarm/:idWorker", isLoginUser, deleteFarmWorkers)

module.exports = router
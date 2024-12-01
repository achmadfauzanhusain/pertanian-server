const express = require("express")
const { getFarms, getDetailFarm, createFarm, deleteFarm, createFarmWorkers, deleteFarmWorkers, editFarm } = require("./controller")
const { isLoginUser } = require("../middleware/auth")

const router = express.Router()

router.get("/", isLoginUser, getFarms)
router.get("/:idFarm", isLoginUser, getDetailFarm)
router.post("/", isLoginUser, createFarm)
router.put("/:idFarm", isLoginUser, editFarm)
router.delete("/:idFarm", isLoginUser, deleteFarm)
router.put("/worker/:idFarm", isLoginUser, createFarmWorkers)
router.put("/worker/:idFarm/:idWorker", isLoginUser, deleteFarmWorkers)

module.exports = router
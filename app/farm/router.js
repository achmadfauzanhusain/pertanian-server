const express = require("express")
const { getFarm, createFarm, deleteFarm, createFarmWorkers } = require("./controller")
const { isLoginUser } = require("../middleware/auth")

const router = express.Router()

router.get("/", isLoginUser, getFarm)
router.post("/", isLoginUser, createFarm)
router.put("/:idFarm", isLoginUser, createFarmWorkers)
router.delete("/:idFarm", isLoginUser, deleteFarm)

module.exports = router
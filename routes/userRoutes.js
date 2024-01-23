const { verify } = require("crypto");
const { register, login, verifyotp }  = require("../controllers/userController")

const router = require("express").Router();

router.post("/register", register)
router.post("/login", login)
router.post("/verifyotp", verifyotp)

module.exports = router; 
const express = require("express");
const router = express.Router();

const { registeruser, loginUserController } = require("../controller/user.controller");

router.post("/register", registeruser);
router.post("/login", loginUserController);
module.exports = router;
const express = require("express");
const userController = require("../controllers/UserController");
// const {protect} = require("../utils/authMiddleware")

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout)

module.exports = router;
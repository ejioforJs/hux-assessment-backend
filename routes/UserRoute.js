const express = require("express");
const userController = require("../controllers/UserController");

const router = express.Router();

router.post("/signup", userController.signup);
router.get("/login", userController.login);
router.get("/logout", userController.logout);

router.use(userController.protect);

module.exports = router;
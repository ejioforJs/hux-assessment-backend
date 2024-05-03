const express = require("express");
const contactController = require("../controllers/ContactController");

const router = express.Router();

router.post("/addContact", contactController.addContact);
router.post("/editContact", contactController.editContact);
router.post("/deleteContact", contactController.deleteContact)
router.get("/getContacts/:userId", contactController.getContacts)

module.exports = router;
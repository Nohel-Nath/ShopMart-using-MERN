const express = require("express");

const router = express.Router();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());

const contactController = require("../controllers/contactController");
router.post("/message", contactController.contactAdmin);

module.exports = router;

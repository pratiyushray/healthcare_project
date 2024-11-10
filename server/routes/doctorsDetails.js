const express = require("express");
const router = express.Router();
const { registerDoctor, getAllDoctors } = require("../controllers/doctorsDetailsController");
const { jwtAuthMiddleware } = require("../middleware/jwtMiddleware");

// Route to register a new doctor
router.post("/create",jwtAuthMiddleware, registerDoctor);

// Route to get all doctors
router.get("/", getAllDoctors); // This route fetches all doctor details

module.exports = router;
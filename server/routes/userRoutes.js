const express = require("express");
const router = express.Router();

// Import controller functions
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require("../controllers/userController");

// Import authentication middleware
const { jwtAuthMiddleware } = require("../middleware/jwtMiddleware");

// Route for user registration (Public route)
router.post("/register", registerUser); // This is fine for public registration

// Route for user login (Public route)
router.post("/login", loginUser); // This is fine for public login

//Route for Get the user specific data
router.get("/myaccount",jwtAuthMiddleware,getUserProfile)

//Route for Updating the user specific data.
router.patch("/myaccount",jwtAuthMiddleware,updateUserProfile)

module.exports = router;

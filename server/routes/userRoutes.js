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

// Route for getting the current user's profile (Protected route)
router.get("/profile", jwtAuthMiddleware, getUserProfile); // Ensures only authenticated users can access their profile

// Route for updating the user's profile (Protected route)
router.put("/profile", jwtAuthMiddleware, updateUserProfile); // Ensures only authenticated users can update their profile

module.exports = router;

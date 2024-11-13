const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const { generateToken } = require("../middleware/jwtMiddleware");

// @route   POST /api/user/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password || !phoneNumber) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // Create the user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ message: "Error registering user" });
  }
});

// @desc    Authenticate user
// @route   POST /api/user/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ success: false, error: "User not found or account is deleted." });
  }

  // Check password
  if (await bcrypt.compare(password, user.password)) {
    // Generate JWT token
    const token = generateToken(user.toJSON());
    
    // Send the token in the Authorization header
    res.setHeader('Authorization', `Bearer ${token}`);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      token: token // Including the token in the body as well (optional)
    });
  } else {
    return res.status(401).json({ message: "Invalid email or password" });
  }
});

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    // Avoid sending password in the response for security reasons
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password:user.password
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private (Only logged-in users can update their profile)
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  // Check if the user exists
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update only the fields the user has provided
  if (name) user.name = name;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;

  // If a new password is provided, hash it before saving
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  try {
    // Save the updated user profile to the database
    const updatedUser = await user.save();

    // Send the updated user info in the response, excluding the password
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,

    });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Export all controller functions
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};

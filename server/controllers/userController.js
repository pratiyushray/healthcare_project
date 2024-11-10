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

  // Create the user
  const user = await User.create({
    name,
    email,
    phoneNumber,
    password: hashedPassword,
  });

  res.status(201).json({ message: "User registered successfully", user });
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

    // Optionally, you can send other user information in the response body as well
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

// Export all controller functions
module.exports = {
  registerUser,
  loginUser
};

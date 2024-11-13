const jwt = require('jsonwebtoken');
require('dotenv').config();  // Ensure this is loaded for environment variables

// Constants for JWT configuration
const JWT_SECRET = process.env.JWT_SECRET; // Securely load from environment variables
const TOKEN_EXPIRY = '24h'; // Token expiry time

// Middleware to authenticate using JWT
const jwtAuthMiddleware = (req, res, next) => {
    try {
        // Check for Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Authorization header missing',
                message: 'Please provide a valid token' 
            });
        }

        // Verify token format (Bearer scheme)
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Invalid token format',
                message: 'Token must use Bearer scheme' 
            });
        }

        // Extract the token
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                error: 'Token not provided',
                message: 'Please provide a valid token' 
            });
        }

        // Verify the token using the secret and specified algorithm
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ['HS256'] // Explicitly specify the algorithm
        });

        // Attach decoded user information to request
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error('JWT Verification Error:', error.name, error.message);
        
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expired',
                message: 'Please login again' 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Invalid token',
                message: 'Token validation failed' 
            });
        }

        // Generic error
        return res.status(500).json({ 
            error: 'Authentication error',
            message: 'An error occurred during authentication' 
        });
    }
};

// Function to generate JWT token
const generateToken = (userData) => {
    try {
        // Ensure JWT_SECRET is available
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured in environment variables');
        }

        // Generate token with user data and expiration
        return jwt.sign(
            { id: userData._id, name: userData.name, email: userData.email }, // Only send necessary info (avoid sending sensitive data like password)
            JWT_SECRET,
            {
                expiresIn: TOKEN_EXPIRY,
                algorithm: 'HS256'  // Explicitly specify the algorithm
            }
        );
    } catch (error) {
        console.error('Token Generation Error:', error);
        throw new Error('Failed to generate token');
    }
};

module.exports = { jwtAuthMiddleware, generateToken };

const User = require('../models/User');

/**
 * Authentication middleware to verify user credentials
 * This middleware validates if the provided email and password match a valid user
 */
exports.authenticate = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // More detailed logging to debug the request body
    console.log('Authentication request body:', req.body);
    
    if (!email || !password) {
      console.log('Authentication failed: Missing credentials:', { 
        emailProvided: !!email, 
        passwordProvided: !!password 
      });
      return res.status(400).json({
        success: false,
        message: 'Email and password are required for authentication',
        details: {
          emailProvided: !!email,
          passwordProvided: !!password
        }
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Authentication failed: User not found -', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Verify password
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      console.log('Authentication failed: Invalid password for user -', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // If authentication successful, attach user to request object
    console.log('Authentication successful for user:', email);
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed due to server error',
      error: error.message
    });
  }
};

exports.requireAuth = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const user = await User.findOne({ sessionId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3
  }
}, {
  timestamps: true,
  collection: 'user'
});

// Drop all indexes and create only email index
userSchema.index({ email: 1 }, { unique: true });

// Hash password before saving
/* 
userSchema.pre('save', async function(next) {
  try {
    // Only hash the password if it's modified (or new)
    if (!this.isModified('password')) return next();
    
    console.log('Hashing password for user:', this.email);
    
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);
    
    // Replace the plaintext password with the hashed one
    this.password = hashedPassword;
    
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});
*/

// Generate JWT for password reset
userSchema.methods.generateResetToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );
};

// Verify password reset token
userSchema.statics.verifyPasswordResetToken = function(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
};

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  /* 
  try {
    // Use bcrypt to compare the provided password with the hashed password
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
  */
  
  // Direct string comparison (for testing without hashing)
  return candidatePassword === this.password;
};

userSchema.post('save', function(doc) {
  console.log('User saved:', {
    id: doc._id,
    fullName: doc.fullName,
    email: doc.email,
  });
});

userSchema.post('findOne', function(doc) {
  if (doc) {
    console.log('User found:', {
      id: doc._id,
      fullName: doc.fullName,
      email: doc.email,
    });
  } else {
    console.log('No user found');
  }
});

const User = mongoose.model('User', userSchema);

// Drop all indexes when the model is first loaded
User.collection.dropIndexes().catch(err => {
  if (err.code !== 26) { // Ignore error if collection doesn't exist
    console.error('Error dropping indexes:', err);
  }
});

module.exports = User; 
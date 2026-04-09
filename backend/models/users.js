const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//====== define UserSchema ======
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true, // clear whitespace
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  // create this two: createdAt and updatedAt 
  { timestamps: true } 
);

// encrypt password before saving
// pre(save) is a middleware that runs before saving a document. We use it to hash the password before storing it in the database.
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // newest mongonDB does not support next() when you write pre('save) with asycn function. it treat next as a noramal function not callback f.
    // next(); // we need next() here to move on to the next middleware or save the document. If we forget it, the save operation will hang indefinitely.
});

// compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('users', userSchema);
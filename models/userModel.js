const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minLength: 3,
    maxLength: 20,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [/\S+@\S+\.\S+/, 'Please provide valid email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: 6,
  },
});

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hashSync(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candicatePassword) {
  const isMatch = await bcrypt.compare(candicatePassword, this.password);
  return isMatch;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
